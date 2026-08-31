Energize adalah aplikasi analisis konsumsi energi rumah tangga berbasis AI

Tahihan listrik menjadi beban pokok rumah tangga, tapi banyak pengguna yang tidak tahu perangkat mana yang paling boros dan seberapa besar itu membebani tagihan. Informasi daya perangkat sering tidak dipahami dalam satuan kWh/hari.

Jadi untuk membantu pengguna, aplikasi ini

- Menghitung estimasi konsumsi harian secara otomatis,
- Mengidentifikasi 3 perangkat paling boros yang masih bisa dikurangi.
- Memberikan challenge hemat energi agar sebagai langkah kecil untuk mengurangi beban tagihan listrik.

**Fitur utama**

- Analisis Perangkat, input daya/jumlah/durasi perangkat, hitung total kWh/hari dan estimasi biaya secara otomatis.

- Mencari perangkat 3 paling boros yang masih bisa dikurangi.
- Pertanyaan AI untuk personalisasi challenge.
- Challenge, sistem yang memberikan 3 tantangan untuk menghemat energi lalu pengguna menerima 1 dari 3 challenge yang diberikan.
- Badge, pencapaian yang bisa didapat pengguna, dievaluasi otomatis dengan ai tiap analisis baru.
- History, menyimpan setiap hasil analisis.

**Teknologi yang digunakan**

- Framework : Next.js 16.3.0 + React 19.2.8 / react-dom 19.2.8
- Build : Turbopack, reactcompiler
- UI : antd 6.5.4, react-icons 5.7.0, gsap 3.15.0
- UX : lenis 1.3.26 + SmoothScroll
- AI : Gemini 3.5 Flash via googleapis
- Tool : eslint 9

**Cara instalasi**

1. Clone repi
   git clone https://github.com/vixxic/Energize-itechnocup.git
   cd Energize-itechnocup

2. Install dependency
   npm install
   =======
3. git clone https://github.com/vixxic/Energize-itechnocup.git
   cd Energize-itechnocup
4. npm install
5. Buat file .env.local
6. Isi .env.local
   GEMINI_API_KEY=isiapikeydariaistudio

**Cara penggunaan**

1. npm run dev
2. Buka http://localhost:3000
