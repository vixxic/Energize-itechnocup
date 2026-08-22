import "./ChallengeContent.css";
import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { FaTrophy, FaStar, FaFire } from "react-icons/fa";
import { Progress } from "antd";

function Info() {
  const {
    activeChallenges,
    completedChallenges,
    challenge,
    completeChallenge,
    analysis,
  } = useContext(DashboardContext);

  // data ai

  const aiRecommendations = challenge?.recommendations || [
    "Atur suhu AC di 24°C",
    "Gunakan kipas angin untuk mengurangi penggunaan AC",
    "Tutup pintu dan jendela saat AC dinyalakan",
    "Gunakan mode hemat energi",
  ];

  const impactPrediction = challenge?.impactPrediction;

  // skor efisien

  const energyScore = Number(analysis?.energyScore) || 0;

  const energyCategory = analysis?.energyCategory || "Belum dianalisis";

  // tantangan

  const totalTantanganMingguIni = 3;

  const jumlahSelesai = completedChallenges?.length || 0;

  const progressTantangan = Math.min(
    Math.round((jumlahSelesai / totalTantanganMingguIni) * 100),
    100,
  );

  return (
    <div>
      <div className="challenge-text-con-dashboard">
        <p>Tantangan</p>

        <p>
          Selesaikan tantangan hemat energi dan bangun kebiasaan hemat listrik
          setiap hari.
        </p>
      </div>

      {/* bagian atas */}

      <div className="topCard">
        {/* SKOR */}

        <div className="topItem">
          <div className="topIcon trophy">
            <FaTrophy />
          </div>

          <div>
            <p className="topLabel">Skor Efisiensi Anda</p>

            <div className="scoreNumber">
              <h2>{energyScore}</h2>

              <span>/100</span>

              <div className="goodBadge">{energyCategory}</div>
            </div>
          </div>
        </div>

        <div className="line"></div>

        {/* PROGRESS */}

        <div className="progressSection">
          <p className="topLabel">Progress Minggu Ini</p>

          <Progress percent={progressTantangan} showInfo={false} />

          <div className="progressBottom">
            <small>
              {jumlahSelesai} dari {totalTantanganMingguIni} tantangan selesai
            </small>

            <span>{progressTantangan}%</span>
          </div>
        </div>
      </div>

      {/* bagian bawah */}

      <div className="challengeGrid">
        {/* =========================
            TANTANGAN AKTIF
        ========================= */}

        <div className="activeCard">
          <h3>Tantangan Aktif</h3>

          {activeChallenges.length > 0 ? (
            activeChallenges.map((item, index) => (
              <div className="acBox" key={`${item.acceptedAt}-${index}`}>
                <div className="acContent">
                  <div className="titleRow">
                    <h1>{item.tantangan || item.title}</h1>
                  </div>

                  <p>{item.des || item.description || "—"}</p>

                  <p>
                    Diterima:{" "}
                    {item.acceptedAt
                      ? new Date(item.acceptedAt).toLocaleDateString("id-ID")
                      : "—"}
                  </p>
                </div>

                {item.status === "selesai" ? (
                  <span className="completedLabel">Selesai ✓</span>
                ) : (
                  <button
                    type="button"
                    className="completeBtn"
                    onClick={() => completeChallenge(item)}
                  >
                    Selesaikan
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Belum ada tantangan yang diterima.</p>
          )}
        </div>

        <div className="aiCard">
          <h3>Rekomendasi AI</h3>

          <p>Berdasarkan pola penggunaan energi Anda:</p>

          <div className="recommendationList">
            {aiRecommendations.map((recommendation, index) => (
              <div className="recommendationItem" key={index}>
                <span>{index + 1}</span>

                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            KOLOM KANAN
        ========================= */}

        <div className="rightColumn">
          {/* IMPACT */}

          <div className="impactCard">
            <h3>Dampak Penghematan</h3>

            {impactPrediction ? (
              <p>{impactPrediction}</p>
            ) : (
              <p>
                Selesaikan tantangan untuk melihat perkiraan dampak penghematan
                energi.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
