import "./Fitur.css";

function Fitur() {
  return (
    <div className="fitur-section padding">
      <div className="fitur-text-con">
        <p>Kenali Pola Penggunaan Energi Anda</p>
        <p className="sub-title">
          Pahami bagaimana rumah Anda menggunakan energi. Kami mengubah data
          menjadi insight yang membantu Anda mengambil langkah nyata.
        </p>
      </div>

      <div className="fitur-card">
        <div className="main-fitur"></div>
        <div className="sub-fitur-con">
          <div className="sub-fitur card"></div>
          <div className="sub-fitur card"></div>
          <div className="sub-fitur card"></div>
          <div className="sub-fitur card"></div>
        </div>
      </div>

      <p className="badge-text">
        Selesaikan Tantangan dan Dapatkan Penghargaan Anda!!
      </p>

      <div className="badge-con">
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
