Energize adalah aplikasi berbasis web yang membantu pengguna memahami, menganalisis, dan menghemat konsumsi energi listrik rumah tangga dengan memanfaatkan Artificial Intelligence (AI).

Tagihan listrik dapat menjadi salah satu beban pengeluaran rumah tangga. Penggunaan listrik yang tidak terkontrol dapat menyebabkan pemborosan energi dan meningkatkan biaya listrik. Namun, banyak pengguna hanya mengetahui jumlah tagihan yang harus dibayar tanpa mengetahui perangkat apa yang paling banyak mengonsumsi energi atau kebiasaan apa yang menyebabkan pemborosan.

Oleh karena itu, kami mengembangkan Energize sebagai solusi untuk membantu pengguna memahami pola konsumsi listrik di rumah. Pengguna dapat memasukkan data perangkat elektronik yang digunakan, seperti daya, jumlah perangkat, dan durasi penggunaan. Data tersebut kemudian dianalisis untuk mengidentifikasi perangkat dengan konsumsi energi tertinggi.

Tidak hanya memberikan informasi, Energize juga memberikan rekomendasi penghematan, pertanyaan AI untuk personalisasi, Energy Challenge, dan Badge. Dengan pendekatan ini, pengguna tidak hanya mengetahui sumber pemborosan energi, tetapi juga mendapatkan langkah sederhana yang dapat dilakukan untuk mengurangi konsumsi listrik secara bertahap.

**Fitur utama**

Berikut beberapa fitur yang menjadi pembeda Energize dari platform penghitung konsumsi listrik rumah tangga lainnya:
- Perhitungan otomatis, menghitung estimasi konsumsi energi harian dan biaya listrik berdasarkan perangkat yang digunakan.
- Identifikasi 3 perangkat paling boros, menemukan tiga perangkat dengan konsumsi energi tertinggi yang masih berpotensi untuk dikurangi penggunaannya.
- AI Personalization, AI memberikan pertanyaan lanjutan untuk memahami kondisi dan kebiasaan pengguna.
- Energy Challenge, memberikan tantangan sederhana yang dapat dilakukan pengguna sebagai langkah nyata untuk mengurangi konsumsi energi dan membantu menekan         biaya listrik.
- Gamifikasi, pengguna dapat memperoleh Badge sebagai bentuk pencapaian dalam membangun kebiasaan hemat energi.

**Teknologi yang digunakan**

Energize dikembangkan menggunakan teknologi, framework, dan library berikut:

- Framework: Next.js 16.3.0
- Library Utama: React 19.2.8, react-dom 19.2.8
- Build Tool: Turbopack 
- Compiler: React Compiler
- UI Library: antd 6.5.4, react-icons 5.7.0, gsap 3.15.0
- User Experience (UX): lenis 1.3.26 untuk smooth scrolling
- Artificial Intelligence: Gemini 3.5 Flash via googleapis
- Code quality: ESLint 9

Penggunaan Teknologi
- Next.js dan React digunakan untuk membangun struktur dan antarmuka aplikasi.
- Ant Design digunakan untuk menyediakan berbagai komponen antarmuka pengguna.
- React Icons digunakan untuk menambahkan ikon pada aplikasi.
- GSAP digunakan untuk membuat animasi pada halaman.
- Lenis digunakan untuk menciptakan pengalaman smooth scrolling.
- Gemini AI digunakan untuk personalisasi pertanyaan, rekomendasi, dan pembuatan challenge. Sistem Energize juga memiliki logika internal untuk mengevaluasi pencapaian        pengguna dan memberikan Badge berdasarkan aktivitas serta hasil penghematan.
- ESLint digunakan untuk membantu menjaga kualitas dan konsistensi kode.

**Cara instalasi**

1. Clone repo
   git clone https://github.com/vixxic/Energize-itechnocup.git
   cd Energize-itechnocup
   
3. Install dependency
   npm install

4. Buat File Environment Variable
   buat file .env.local dan tambahkan API key Gemini
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   
   Catatan: API Key Gemini tidak dicantumkan dalam repository untuk menjaga keamanan credential. Untuk menjalankan fitur AI secara lokal, pengguna perlu memasukkan API Key     Gemini milik sendiri ke dalam file .env.local. Alternatifnya, aplikasi dapat langsung digunakan melalui versi yang telah di-deploy.

5. Setelah proses instalasi selesai, jalankan aplikasi menggunakan perintah:
   npm run dev
   
6. Kemudian buka aplikasi melalui browser:
   http://localhost:3000

**Cara Penggunaan**

1. Buka halaman utama Energize.
2. Masuk ke halaman Analisis dengan menekan tombol “Analisis” pada navbar atau tombol “Analisis Sekarang” pada section hero.
3. Masukkan informasi rumah, seperti jumlah penghuni dan daya listrik rumah.
4. Tambahkan perangkat elektronik yang digunakan dengan mengisi jumlah perangkat, daya listrik, dan durasi penggunaan. Untuk mempermudah pengguna, tersedia tombol “Isi Otomatis” untuk melakukan analisis dengan data contoh secara lebih cepat.
5. Jalankan analisis untuk mendapatkan estimasi konsumsi energi listrik berdasarkan data yang telah dimasukkan.
6. Lihat hasil analisis yang menampilkan estimasi konsumsi energi serta 3 perangkat dengan konsumsi energi tertinggi yang masih berpotensi untuk dikurangi penggunaannya.
7. Jawab pertanyaan lanjutan dari AI untuk membantu sistem memahami kondisi dan kebiasaan pengguna sehingga rekomendasi penghematan dapat disesuaikan dengan kondisi pengguna.
8. Pilih salah satu Energy Challenge yang ingin dilakukan. Setelah challenge selesai, sistem akan menyediakan tantangan berikutnya secara otomatis.
9. Lakukan tantangan yang telah dipilih, kemudian lakukan analisis ulang untuk mengetahui perubahan konsumsi energi setelah menerapkan tindakan penghematan.
10. Masukkan hasil konsumsi listrik terbaru pada halaman Tantangan sebagai data setelah menjalankan challenge. Data tersebut digunakan untuk mengevaluasi hasil penghematan dan menyelesaikan challenge.
11. Dapatkan Badge sebagai bentuk pencapaian setelah menyelesaikan tantangan dan memenuhi kriteria tertentu dalam sistem Energize.
12. Periksa halaman Profil untuk melihat perkembangan pencapaian, jumlah challenge yang telah diselesaikan, serta Badge yang telah diperoleh.

