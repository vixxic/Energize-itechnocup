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

// ambil json dari ai nya

const ambilJson = (text) => {
  if (!text) return null;

  const payload = text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1] ?? text;

  const match = payload.match(/\{[\s\S]*\}/);

  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);

    if (
      !Array.isArray(parsed?.wastefulDevices) ||
      parsed.wastefulDevices.length === 0
    ) {
      return null;
    }

    if (!Array.isArray(parsed?.deviceAnalysis)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

// hitung skor efisiensi user

const getEnergyCategory = (score) => {
  if (score >= 90) return "Sangat Efisien";
  if (score >= 75) return "Efisien";
  if (score >= 60) return "Cukup Efisien";
  if (score >= 40) return "Boros";
  return "Sangat Boros";
};

// function fall back (kalo ai gagal)

const hitungFallback = (devicesData) => {
  const rows = (devicesData || [])
    .map((device) => {
      const power = Number(device.devicePower) || 0;
      const quantity = Number(device.quantity) || 1;
      const usageDuration = Number(device.usageDuration) || 0;

      const kWh = (power * quantity * usageDuration) / 1000;

      return {
        nama: device.deviceName || "Perangkat tidak diketahui",
        power,
        kWh,
      };
    })
    .filter((row) => row.kWh > 0);

  if (!rows.length) return null;

  const total = rows.reduce((sum, row) => sum + row.kWh, 0);

  /* =========================
     CARI PERANGKAT YANG BISA DIKURANGI
  ========================= */

  const candidates = rows
    .filter((row) => !/kulkas|lemari es|lemari pendingin|lampu/i.test(row.nama))
    .sort((a, b) => b.kWh - a.kWh);

  const top = (candidates.length >= 3 ? candidates : rows).slice(0, 3);

  // hitung skor fallback

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

  const followUpQuestion = top[0]
    ? `Mengapa ${top[0].nama} dipakai ${
        devicesData.find((d) => d.deviceName === top[0].nama)?.usageDuration ??
        "?"
      } jam sehari?`
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
      "Karena suhu panas",
      "Lainnya",
    ],

    summary: `Total konsumsi ${String(
      totalKwhPerDay,
    )} kWh/hari. Mulai hemat dari ${
      top[0]?.nama || "perangkat dengan konsumsi tertinggi"
    }.`,

    earnedBadges: [],
  };
};

// promt ke gemini

