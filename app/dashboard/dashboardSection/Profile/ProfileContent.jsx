"use client";

import "./ProfileContent.css";

import { useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

import lencanaData from "../../data/badgeData";

// icons
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
    hitungTotalPenghematan,
    hitungCO2,
    hitungBiayaHemat,
  } = useContext(DashboardContext);

  // statistik akun
  const totalAnalisis = analysisHistory.length;
  const tantanganSelesai = completedChallenges.length;
  const energyScore = Number(analysis?.energyScore) || 0;
  const jumlahLencana = lencanas.length;

  // dampak penghematan
  const energiHemat = hitungTotalPenghematan(
    analysisHistory,
    completedChallenges,
  );

  const penghematanBiaya = hitungBiayaHemat(energiHemat);

  const totalCO2 = hitungCO2(energiHemat);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-icon">
          <FaLeaf />
        </div>

        <div>
          <h1>Profil Energi</h1>
          <p>Lihat perjalanan dan pencapaianmu dalam menghemat energi.</p>
        </div>
      </div>

      {/* statistik akun */}
      <div className="profile-section">
        <div className="section-heading">
          <div>
            <h2>Statistik Akun</h2>
            <p>Perkembangan aktivitasmu di Energize.</p>
          </div>
        </div>

        {/* jumlah analisis di lakukan */}
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

          {/* tantangan selesai */}
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

          {/* lencana di peroleh */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaMedal />
            </div>

            <div>
              <span>Lencana Diperoleh</span>
              <strong>{jumlahLencana}</strong>
              <small>lencana</small>
            </div>
          </div>
        </div>
      </div>

      {/* dampak penghematan */}
      <div className="efficiency-card">
        <div className="efficiency-icon">
          <FaChartLine />
        </div>

        <div className="efficiency-content">
          <span>Total Dampak Penghematan</span>

          <div className="saving-row">
            {/* energi dihemat */}
            <div>
              <strong>{energiHemat}</strong>
              <span>kWh</span>
              <small>Total energi dikurangi</small>
            </div>

            {/* biaya di hemat */}
            <div>
              <strong>Rp{penghematanBiaya.toLocaleString("id-ID")}</strong>
              <small>Estimasi biaya listrik dihemat</small>
            </div>

            {/* CO2 di hindari */}
            <div>
              <strong>{totalCO2}</strong>
              <span>kg</span>
              <small>Estimasi CO₂ dihindari</small>
            </div>
          </div>
        </div>
      </div>

      {/* bagian pencapaian */}
      <div className="profile-section lencana-section">
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
                  {diperoleh ? (
                    <img src={item.img} alt={item.nama} />
                  ) : (
                    <FaLock />
                  )}
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
      </div>
    </div>
  );
}

export default ProfileContent;
