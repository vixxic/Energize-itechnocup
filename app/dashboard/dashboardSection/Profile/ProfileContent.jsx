"use client";

import "./ProfileContent.css";

import { useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

import badgeData from "../../data/badgeData";

import {
  FaTrophy,
  FaBolt,
  FaLeaf,
  FaChartLine,
  FaMedal,
  FaStar,
  FaLock,
} from "react-icons/fa";

const iconMap = {
  FaTrophy: <FaTrophy />,
  FaStar: <FaStar />,
  FaLeaf: <FaLeaf />,
  FaLock: <FaLock />,
  FaBolt: <FaBolt />,
  FaChartLine: <FaChartLine />,
};

function ProfileContent() {
  const {
    badges = [],
    analysisHistory = [],
    completedChallenges = [],
    analysis,
  } = useContext(DashboardContext);

  // =========================
  // STATISTIK AKUN
  // =========================

  const totalAnalisis = analysisHistory.length;

  const tantanganSelesai = completedChallenges.length;

  // =========================
  // ENERGI TERHEMAT
  // =========================
  // Membandingkan konsumsi dari analisis sebelumnya
  // dengan analisis berikutnya.

  const energiHemat = (() => {
    const totals = analysisHistory.map((h) => Number(h.totalKwhPerDay) || 0);

    let simpan = 0;

    for (let i = 1; i < totals.length; i++) {
      const sebelumnya = totals[i - 1];
      const sekarang = totals[i];

      const selisih = sebelumnya - sekarang;

      if (selisih > 0) {
        simpan += selisih;
      }
    }

    return Math.round(simpan * 100) / 100;
  })();

  // =========================
  // CO2 TERHEMAT
  // =========================

  const totalCO2 = Math.round(energiHemat * 0.85 * 100) / 100;

  // =========================
  // BIAYA TERHEMAT
  // =========================

  const penghematanBiaya = Math.round(energiHemat * 30 * 1444.7);

  // =========================
  // SCORE
  // =========================

  const energyScore = Number(analysis?.energyScore) || 0;

  // =========================
  // BADGE
  // =========================

  const jumlahBadge = badges.length;

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
          {/* ANALISIS */}

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

          {/* TANTANGAN */}

          <div className="stat-card">
            <div className="stat-icon">
              <FaTrophy />
            </div>

            <div>
              <span>Tantangan Selesai</span>

              <strong>{tantanganSelesai}</strong>

              <small>tantangan</small>
            </div>
          </div>

          {/* LISTRIK */}

          <div className="stat-card">
            <div className="stat-icon">
              <FaBolt />
            </div>

            <div>
              <span>Energi Terhemat</span>

              <strong>{energiHemat}</strong>

              <small>kWh</small>
            </div>
          </div>

          {/* CO2 */}

          <div className="stat-card">
            <div className="stat-icon">
              <FaLeaf />
            </div>

            <div>
              <span>CO₂ Dihindari</span>

              <strong>{totalCO2}</strong>

              <small>kg CO₂</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PENGHEMATAN ================= */}

      <section className="efficiency-card">
        <div className="efficiency-icon">
          <FaChartLine />
        </div>

        <div className="efficiency-content">
          <span>Estimasi Dampak Penghematan</span>

          <div className="saving-row">
            <div>
              <strong>{energiHemat}</strong>

              <span>kWh</span>

              <small>Energi dihemat</small>
            </div>

            <div>
              <strong>{penghematanBiaya.toLocaleString("id-ID")}</strong>

              <span>Rp</span>

              <small>Estimasi biaya dihemat</small>
            </div>

            <div>
              <strong>{totalCO2}</strong>

              <span>kg</span>

              <small>CO₂ dihindari</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCORE ================= */}

      <section className="score-card">
        <div className="score-icon">
          <FaStar />
        </div>

        <div className="score-content">
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
            {badges.length}/{badgeData.length}
          </span>
        </div>

        <div className="badge-list">
          {badgeData.map((item) => {
            const diperoleh = badges.includes(item.nama);

            return (
              <div
                className={`badge-item ${
                  diperoleh ? "badge-unlocked" : "badge-locked"
                }`}
                key={item.id}
              >
                <div className={`badge-icon ${diperoleh ? item.color : ""}`}>
                  {diperoleh ? iconMap[item.icon] || <FaMedal /> : <FaLock />}
                </div>

                <div className="badge-info">
                  <h3>{item.nama}</h3>

                  <p>{item.syarat}</p>

                  <span>{diperoleh ? "✓ Diperoleh" : "🔒 Terkunci"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default ProfileContent;
