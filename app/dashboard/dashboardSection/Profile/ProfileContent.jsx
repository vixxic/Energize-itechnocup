"use client";

import "./ProfileContent.css";

import {
  FaTrophy,
  FaBolt,
  FaFire,
  FaLeaf,
  FaChartLine,
  FaMedal,
  FaStar,
  FaLock,
} from "react-icons/fa";

import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";

function ProfileContent() {
  const {
    analysisHistory = [],
    completedChallenges = [],
    analysis,
  } = useContext(DashboardContext);

  // =========================
  // STATISTIK
  // =========================

  const totalAnalisis = analysisHistory.length;

  const totalTantangan = completedChallenges.length;

  // Hitung CO2 berdasarkan riwayat analisis
  const totalCO2 = (() => {
    if (analysisHistory.length < 2) return 0;

    let hemat = 0;

    for (let i = 1; i < analysisHistory.length; i++) {
      const sebelumnya = Number(analysisHistory[i - 1]?.totalKwhPerDay) || 0;

      const sekarang = Number(analysisHistory[i]?.totalKwhPerDay) || 0;

      const selisih = sebelumnya - sekarang;

      if (selisih > 0) {
        hemat += selisih;
      }
    }

    return Math.round(hemat * 0.85 * 10) / 10;
  })();

  const energyScore = Number(analysis?.energyScore) || 0;

  // =========================
  // BADGE
  // =========================

  const badges = [
    {
      id: 1,
      title: "First Analysis",
      description: "Melakukan analisis energi pertama.",
      icon: <FaBolt />,
      unlocked: totalAnalisis >= 1,
    },
    {
      id: 2,
      title: "Energy Saver",
      description: "Menyelesaikan 3 tantangan hemat energi.",
      icon: <FaTrophy />,
      unlocked: totalTantangan >= 3,
    },
    {
      id: 3,
      title: "Eco Hero",
      description: "Berhasil menghemat energi dari hasil analisis.",
      icon: <FaLeaf />,
      unlocked: totalCO2 > 0,
    },
    {
      id: 5,
      title: "Energy Explorer",
      description: "Melakukan 5 kali analisis energi.",
      icon: <FaChartLine />,
      unlocked: totalAnalisis >= 5,
    },
    {
      id: 6,
      title: "Efficiency Master",
      description: "Mencapai skor efisiensi minimal 80.",
      icon: <FaStar />,
      unlocked: energyScore >= 80,
    },
  ];

  const jumlahBadge = badges.filter((badge) => badge.unlocked).length;

  return (
    <main className="profile-page">
      {/* ================= HEADER ================= */}

      <section className="profile-header">
        <div className="profile-header-icon">
          <FaLeaf />
        </div>

        <div>
          <h1>Profil Energi</h1>
          <p>Lihat perjalanan dan pencapaianmu dalam menghemat energi.</p>
        </div>
      </section>

      {/* ================= PROFILE CARD ================= */}

      <section className="profile-card">
        <div className="profile-avatar">
          <FaBolt />
        </div>

        <div className="profile-info">
          <h2>Pengguna Energize</h2>
          <p>Eco Energy Saver</p>
          <span>Terus jaga kebiasaan hemat energimu!</span>
        </div>

        <div className="profile-badge-count">
          <FaMedal />
          <strong>{jumlahBadge}</strong>
          <span>Badge diperoleh</span>
        </div>
      </section>

      {/* ================= STATISTIK ================= */}

      <section className="profile-section">
        <div className="section-heading">
          <div>
            <h2>Statistik Akun</h2>
            <p>Perkembangan aktivitasmu di Energize.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBolt />
            </div>

            <div>
              <span>Analisis Dilakukan</span>
              <strong>{totalAnalisis}</strong>
              <small>kali analisis</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaTrophy />
            </div>

            <div>
              <span>Tantangan Selesai</span>
              <strong>{totalTantangan}</strong>
              <small>tantangan</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaFire />
            </div>

            <div>
              <span>Listrik Terhemat</span>
              <strong></strong>
              <small>kwh</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaLeaf />
            </div>

            <div>
              <span>CO₂ Terhemat</span>
              <strong>{totalCO2}</strong>
              <small>kg CO₂</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCORE ================= */}

      <section className="efficiency-card">
        <div className="efficiency-icon">
          <FaStar />
        </div>

        <div className="efficiency-content">
          <span>Skor Efisiensi Terakhir</span>

          <div className="score-row">
            <strong>{energyScore}</strong>
            <span>/100</span>
          </div>

          <p>
            {energyScore >= 80
              ? "Performa energimu sangat baik!"
              : energyScore >= 60
                ? "Kamu sudah berada di jalur yang baik."
                : energyScore > 0
                  ? "Masih ada peluang untuk meningkatkan efisiensi."
                  : "Lakukan analisis untuk mendapatkan skor efisiensi."}
          </p>
        </div>
      </section>

      {/* ================= BADGE ================= */}

      <section className="profile-section badge-section">
        <div className="section-heading">
          <div>
            <h2>Pencapaian</h2>
            <p>Kumpulkan badge dengan membangun kebiasaan hemat energi.</p>
          </div>

          <span className="badge-progress">
            {jumlahBadge}/{badges.length}
          </span>
        </div>

        <div className="badge-grid">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-card ${badge.unlocked ? "unlocked" : "locked"}`}
            >
              <div className="badge-icon">
                {badge.unlocked ? badge.icon : <FaLock />}
              </div>

              <div className="badge-content">
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>

                <span>{badge.unlocked ? "✓ Terbuka" : "🔒 Belum terbuka"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProfileContent;
