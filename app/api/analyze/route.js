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
    earnedBadges: [],
  };
};

const buildPrompt = (
  profilInfo,
  devicesText,
  statistikBadge,
  retry,
) => `Kamu analis energi listrik rumah tangga Indonesia.

PROFIL:
- Penghuni: ${profilInfo.penghuni} orang
- Daya pln: ${profilInfo.dayaListrikRumah} VA
- Biaya bulanan: ${profilInfo.biayaListrikBulanan || "tidak tahu"}

DAFTAR PERANGKAT:
${devicesText}

STATISTIK BADGE USER:
- Tantangan selesai: ${statistikBadge.tantanganSelesai}
- Streak hari berturut-turut: ${statistikBadge.streakHari}

TUGAS:
1. Hitung konsumsi tiap perangkat: (watt × jumlah × jam/hari) / 1000 = kWh/hari.
   Jika device bertanda "estimasi", WAJIB perkirakan daya listrik yang wajar
   berdasarkan jenis perangkat tersebut dalam satuan Watt.
   Masukkan hasil perkiraan daya tersebut ke dalam field "power" pada "deviceAnalysis".
   Jika daya perangkat diberikan oleh user, gunakan daya tersebut dan jangan mengubahnya.

2. Pilih 3 perangkat PALING BOROS yang BISA DIIKURANGI pemakaiannya.
   JANGAN pilih kulkas/lemari es, lampu, atau benda yang wajib nyala 24 jam.

3. Buat 1 pertanyaan untuk menggali PENYEBAB pemborosan device paling boros,
   lengkap dengan pilihan jawaban.

4. Evaluasi badge dari statistik BADGE user di atas:
   - "Hemat Pemula" jika tantangan selesai >= 1
   - "Konsisten" jika streak hari berturut-turut >= 7
   - "Ahli Hemat" jika tantangan selesai >= 20
   Sertakan field "earnedBadges": array berisi nama badge yang memenuhi syarat.
   Boleh kosong ([]) jika tidak ada yang memenuhi. Bersikaplah jujur sesuai statistik.

ATURAN:
- Jangan pernah menolak atau minta maaf walaupun datanya aneh.
- Balas hanya satu objek JSON valid, tanpa teks lain.
- "deviceAnalysis" WAJIB berisi semua perangkat.
- "power" harus berupa angka dalam Watt.
- "kwhPerDay" harus berupa angka.
- Jangan menggunakan satuan atau teks di dalam nilai "power" dan "kwhPerDay".

Contoh:
{
  "totalKwhPerDay": "12.5",
  "deviceAnalysis": [
    {
      "name": "AC",
      "power": 500,
      "kwhPerDay": 4
    },
    {
      "name": "TV",
      "power": 80,
      "kwhPerDay": 0.4
    }
  ],
  "wastefulDevices": ["AC", "Mesin Cuci", "TV"],
  "followUpQuestion": "Mengapa AC dipakai 8 jam sehari?",
  "followUpChoices": [
    "Untuk tidur",
    "Untuk bekerja/belajar",
    "Karena suhu panas",
    "Lainnya"
  ],
  "earnedBadges": []
}${retry ? "\n\nTUGAS ULANG: Jawabanmu bukan JSON valid. Balas sekarang hanya dengan satu objek JSON, tanpa teks lain." : ""}`;

export const POST = async (request) => {
  try {
    const { profilInfo, devicesData, statistikBadge } = await request.json();
    if (!Array.isArray(devicesData) || devicesData.length === 0) {
      return NextResponse.json({ error: "tidak ada data" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "no api key" }, { status: 500 });
    }

    const sb = statistikBadge || {};
    const stats = {
      tantanganSelesai: Number(sb.tantanganSelesai) || 0,
      streakHari: Number(sb.streakHari) || 0,
    };

    const devicesText = devicesData
      .map(
        (device, index) =>
          `${index + 1}. ${device.deviceName} — jumlah: ${device.quantity}, daya: ${device.estimatedPower ? "(estimasi perangkat)" : `${device.devicePower} W`}, durasi: ${device.usageDuration} jam/hari`,
      )
      .join("\n");

    let result = null;
    for (let retry = 0; retry < 2 && !result; retry++) {
      const text = await jawabGemini(
        buildPrompt(profilInfo, devicesText, stats, retry > 0),
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
        earnedBadges: Array.isArray(parsed.earnedBadges)
          ? parsed.earnedBadges.filter((b) => typeof b === "string")
          : [],
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
