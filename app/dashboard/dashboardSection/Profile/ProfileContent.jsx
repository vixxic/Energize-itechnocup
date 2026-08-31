"use client";

import "./ProfileContent.css";

import { useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

import lencanaData from "../../data/badgeData";

import {
  FaTrophy,
  FaBolt,
  FaLeaf,
  FaChartLine,
  FaMedal,
  FaStar,
  FaLock,
} from "react-icons/fa";

function ProfileContent() {
  const {
    lencanas = [],
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
  // HITUNG ENERGI TERHEMAT
  // =========================
  //
  // Penghematan dihitung dari:
  // 1. Penurunan konsumsi antar analisis
  // 2. Penurunan konsumsi dari tantangan
  //
  // Hanya penurunan yang dihitung.
  // Jika konsumsi naik/tetap → tidak dihitung sebagai penghematan.
  //

  const hitungPenghematanAnalisis = () => {
    if (!analysisHistory || analysisHistory.length < 2) {
      return 0;
    }

    let totalHemat = 0;

    for (let i = 1; i < analysisHistory.length; i++) {
      const sebelumnya = Number(analysisHistory[i - 1]?.totalKwhPerDay) || 0;

      const sekarang = Number(analysisHistory[i]?.totalKwhPerDay) || 0;

      if (sebelumnya > 0 && sekarang > 0) {
        const selisih = sebelumnya - sekarang;

        if (selisih > 0) {
          totalHemat += selisih;
        }
      }
    }

    return totalHemat;
  };

  // =========================
  // HITUNG PENGHEMATAN TANTANGAN
  // =========================

  const hitungPenghematanTantangan = () => {
    if (!completedChallenges || completedChallenges.length === 0) {
      return 0;
    }

    let totalHemat = 0;

    completedChallenges.forEach((challenge) => {
      const sebelum = Number(challenge?.electricBefore) || 0;
      const sesudah = Number(challenge?.electricAfter) || 0;

      if (sebelum > 0 && sesudah > 0) {
        const selisih = sebelum - sesudah;

        if (selisih > 0) {
          totalHemat += selisih;
        }
      }
    });

    return totalHemat;
  };

  // =========================
  // TOTAL ENERGI TERHEMAT
  // =========================

  const energiHematAnalisis = hitungPenghematanAnalisis();
  const energiHematTantangan = hitungPenghematanTantangan();

  const energiHemat =
    Math.round((energiHematAnalisis + energiHematTantangan) * 100) / 100;

  // =========================
  // HITUNG BIAYA DIHEMAT
  // =========================

  const hitungBiayaHemat = (kwh) => {
    const tarifListrik = 1444.7;

    // Penghematan kWh/hari
    // dikalikan 30 hari
    // lalu dikalikan tarif listrik per kWh

    const biaya = kwh * 30 * tarifListrik;

    return Math.round(biaya);
  };

  const penghematanBiaya = hitungBiayaHemat(energiHemat);

  // =========================
  // HITUNG CO2 DIHINDARI
  // =========================

  const hitungCO2 = (kwh) => {
    const faktorEmisi = 0.85;

    const co2 = kwh * faktorEmisi;

    return Math.round(co2 * 100) / 100;
  };

  const totalCO2 = hitungCO2(energiHemat);

  // =========================
  // SCORE
  // =========================

  const energyScore = Number(analysis?.energyScore) || 0;

  // =========================
  // lencana
  // =========================

  const jumlahlencana = lencanas.length;

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

          {/* skor energi */}

          <div className="stat-card">
            <div className="stat-icon">
              <FaStar />
            </div>

            <div>
              <span>Skor Efisiensi Terakhir</span>

              <strong>{energyScore}</strong>

              <small>/ 100</small>
            </div>
          </div>

          {/* lencana diperoleh*/}

          <div className="stat-card">
            <div className="stat-icon">
              <FaMedal />
            </div>

            <div>
              <span>lencana diperoleh</span>

              <strong>{jumlahlencana}</strong>

              <small>lencana</small>
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
            {/* ENERGI */}

            <div>
              <strong>{energiHemat}</strong>

              <span>kWh</span>

              <small>Energi dihemat</small>
            </div>

            {/* BIAYA */}

            <div>
              <strong>Rp{penghematanBiaya.toLocaleString("id-ID")}</strong>

              <small>Estimasi biaya dihemat</small>
            </div>

            {/* CO2 */}

            <div>
              <strong>{totalCO2}</strong>

              <span>kg</span>

              <small>CO₂ dihindari</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= lencana ================= */}

      <section className="profile-section lencana-section">
        <div className="section-heading">
          <div>
            <h2>Pencapaian</h2>

            <p>Kumpulkan lencana dengan membangun kebiasaan hemat energi.</p>
          </div>

          <span className="lencana-progress">
            {lencanas.length}/{lencanaData.length}
          </span>
        </div>

        <div className="lencana-list">
          {lencanaData.map((item) => {
            const diperoleh = lencanas.includes(item.nama);

            return (
              <div
                className={`lencana-item ${
                  diperoleh ? "lencana-unlocked" : "lencana-locked"
                }`}
                key={item.id}
              >
                <div className={`lencana-icon ${diperoleh ? item.color : ""}`}>
                  {diperoleh ? <img src={item.img} /> : <FaLock />}
                </div>

                <div className="lencana-info">
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
