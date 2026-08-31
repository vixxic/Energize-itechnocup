import "./Fitur.css";

const fiturFitur = [
  {
    img: "/img-fitur/fitur-form-analisis.svg",
    nama: "Analisis AI",
    des: "Analisis data penggunaan listrik rumah untuk menemukan pola konsumsi dan perangkat yang paling banyak menggunakan energi.",
  },
  {
    img: "/img-fitur/fitur-tantangan-dan-badges.svg",
    nama: "Badge & Pencapaian",
    des: "Dapatkan badge sebagai penghargaan setelah berhasil menyelesaikan tantangan hemat energi.",
  },
  {
    img: "/img-fitur/fitur-rekomendasi-ai.svg",
    nama: "Rekomendasi AI",
    des: "Dapatkan langkah penghematan yang personal dan mudah diterapkan selama menjalankan tantangan.",
  },
  {
    img: "/img-fitur/fitur-pantau-perubahan.svg",
    nama: "Dashboard & Profil",
    des: "Pantau perkembangan konsumsi listrik, hasil penghematan, dan pencapaianmu dalam satu dashboard.",
  },
];

function Fitur() {
  return (
    <div id="fitur-section" className="padding">
      <div className="fitur-text-con">
        <p>Kenali Pola Penggunaan Energi Anda</p>
        <p className="sub-title">
          Pahami bagaimana rumah Anda menggunakan energi. Kami mengubah data
          menjadi insight yang membantu Anda mengambil langkah nyata.
        </p>
      </div>

      <div className="fitur-card">
        {fiturFitur.map((fitur, index) => (
          <div key={index} className="our-fitur ">
            <div className="fitur-img-con">
              <img src={fitur.img} />
            </div>

            <div className="fitur-des">
              <h3>{fitur.nama}</h3>
              <p>{fitur.des}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="lencana-text">
        Selesaikan Tantangan dan Dapatkan Penghargaan Anda!!
      </p>

      <div className="lencana-con">
        <img src="/badge-img/badge-efisien.png" />
        <img src="/badge-img/badge-tantangan-pertama.png" />
        <img src="/badge-img/badge-tantangan-kedua.png" />
        <img src="/badge-img/badge-tantangan-ketiga.png" />
        <img src="/badge-img/badge-penurunan-drastis.png" />
      </div>
    </div>
  );
}

export default Fitur;