const buildPrompt = (profilInfo, devicesText, statistikBadge, retry) => {
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

- Tantangan selesai: ${statistikBadge.tantanganSelesai}
- Streak hari berturut-turut: ${statistikBadge.streakHari}

=========================
TUGAS 1 — HITUNG KONSUMSI
=========================

Hitung konsumsi setiap perangkat menggunakan rumus:

(watt × jumlah × jam/hari) / 1000 = kWh/hari

Jika perangkat bertanda "(estimasi perangkat)", kamu WAJIB memperkirakan daya listrik yang wajar berdasarkan jenis perangkat tersebut.

Contoh:
- Kipas angin dapat diperkirakan menggunakan daya puluhan Watt.
- TV dapat diperkirakan menggunakan daya puluhan sampai ratusan Watt.
- AC dapat menggunakan ratusan hingga lebih dari seribu Watt tergantung jenisnya.

Jangan asal memberikan angka.

Jika user memberikan daya perangkat secara langsung, gunakan angka tersebut dan JANGAN mengubahnya.

Masukkan hasil daya ke:

"power"

dan hasil konsumsi ke:

"kwhPerDay"

=========================
TUGAS 2 — PERANGKAT PALING BOROS
=========================

Pilih maksimal 3 perangkat yang PALING BOROS dan MASIH BISA DIKURANGI penggunaannya.

Jangan otomatis memilih perangkat hanya karena menyala lama.

JANGAN memilih:
- Kulkas
- Lemari es
- Lampu
- Perangkat yang memang secara normal harus menyala terus

Fokus pada perangkat yang:
- konsumsi energinya tinggi
- durasi penggunaannya tinggi
- atau penggunaannya sebenarnya dapat dikurangi

=========================
TUGAS 3 — PERTANYAAN PENYEBAB
=========================

Buat satu pertanyaan untuk menggali penyebab perangkat PALING BOROS digunakan dalam durasi tersebut.

Buat 4 pilihan jawaban yang masuk akal.

=========================
TUGAS 4 — BADGE
=========================

Evaluasi badge berdasarkan statistik user.

Aturan:

"Hemat Pemula"
Jika tantangan selesai >= 1

"Konsisten"
Jika streak hari berturut-turut >= 7

"Ahli Hemat"
Jika tantangan selesai >= 20

Masukkan badge yang memenuhi syarat ke:

"earnedBadges"

Jika tidak ada, gunakan:

[]

Jangan memberikan badge jika syaratnya belum terpenuhi.

=========================
TUGAS 5 — SKOR EFISIENSI ENERGI
=========================

Berikan user SKOR EFISIENSI ENERGI dari 0 sampai 100.

Skor ini bukan skor berdasarkan jumlah perangkat.

Skor harus menggambarkan seberapa efisien pola penggunaan energi user.

Gunakan data:
- jumlah penghuni
- daya PLN
- konsumsi perangkat
- daya perangkat
- jumlah perangkat
- durasi penggunaan
- perangkat yang paling banyak mengonsumsi energi
- apakah penggunaan perangkat masih bisa dikurangi

=========================
ATURAN SKOR
=========================

90-100 = Sangat Efisien

75-89 = Efisien

60-74 = Cukup Efisien

40-59 = Boros

0-39 = Sangat Boros

=========================
PRINSIP PENILAIAN
=========================

1. JANGAN memberikan skor tinggi hanya untuk menyenangkan user.

2. JANGAN memuji user jika data menunjukkan pemborosan.

3. JANGAN menaikkan skor hanya karena jumlah perangkat sedikit.

4. Perhatikan durasi penggunaan.

5. Perangkat dengan konsumsi energi tinggi harus memberikan dampak negatif terhadap skor jika penggunaannya dapat dikurangi.

6. Penggunaan perangkat secara berlebihan harus menurunkan skor.

7. Perangkat yang digunakan secara wajar tidak perlu diberi penalti besar.

8. Kulkas yang menyala 24 jam tidak boleh langsung dianggap boros karena memang normal untuk perangkat tersebut.

9. Lampu tidak boleh dianggap sangat boros hanya karena jumlahnya banyak jika daya dan durasinya rendah.

10. Jangan menilai hanya berdasarkan satu perangkat. Lihat keseluruhan pola penggunaan.

11. Jika terdapat pemborosan besar, skor HARUS turun secara signifikan.

12. Jika penggunaan energi memang sangat boros, jangan takut memberikan skor di bawah 50.

13. Jika data menunjukkan penggunaan sangat efisien, skor boleh tinggi.

14. Jangan memberikan skor 90+ tanpa alasan yang benar-benar kuat.

15. Jangan menggunakan perasaan, simpati, atau asumsi untuk menentukan skor.

=========================
PENTING
=========================

Skor harus konsisten dengan data.

Contoh:

Jika user memiliki AC dengan daya besar dan menggunakannya 10 jam sehari, hal tersebut harus memberikan dampak negatif yang jelas terhadap skor.

Jika user memiliki banyak perangkat tetapi semuanya digunakan dengan durasi rendah, jangan otomatis menganggap user boros.

Jika user memiliki sedikit perangkat tetapi perangkat tersebut memiliki daya tinggi dan digunakan sangat lama, user tetap dapat memperoleh skor rendah.

=========================
ALASAN SKOR
=========================

Berikan alasan singkat dan KRITIS.

Alasan harus menjelaskan faktor terbesar yang menyebabkan skor naik atau turun.

Jangan menggunakan kalimat kosong seperti:
"Penggunaan energi Anda cukup baik."

Harus spesifik.

Contoh:
"Skor rendah karena AC digunakan 10 jam sehari dan menjadi penyumbang konsumsi energi terbesar."

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

=========================
FORMAT JSON
=========================

{
  "totalKwhPerDay": "12.5",
  "energyScore": 52,
  "energyCategory": "Boros",
  "scoreReason": "Skor rendah karena AC digunakan dalam durasi panjang dan menjadi penyumbang konsumsi energi terbesar.",
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
  "followUpQuestion": "Mengapa AC dipakai 8 jam sehari?",
  "followUpChoices": [
    "Untuk tidur",
    "Untuk bekerja/belajar",
    "Karena suhu panas",
    "Lainnya"
  ],
  "earnedBadges": []
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

// post api

export const POST = async (request) => {
  try {
    const { profilInfo, devicesData, statistikBadge } = await request.json();

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

    // supaya ai bisa tau riwayat

    const sb = statistikBadge || {};

    const stats = {
      tantanganSelesai: Number(sb.tantanganSelesai) || 0,

      streakHari: Number(sb.streakHari) || 0,
    };

    // format perangkat
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

    // panggil gemini

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

        result = {
          totalKwhPerDay: parsed.totalKwhPerDay ?? "",

          energyScore,

          energyCategory,

          scoreReason: parsed.scoreReason || "Tidak ada alasan skor.",

          deviceAnalysis: Array.isArray(parsed.deviceAnalysis)
            ? parsed.deviceAnalysis
            : [],

          wastefulDevices: parsed.wastefulDevices,

          followUpQuestion:
            parsed.followUpQuestion ||
            `Mengapa ${parsed.wastefulDevices?.[0] || "perangkat tersebut"} dipakai setiap hari?`,

          followUpChoices: Array.isArray(parsed.followUpChoices)
            ? parsed.followUpChoices
            : [
                "Untuk tidur",
                "Untuk bekerja/belajar",
                "Karena suhu panas",
                "Lainnya",
              ],

          summary: `Total konsumsi ${
            parsed.totalKwhPerDay ?? "?"
          } kWh/hari. Mulai hemat dari ${
            parsed.wastefulDevices?.[0] || "perangkat dengan konsumsi tertinggi"
          }.`,

          earnedBadges: Array.isArray(parsed.earnedBadges)
            ? parsed.earnedBadges.filter((badge) => typeof badge === "string")
            : [],
        };
      } catch (error) {
        console.error(`Percobaan Gemini ${retry + 1} gagal:`, error);
      }
    }

    /* =========================
       FALLBACK
    ========================= */

    result = result || hitungFallback(devicesData);

    /* =========================
       JIKA SEMUA GAGAL
    ========================= */

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
