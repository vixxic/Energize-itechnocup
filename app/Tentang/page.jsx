import "./Tentang.css";

import Link from "next/link";

import Footer from "../components/Footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

function Page() {
  return (
    <>
      <div className="tentang-page ">
        <div className="back-btn-con">
          <Link href="/">
            <button>
              <IoMdArrowRoundBack />
            </button>
          </Link>
          <p>Kembali</p>
        </div>

        <div className="sdg-content">
          <div className="sdg-heading">
            <span>SDG</span>
            <h2>Kontribusi Energize</h2>
          </div>

          <div className="sdg-card">
            <div className="sdg-card-number">01</div>

            <div className="sdg-card-content">
              <h3>Teknologi untuk Keberlanjutan</h3>

              <p>
                Energize mengintegrasikan teknologi digital sebagai solusi untuk
                membangun kebiasaan penggunaan energi yang lebih bijak dan
                berkelanjutan. Melalui analisis konsumsi listrik berbasis AI,
                rekomendasi penghematan, serta fitur tantangan dan pencapaian,
                Energize mendukung <strong>SDG 7</strong> dengan mendorong
                efisiensi energi.
              </p>

              <p>
                Pemanfaatan teknologi digital dan inovasi sistem mendukung{" "}
                <strong>SDG 9</strong>, sementara pengelolaan biaya energi yang
                lebih efektif turut berkontribusi pada <strong>SDG 8</strong>.
                Dengan meningkatkan kesadaran masyarakat terhadap penggunaan
                energi dan mendorong pola hidup yang lebih efisien, Energize
                juga berkontribusi pada terwujudnya komunitas yang lebih
                berkelanjutan sesuai <strong>SDG 11</strong>.
              </p>
            </div>
          </div>

          <div className="sdg-list">
            <div className="sdg-item">
              <span>SDG 7</span>
              <h3>Energi Bersih dan Terjangkau</h3>
              <p>Mendorong efisiensi dan penggunaan energi yang lebih bijak.</p>
            </div>

            <div className="sdg-item">
              <span>SDG 8</span>
              <h3>Pekerjaan Layak & Pertumbuhan Ekonomi</h3>
              <p>Membantu pengelolaan biaya energi secara lebih efektif.</p>
            </div>

            <div className="sdg-item">
              <span>SDG 9</span>
              <h3>Industri, Inovasi & Infrastruktur</h3>
              <p>
                Menggunakan AI dan teknologi digital sebagai solusi inovatif.
              </p>
            </div>

            <div className="sdg-item">
              <span>SDG 11</span>
              <h3>Kota & Komunitas Berkelanjutan</h3>
              <p>
                Membangun masyarakat yang lebih sadar dan efisien dalam
                menggunakan energi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Page;
