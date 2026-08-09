import "./Footer.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="Energize Logo" width={42} height={42} />
            <h2>Energize</h2>
          </div>

          <p>
            Pahami penggunaan energi Anda, temukan peluang penghematan, dan
            bersama-sama membangun masa depan yang lebih berkelanjutan.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navigasi</h3>
          <a href="#home-section">Beranda</a>
          <a href="#problem-section">Tantangan</a>
          <a href="#fitur-section">Fitur</a>
          <a href="#how-it-works-section">Cara Kerja</a>
          <a href="#impact-section">Dampak</a>
        </div>

        <div className="footer-column">
          <h3>Aplikasi</h3>
          <Link href="/dashboard">Mulai Analisis</Link>
          <a href="#">Dashboard</a>
          <a href="#">Riwayat</a>
          <a href="#">Penggunaan</a>
        </div>

        <div className="footer-column">
          <h3>Tentang</h3>
          <a href="#">Tentang Kami</a>
          <a href="#">SDGs</a>
          <a href="#">Kontak</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Energize. Dibuat untuk masa depan yang lebih hemat dan
          berkelanjutan.
        </p>
      </div>
    </footer>
  );
}
