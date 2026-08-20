import { NextResponse } from "next/server";

const model = "gemini-3.5-flash";

const jawabGemini = async (prompt, apiKey) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Gemini API gagal");
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};

const ambilJson = (text) => {
  const payload = text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1] ?? text;
  const match = payload.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed?.wastefulDevices) &&
      parsed.wastefulDevices.length
      ? parsed
      : null;
  } catch {
    return null;
  }
};

const hitungFallback = (devicesData) => {
  const rows = (devicesData || [])
    .map((device) => ({
      nama: device.deviceName,
      kWh:
        (Number(device.devicePower) *
          (Number(device.quantity) || 1) *
          Number(device.usageDuration)) /
        1000,
    }))
    .filter((row) => row.kWh > 0);
  if (!rows.length) return null;

  const total = rows.reduce((sum, row) => sum + row.kWh, 0);
  const candidates = rows
    .filter((row) => !/kulkas|lemari|lampu/i.test(row.nama))
    .sort((a, b) => b.kWh - a.kWh);
  const top = (candidates.length >= 3 ? candidates : rows).slice(0, 3);
  const followUpQuestion = `Mengapa ${top[0].nama} dipakai ${devicesData.find((d) => d.deviceName === top[0].nama)?.usageDuration ?? "?"} jam sehari?`;

  return {
    totalKwhPerDay: String(Math.round(total * 100) / 100),
    wastefulDevices: top.map((row) => row.nama),
    followUpQuestion,
    followUpChoices: [
      "Untuk tidur",
      "Untuk bekerja/belajar",
      "Karena suhu panas",
      "Lainnya",
    ],
    summary: `Total konsumsi ${String(Math.round(total * 100) / 100)} kWh/hari. Mulai hemat dari ${top[0].nama}.`,
  };
};

// const buildPrompt = (profilInfo, devicesText, retry) => `Kamu analis energi listrik rumah tangga Indonesia.

// PROFIL:
// - Penghuni: ${profilInfo.penghuni} orang
// - Daya pln: ${profilInfo.dayaListrikRumah} VA
// - Biaya bulanan: ${profilInfo.biayaListrikBulanan || "tidak tahu"}

// DAFTAR PERANGKAT:
// ${devicesText}

// TUGAS:
// 1. Hitung konsumsi tiap perangkat: (watt × jumlah × jam/hari) / 1000 = kWh/hari.
//    Untuk device bertanda "estimasi", perkirakan daya wajar perangkat tsb.
// 2. Pilih 3 perangkat PALING BOROS yang BISA DIIKURANGI pemakaiannya.
//    JANGAN pilih kulkas/lemari es, lampu, atau benda yang wajib nyala 24 jam.
// 3. Buat 1 pertanyaan untuk menggali PENYEBAB pemborosan device paling boros,
//    lengkap dengan pilihan jawaban.

// ATURAN: Jangan pernah menolak atau minta maaf walaupun datanya aneh. Balas hanya satu objek JSON valid, tanpa teks lain
// Contoh:
// {
//   "totalKwhPerDay": "12.5",
//   "wastefulDevices": ["AC", "Mesin Cuci", "TV"],
//   "followUpQuestion": "Mengapa AC dipakai 8 jam sehari?",
//   "followUpChoices": ["Untuk tidur", "Untuk bekerja/belajar", "Karena suhu panas", "Lainnya"]
// }${retry ? "\n\nTUGAS ULANG: Jawabanmu bukan JSON valid. Balas sekarang hanya dengan satu objek JSON, tanpa teks lain." : ""}`;

// const buildPrompt = (profilInfo, devicesText, retry) => `Kamu analis energi listrik rumah tangga Indonesia.

// PROFIL:
// - Penghuni: ${profilInfo.penghuni} orang
// - Daya PLN: ${profilInfo.dayaListrikRumah} VA
// - Biaya bulanan: ${profilInfo.biayaListrikBulanan || "tidak tahu"}

// DAFTAR PERANGKAT:
// ${devicesText}

// TUGAS:
// 1. Hitung konsumsi tiap perangkat:
//    (watt × jumlah × jam/hari) / 1000 = kWh/hari.

// 2. Jika perangkat bertanda "(estimasi perangkat)",
//    tentukan perkiraan daya listrik yang wajar dalam Watt untuk perangkat tersebut.

// 3. Masukkan hasil estimasi daya tersebut ke dalam "deviceAnalysis".

// 4. Pilih maksimal 3 perangkat PALING BOROS yang BISA DIKURANGI pemakaiannya.
//    JANGAN pilih kulkas/lemari es, lampu, atau benda yang wajib menyala 24 jam.

// 5. Buat 1 pertanyaan untuk menggali PENYEBAB pemborosan perangkat paling boros,
//    lengkap dengan pilihan jawaban.

// Balas HANYA satu objek JSON valid tanpa markdown atau teks tambahan.

// FORMAT WAJIB:
// {
//   "totalKwhPerDay": "12.5",
//   "deviceAnalysis": [
//     {
//       "name": "AC",
//       "estimatedPower": 500,
//       "kwhPerDay": 4
//     },
//     {
//       "name": "TV",
//       "estimatedPower": 80,
//       "kwhPerDay": 0.4
//     }
//   ],
//   "wastefulDevices": ["AC", "TV", "Mesin Cuci"],
//   "followUpQuestion": "Mengapa AC dipakai 8 jam sehari?",
//   "followUpChoices": [
//     "Untuk tidur",
//     "Untuk bekerja/belajar",
//     "Karena suhu panas",
//     "Lainnya"
//   ]
// }
// ${retry ? "\nTUGAS ULANG: Balas hanya JSON valid sesuai format di atas." : ""}`;

export const POST = async (request) => {
  try {
    const { profilInfo, devicesData } = await request.json();
    if (!Array.isArray(devicesData) || devicesData.length === 0) {
      return NextResponse.json({ error: "tidak ada data" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "no api key" }, { status: 500 });
    }

    const devicesText = devicesData
      .map(
        (device, index) =>
          `${index + 1}. ${device.deviceName} — jumlah: ${device.quantity}, daya: ${device.estimatedPower ? "(estimasi perangkat)" : `${device.devicePower} W`}, durasi: ${device.usageDuration} jam/hari`,
      )
      .join("\n");

    let result = null;
    for (let retry = 0; retry < 2 && !result; retry++) {
      const text = await jawabGemini(
        buildPrompt(profilInfo, devicesText, retry > 0),
        apiKey,
      );
      const parsed = ambilJson(text);
      if (!parsed) continue;

      result = {
        totalKwhPerDay: parsed.totalKwhPerDay ?? "",
        wastefulDevices: parsed.wastefulDevices,
        followUpQuestion:
          parsed.followUpQuestion ||
          `Mengapa ${parsed.wastefulDevices[0]} dipakai setiap hari?`,
        followUpChoices: parsed.followUpChoices || [
          "Untuk tidur",
          "Untuk bekerja/belajar",
          "Lainnya",
        ],
        summary: `Total konsumsi ${parsed.totalKwhPerDay ?? "?"} kWh/hari. Mulai hemat dari ${parsed.wastefulDevices[0]}.`,
      };
    }

    result = result || hitungFallback(devicesData);
    if (!result) {
      return NextResponse.json(
        { error: "AI gagal dan data kurang untuk dihitung ulang." },
        { status: 422 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
};
