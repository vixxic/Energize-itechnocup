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

          <Link href="/dashboard?section=analisis">Mulai Analisis</Link>

          <Link href="/dashboard?section=dashboard">Dashboard</Link>

          <Link href="/dashboard?section=tantangan">Tantangan</Link>

          <Link href="/dashboard?section=riwayat">Riwayat</Link>

          <Link href="/dashboard?section=profil">Profil</Link>
        </div>

        <div className="footer-column">
          <h3>Tentang</h3>

          <Link href="/Tentang">SDGs</Link>
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
