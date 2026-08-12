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
      return NextResponse.json(
        { error: "no api key" },
        { status: 500 },
      );
    }

    const prompt = `
Kamu coach hemat energi untuk rumah tangga di Indonesia.

HASIL ANALISIS PENGGUNAAN ENERGI:
- Total konsumsi: ${analysis.totalKwhPerDay ?? "-"} kWh/hari
- Perangkat paling boros: ${(analysis.wastefulDevices || []).join(", ") || "-"}
- Pertanyaan penyebab boros: ${analysis.followUpQuestion || "-"}
- Jawaban pengguna: ${answer}

TUGAS:
Buat 3 tantangan/langkah konkret yang bisa dilakukan pengguna untuk menghemat energi,
diurutkan dari yang paling berdampak. Sesuaikan dengan perangkat boros dan alasan
yang diberikan pengguna. Tulis dalam bahasa Indonesia, singkat dan spesifik.

Balas HANYA JSON (tanpa teks lain), format:
{
  "challenges": [
    { "urutan": 1, "tantangan": "judul pendek", "des": "penjelasan singkat" },
    { "urutan": 2, "tantangan": "judul pendek", "des": "penjelasan singkat" },
    { "urutan": 3, "tantangan": "judul pendek", "des": "penjelasan singkat" }
  ]
}`
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        { error: data?.error?.message ?? "the api error" },
        { status: response.status },
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[1] ?? jsonMatch[0]) : {};

    const isChallengesValid =
      Array.isArray(parsed?.challenges) &&
      parsed.challenges.every(
        (c) => c && typeof (c.tantangan || c.title) === "string",
      );

    return NextResponse.json(
      isChallengesValid ? parsed : { challenges: challengeData },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}