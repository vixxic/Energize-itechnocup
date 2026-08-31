import { NextResponse } from "next/server";

const model = "gemini-3.5-flash";

const jawabGemini = async (prompt, apiKey) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Gemini API gagal");
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};

const ambilJson = (text) => {
  if (!text) return null;

  const payload = text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1] ?? text;

  const match = payload.match(/\{[\s\S]*\}/);

  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);

    if (
      !Array.isArray(parsed?.wastefulDevices) ||
      !Array.isArray(parsed?.deviceAnalysis)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const getEnergyCategory = (score) => {
  if (score >= 90) return "Sangat Efisien";
  if (score >= 75) return "Efisien";
  if (score >= 60) return "Cukup Efisien";
  if (score >= 40) return "Boros";
  return "Sangat Boros";
};

const estimasiDaya = (nama) => {
  const name = String(nama || "").toLowerCase();

  if (/ac|air conditioner/.test(name)) {
    return 500;
  }

  if (/kulkas|lemari es|refrigerator/.test(name)) {
    return 150;
  }

  if (/tv|televisi/.test(name)) {
    return 80;
  }

  if (/rice cooker|magic com|penanak nasi/.test(name)) {
    return 300;
  }

  if (/kipas|fan/.test(name)) {
    return 45;
  }

  if (/lampu|led/.test(name)) {
    return 12;
  }

  if (/mesin cuci|washing machine/.test(name)) {
    return 400;
  }

  if (/laptop|notebook/.test(name)) {
    return 65;
  }

  if (/komputer|pc|desktop/.test(name)) {
    return 250;
  }

  if (/setrika|iron/.test(name)) {
    return 350;
  }

  if (/pompa air|water pump/.test(name)) {
    return 250;
  }

  if (/dispenser/.test(name)) {
    return 300;
  }

  if (/microwave/.test(name)) {
    return 1000;
  }

  if (/oven/.test(name)) {
    return 1200;
  }

  if (/blender/.test(name)) {
    return 300;
  }

  if (/vacuum/.test(name)) {
    return 700;
  }

  if (/hair dryer/.test(name)) {
    return 800;
  }

  return 100;
};

const hitungFallback = (devicesData) => {
  const rows = (devicesData || []).map((device) => {
    const nama = device.deviceName || "Perangkat tidak diketahui";

    const quantity = Number(device.quantity) || 1;
    const usageDuration = Number(device.usageDuration) || 0;

    const power = device.estimatedPower
      ? estimasiDaya(nama)
      : Number(device.devicePower) || 0;

    const kWh = (power * quantity * usageDuration) / 1000;

    return {
      nama,
      power,
      kWh,
      usageDuration,
    };
  });

  const validRows = rows.filter((row) => row.kWh > 0);

  if (!validRows.length) return null;

  const total = validRows.reduce((sum, row) => sum + row.kWh, 0);

  const candidates = validRows
    .filter((row) => !/kulkas|lemari es|lemari pendingin|lampu/i.test(row.nama))
    .sort((a, b) => b.kWh - a.kWh);

  const top = (candidates.length >= 3 ? candidates : validRows).slice(0, 3);

  const followUpCandidate = validRows
    .filter((row) => !/kulkas|lemari es|lemari pendingin|lampu/i.test(row.nama))
    .sort((a, b) => {
      const scoreA = a.kWh * 0.6 + Math.min(a.usageDuration, 24) * 0.4;

      const scoreB = b.kWh * 0.6 + Math.min(b.usageDuration, 24) * 0.4;

      return scoreB - scoreA;
    })[0];

  const totalKwhPerDay = Math.round(total * 100) / 100;

  let energyScore = 100;

  if (totalKwhPerDay > 20) {
    energyScore -= 55;
  } else if (totalKwhPerDay > 15) {
    energyScore -= 45;
  } else if (totalKwhPerDay > 10) {
    energyScore -= 35;
  } else if (totalKwhPerDay > 7) {
    energyScore -= 25;
  } else if (totalKwhPerDay > 5) {
    energyScore -= 15;
  } else if (totalKwhPerDay > 3) {
    energyScore -= 5;
  }

  const highestConsumption = top[0]?.kWh || 0;

  if (highestConsumption > 5) {
    energyScore -= 20;
  } else if (highestConsumption > 3) {
    energyScore -= 15;
  } else if (highestConsumption > 2) {
    energyScore -= 10;
  } else if (highestConsumption > 1) {
    energyScore -= 5;
  }

  energyScore = Math.max(0, Math.min(100, Math.round(energyScore)));

  const energyCategory = getEnergyCategory(energyScore);

  const followUpQuestion = followUpCandidate
    ? `${followUpCandidate.nama} digunakan selama ${followUpCandidate.usageDuration} jam sehari. Apa alasan utama penggunaan selama itu?`
    : "Mengapa perangkat tersebut digunakan dalam durasi yang lama?";

  const scoreReason = top[0]
    ? `Skor diturunkan karena ${top[0].nama} menjadi salah satu penyumbang konsumsi energi terbesar dan penggunaannya masih dapat dikurangi.`
    : "Skor dihitung berdasarkan konsumsi energi harian perangkat yang tersedia.";

  return {
    totalKwhPerDay: String(totalKwhPerDay),

    energyScore,

    energyCategory,

    scoreReason,

    deviceAnalysis: rows.map((row) => ({
      name: row.nama,
      power: row.power,
      kwhPerDay: Math.round(row.kWh * 100) / 100,
    })),

    wastefulDevices: top.map((row) => row.nama),

    followUpQuestion,

    followUpChoices: [
      "Untuk tidur",
      "Untuk bekerja/belajar",
      "Karena kebutuhan tertentu",
      "Lainnya",
    ],

    summary: `Total konsumsi ${totalKwhPerDay} kWh/hari. Mulai hemat dari ${
      top[0]?.nama || "perangkat dengan konsumsi tertinggi"
    }.`,

    earnedlencanas: [],
  };
};

const buildPrompt = (profilInfo, devicesText, statistiklencana, retry) => {
  const profil = profilInfo || {};

  return `Kamu adalah analis energi listrik rumah tangga Indonesia yang KRITIS, OBJEKTIF, dan BERBASIS DATA.

Tugasmu bukan untuk menyenangkan user.

Jika penggunaan energi user boros, katakan bahwa penggunaan tersebut boros.

Jangan memberikan nilai tinggi hanya agar user merasa baik.

=========================
PROFIL USER
=========================

- Penghuni: ${profil.penghuni ?? "tidak diketahui"} orang
- Daya PLN: ${profil.dayaListrikRumah ?? "tidak diketahui"} VA
- Biaya listrik bulanan: ${profil.biayaListrikBulanan || "tidak diketahui"}

=========================
DAFTAR PERANGKAT
=========================

${devicesText}

=========================
STATISTIK USER
=========================

- Tantangan selesai: ${statistiklencana.tantanganSelesai}
- Streak hari berturut-turut: ${statistiklencana.streakHari}

=========================
TUGAS 1 — ANALISIS PERANGKAT
=========================

Nama perangkat pada output "deviceAnalysis" HARUS SAMA PERSIS dengan nama perangkat yang diberikan user.

JANGAN:
- mengubah nama perangkat
- menerjemahkan nama perangkat
- menyingkat nama perangkat
- menghapus kata tambahan
- mengganti dengan sinonim
- menambahkan kata baru

Salin nama perangkat dari daftar user secara persis.

Urutan "deviceAnalysis" HARUS mengikuti urutan perangkat user.

Setiap perangkat user HARUS muncul tepat satu kali.

Rumus konsumsi:

(watt × jumlah × jam/hari) / 1000 = kWh/hari

Jika perangkat bertanda "(estimasi perangkat)", WAJIB memperkirakan daya listrik yang wajar berdasarkan jenis perangkat.

Jika user memberikan daya secara langsung, gunakan angka tersebut dan JANGAN mengubahnya.

Nilai "power" HARUS berupa angka.

Nilai "kwhPerDay" HARUS berupa angka.

PENTING:

Jangan menentukan total konsumsi secara asal.

"totalKwhPerDay" akan dihitung oleh sistem berdasarkan deviceAnalysis.

Fokus kamu adalah memberikan daya yang masuk akal untuk perangkat yang membutuhkan estimasi dan melakukan analisis penggunaan.

=========================
TUGAS 2 — PERANGKAT PALING BOROS
=========================

Pilih maksimal 3 perangkat yang PALING BOROS dan MASIH BISA DIKURANGI penggunaannya.

Jangan otomatis memilih perangkat hanya karena menyala lama.

JANGAN memilih:
- Kulkas
- Lemari es
- Lemari pendingin
- Lampu
- Perangkat yang memang secara normal harus menyala terus

Fokus pada perangkat yang:
- konsumsi energinya tinggi
- durasi penggunaannya tinggi
- penggunaannya sebenarnya dapat dikurangi

=========================
TUGAS 3 — PERTANYAAN PENYEBAB
=========================

Buat SATU pertanyaan tindak lanjut yang berguna untuk menemukan kebiasaan pengguna yang menyebabkan pemborosan energi.

Perangkat dengan kWh terbesar TIDAK otomatis menjadi perangkat yang harus ditanyakan.

Prioritaskan perangkat yang memiliki kombinasi:
- konsumsi energi cukup besar
- durasi penggunaan tinggi
- penggunaan terlihat tidak wajar
- kemungkinan standby atau warm
- kebiasaan penggunaan yang dapat dikurangi

Buat 4 pilihan jawaban yang masuk akal dan berhubungan langsung dengan pertanyaan.

=========================
TUGAS 4 — lencana
=========================

Evaluasi lencana berdasarkan statistik user.

"Hemat Pemula"
Jika tantangan selesai >= 1

"Konsisten"
Jika streak hari berturut-turut >= 7

"Ahli Hemat"
Jika tantangan selesai >= 20

Masukkan lencana yang memenuhi syarat ke "earnedlencanas".

Jika tidak ada, gunakan [].

=========================
TUGAS 5 — SKOR EFISIENSI
=========================

Berikan skor 0 sampai 100.

90-100 = Sangat Efisien
75-89 = Efisien
60-74 = Cukup Efisien
40-59 = Boros
0-39 = Sangat Boros

Pertimbangkan:
- jumlah penghuni
- daya PLN
- konsumsi perangkat
- daya perangkat
- jumlah perangkat
- durasi penggunaan
- perangkat yang banyak mengonsumsi energi
- apakah penggunaan masih dapat dikurangi

Jangan memberikan skor tinggi hanya untuk menyenangkan user.

Jika terdapat pemborosan besar, skor HARUS turun secara signifikan.

=========================
ALASAN SKOR
=========================

Berikan alasan singkat dan kritis.

Alasan harus menjelaskan faktor terbesar yang menyebabkan skor naik atau turun.

=========================
FORMAT OUTPUT
=========================

Balas HANYA dengan satu objek JSON valid.

Jangan menggunakan markdown.

Jangan menggunakan \`\`\`json.

Jangan menambahkan teks sebelum atau sesudah JSON.

"deviceAnalysis" WAJIB berisi SEMUA perangkat.

Nilai "power" HARUS berupa angka.

Nilai "kwhPerDay" HARUS berupa angka.

Nilai "energyScore" HARUS berupa angka 0-100.

JANGAN mengarang field tambahan yang tidak diperlukan.

Format:

{
  "energyScore": 52,
  "scoreReason": "Skor rendah karena penggunaan beberapa perangkat dengan konsumsi energi tinggi masih dapat dikurangi.",
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
  "wastefulDevices": [
    "AC",
    "TV"
  ],
  "followUpQuestion": "Rice cooker digunakan selama 6 jam sehari. Apakah rice cooker biasanya tetap menyala dalam mode warm setelah nasi matang?",
  "followUpChoices": [
    "Ya, tetap menyala sampai nasi habis",
    "Tidak, langsung dimatikan setelah matang",
    "Kadang-kadang tetap menyala",
    "Lainnya"
  ],
  "earnedlencanas": []
}

${
  retry
    ? `
=========================
TUGAS ULANG
=========================

Jawaban sebelumnya bukan JSON valid.

Balas SEKARANG hanya dengan satu objek JSON valid sesuai format yang diminta.

Jangan menambahkan teks apa pun.
`
    : ""
}`;
};

export const POST = async (request) => {
  try {
    const { profilInfo, devicesData, statistiklencana } = await request.json();

    if (!Array.isArray(devicesData) || devicesData.length === 0) {
      return NextResponse.json(
        {
          error: "tidak ada data perangkat",
        },
        {
          status: 400,
        },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY tidak ditemukan",
        },
        {
          status: 500,
        },
      );
    }

    const sb = statistiklencana || {};

    const stats = {
      tantanganSelesai: Number(sb.tantanganSelesai) || 0,
      streakHari: Number(sb.streakHari) || 0,
    };

    const devicesText = devicesData
      .map((device, index) => {
        const nama = device.deviceName || "Perangkat tidak diketahui";

        const jumlah = Number(device.quantity) || 1;
        const durasi = Number(device.usageDuration) || 0;

        const daya = device.estimatedPower
          ? "(estimasi perangkat)"
          : `${Number(device.devicePower) || 0} W`;

        return `${index + 1}. ${nama} — jumlah: ${jumlah}, daya: ${daya}, durasi: ${durasi} jam/hari`;
      })
      .join("\n");

    let result = null;

    for (let retry = 0; retry < 2 && !result; retry++) {
      try {
        const text = await jawabGemini(
          buildPrompt(profilInfo, devicesText, stats, retry > 0),
          apiKey,
        );

        const parsed = ambilJson(text);

        if (!parsed) {
          continue;
        }

        let energyScore = Number(parsed.energyScore);

        if (!Number.isFinite(energyScore)) {
          energyScore = 0;
        }

        energyScore = Math.max(0, Math.min(100, Math.round(energyScore)));

        const energyCategory = getEnergyCategory(energyScore);

        /*
         * ============================================
         * NORMALISASI DEVICE
         * ============================================
         *
         * Data dari user menjadi sumber kebenaran.
         *
         * - Nama tetap dari devicesData
         * - Quantity tetap dari devicesData
         * - Durasi tetap dari devicesData
         * - Daya manual tetap dari devicesData
         * - Daya estimasi diambil dari hasil AI
         */

        const aiDevices = Array.isArray(parsed.deviceAnalysis)
          ? parsed.deviceAnalysis
          : [];

        const normalizedDevices = devicesData.map((device, index) => {
          const nama = device.deviceName || "Perangkat tidak diketahui";

          const quantity = Number(device.quantity) || 1;

          const usageDuration = Number(device.usageDuration) || 0;

          const aiDevice =
            aiDevices.find(
              (item) => String(item?.name || "").trim() === String(nama).trim(),
            ) || aiDevices[index];

          let power;

          if (device.estimatedPower) {
            power = Number(aiDevice?.power);

            if (!Number.isFinite(power) || power <= 0) {
              power = estimasiDaya(nama);
            }
          } else {
            power = Number(device.devicePower) || 0;
          }

          const kwh = (power * quantity * usageDuration) / 1000;

          return {
            name: nama,
            power,
            kwhPerDay: Math.round(kwh * 100) / 100,
          };
        });

        /*
         * ============================================
         * TOTAL KWH DIHITUNG OLEH JAVASCRIPT
         * ============================================
         */

        const totalKwh = normalizedDevices.reduce(
          (total, device) => total + Number(device.kwhPerDay || 0),
          0,
        );

        const totalKwhPerDay = Math.round(totalKwh * 100) / 100;

        /*
         * ============================================
         * VALIDASI WASTEFUL DEVICES
         * ============================================
         */

        const validNames = normalizedDevices.map((device) => device.name);

        const wastefulDevices = Array.isArray(parsed.wastefulDevices)
          ? parsed.wastefulDevices
              .filter((name) => validNames.includes(name))
              .slice(0, 3)
          : [];

        const finalWastefulDevices =
          wastefulDevices.length > 0
            ? wastefulDevices
            : normalizedDevices
                .slice()
                .sort((a, b) => b.kwhPerDay - a.kwhPerDay)
                .slice(0, 3)
                .map((device) => device.name);

        result = {
          totalKwhPerDay: String(totalKwhPerDay),

          energyScore,

          energyCategory,

          scoreReason:
            parsed.scoreReason ||
            "Skor dihitung berdasarkan pola penggunaan energi.",

          deviceAnalysis: normalizedDevices,

          wastefulDevices: finalWastefulDevices,

          followUpQuestion:
            parsed.followUpQuestion ||
            `Mengapa ${
              finalWastefulDevices[0] || "perangkat tersebut"
            } dipakai setiap hari?`,

          followUpChoices:
            Array.isArray(parsed.followUpChoices) &&
            parsed.followUpChoices.length > 0
              ? parsed.followUpChoices
              : [
                  "Untuk tidur",
                  "Untuk bekerja/belajar",
                  "Karena kebutuhan tertentu",
                  "Lainnya",
                ],

          summary: `Total konsumsi ${totalKwhPerDay} kWh/hari. Mulai hemat dari ${
            finalWastefulDevices[0] || "perangkat dengan konsumsi tertinggi"
          }.`,

          earnedlencanas: Array.isArray(parsed.earnedlencanas)
            ? parsed.earnedlencanas.filter(
                (lencana) => typeof lencana === "string",
              )
            : [],
        };

        console.log("DEVICE ANALYSIS:", normalizedDevices);

        console.log("TOTAL KWH HASIL PERHITUNGAN:", totalKwhPerDay);
      } catch (error) {
        console.error(`Percobaan Gemini ${retry + 1} gagal:`, error);
      }
    }

    result = result || hitungFallback(devicesData);

    if (!result) {
      return NextResponse.json(
        {
          error: "AI gagal dan data kurang untuk dihitung ulang.",
        },
        {
          status: 422,
        },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("ANALYSIS API ERROR:", error);

    return NextResponse.json(
      {
        error: "internal server error",
      },
      {
        status: 500,
      },
    );
  }
};
