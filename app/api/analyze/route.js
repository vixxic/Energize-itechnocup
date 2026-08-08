import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { profilInfo, devicesData } = await request.json();

    if (!devicesData || !Array.isArray(devicesData) || devicesData.length === 0) {
      return NextResponse.json(
        { error: "tidak ada data" },
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

    const perangkat = devicesData.map((d, i) => {
      const watts = d.estimatedPower ? "(estimasi perangkat)" : `${d.devicePower} W`;
      return `${i + 1}. ${d.deviceName} — jumlah: ${d.quantity}, daya: ${watts}, durasi: ${d.usageDuration} jam/hari`;
    }).join("\n");

    const prompt = `
Kamu analis energi listrik rumah tangga Indonesia.

PROFIL:
- Penghuni: ${profilInfo.penghuni} orang
- Daya pln: ${profilInfo.dayaListrikRumah} VA
- Biaya bulanan: ${profilInfo.biayaListrikBulanan || "tidak tahu"}

DAFTAR PERANGKAT:
${perangkat}
  
TUGAS:
1. Hitung konsumsi tiap perangkat: (watt × jumlah × jam/hari) / 1000 = kWh/hari.
   Untuk device bertanda "estimasi", perkirakan daya wajar perangkat tsb.
2. Pilih 3 perangkat PALING BOROS yang BISA DIIKURANGI pemakaiannya.
   JANGAN pilih kulkas/lemari es, lampu, atau benda yang memang wajib nyala 24 jam.
3. Buat 1 pertanyaan untuk menggali PENYEBAB pemborosan device paling boros,
   lengkap dengan pilihan jawaban (AI yang nentuin opsinya).

Balas HANYA JSON (tanpa teks lain), format:
{
  "totalKwhPerDay": "12.5",
  "wastefulDevices": ["nama boros 1", "nama boros 2", "nama boros 3"],
  "followUpQuestion": "Mengapa AC dipakai 8 jam sehari?",
  "followUpChoices": ["Untuk tidur", "Untuk bekerja/belajar", "Karena suhu panas", "Lainnya"]
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
    const parsed = jsonMatch ? JSON.parse(jsonMatch[1] ?? jsonMatch[0]) : { summary: text };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
