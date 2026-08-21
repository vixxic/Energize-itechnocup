import { NextResponse } from "next/server";

import challengeData from "../../dashboard/data/challengeData";

export async function POST(request) {
  try {
    const { analysis, answer } = await request.json();

    if (!analysis || !answer) {
      return NextResponse.json(
        { error: "data tidak lengkap" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "no api key" }, { status: 500 });
    }

    const prompt = `
Kamu adalah coach hemat energi rumah tangga di Indonesia.

Tugasmu adalah menganalisis kebiasaan penggunaan listrik pengguna dan membuat
tantangan hemat energi yang PRAKTIS, REALISTIS, SPESIFIK, dan BENAR-BENAR
BERGUNA untuk dilakukan di rumah.

HASIL ANALISIS PENGGUNAAN ENERGI:
- Total konsumsi listrik: ${analysis.totalKwhPerDay ?? "-"} kWh/hari
- Perangkat paling boros: ${(analysis.wastefulDevices || []).join(", ") || "-"}
- Pertanyaan penyebab penggunaan berlebih:
${analysis.followUpQuestion || "-"}
- Jawaban pengguna:
${answer}

TUGAS UTAMA:

1. Buat tepat 3 tantangan hemat energi.
2. Urutkan dari dampak penghematan energi terbesar ke terkecil.
3. Setiap tantangan harus berhubungan dengan:
   - perangkat yang paling boros, ATAU
   - kebiasaan pengguna yang menyebabkan penggunaan listrik berlebihan.
4. Jangan membuat tantangan yang terlalu umum seperti:
   "Hemat listrik", "Gunakan listrik dengan bijak", atau "Matikan perangkat".
5. Tantangan harus konkret dan dapat dilakukan pengguna.

UNTUK SETIAP TANTANGAN:

Berikan:

- "urutan"
  Nomor urutan tantangan 1 sampai 3.

- "tantangan"
  Judul singkat, jelas, dan berupa tindakan.

- "des"
  Penjelasan singkat mengenai apa yang harus dilakukan pengguna.

- "recommendations"
  Berikan 3 rekomendasi penyelesaian yang benar-benar membantu pengguna
  menyelesaikan tantangan.

REKOMENDASI HARUS:

- Spesifik terhadap perangkat dan kebiasaan pengguna.
- Berupa langkah yang bisa langsung dilakukan.
- Realistis untuk rumah tangga di Indonesia.
- Tidak terlalu umum atau berulang.
- Membantu pengguna mengetahui CARA menyelesaikan tantangan.
- Jika memungkinkan, berikan cara seperti:
  pengaturan waktu penggunaan,
  penggunaan timer,
  perubahan kebiasaan,
  pengaturan perangkat,
  pengurangan penggunaan yang tidak diperlukan,
  atau cara menggunakan perangkat dengan lebih efisien.

CONTOH REKOMENDASI YANG BAGUS:

Jika masalahnya AC:
- "Gunakan timer agar AC berhenti otomatis setelah pengguna tidur."
- "Pastikan pintu dan jendela tertutup saat AC menyala agar pendinginan lebih efisien."
- "Bersihkan filter AC secara rutin agar kinerja pendinginan tidak bekerja terlalu berat."

Jika masalahnya televisi atau perangkat standby:
- "Gunakan terminal listrik yang memiliki sakelar untuk mematikan beberapa perangkat sekaligus."
- "Cabut charger dan perangkat yang tidak digunakan dalam waktu lama."

Jika masalahnya lampu:
- "Manfaatkan cahaya alami pada siang hari sebelum menyalakan lampu."
- "Matikan lampu di ruangan yang tidak sedang digunakan."

JANGAN memberikan rekomendasi yang:
- terlalu umum,
- tidak berhubungan dengan tantangan,
- sulit dilakukan tanpa alasan,
- membutuhkan pembelian mahal kecuali benar-benar diperlukan.

Balas HANYA dalam format JSON valid.
Jangan gunakan markdown.
Jangan gunakan \`\`\`json.
Jangan tambahkan penjelasan sebelum atau sesudah JSON.

Format WAJIB:

{
  "challenges": [
    {
      "urutan": 1,
      "tantangan": "judul tantangan singkat",
      "des": "penjelasan konkret mengenai tantangan",
      "recommendations": [
        "rekomendasi praktis pertama",
        "rekomendasi praktis kedua",
        "rekomendasi praktis ketiga"
      ]
    },
    {
      "urutan": 2,
      "tantangan": "judul tantangan singkat",
      "des": "penjelasan konkret mengenai tantangan",
      "recommendations": [
        "rekomendasi praktis pertama",
        "rekomendasi praktis kedua",
        "rekomendasi praktis ketiga"
      ]
    },
    {
      "urutan": 3,
      "tantangan": "judul tantangan singkat",
      "des": "penjelasan konkret mengenai tantangan",
      "recommendations": [
        "rekomendasi praktis pertama",
        "rekomendasi praktis kedua",
        "rekomendasi praktis ketiga"
      ]
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message ?? "the api error",
        },
        {
          status: response.status,
        },
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);

    const parsed = jsonMatch ? JSON.parse(jsonMatch[1] ?? jsonMatch[0]) : {};

    const isChallengesValid =
      Array.isArray(parsed?.challenges) &&
      parsed.challenges.length === 3 &&
      parsed.challenges.every(
        (c) =>
          c &&
          typeof c.tantangan === "string" &&
          typeof c.des === "string" &&
          Array.isArray(c.recommendations) &&
          c.recommendations.length >= 3,
      );

    return NextResponse.json(
      isChallengesValid ? parsed : { challenges: challengeData },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
