import "./ChallengeContent.css";
import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import {
  FaTrophy,
  FaStar,
  FaFire,
  FaSnowflake,
  FaGift,
  FaClock,
  FaLeaf,
  FaWallet,
  FaBolt,
  FaMedal,
  FaRobot,
  FaChevronRight,
} from "react-icons/fa";
import { BsBullseye } from "react-icons/bs";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

function Info() {
  const { activeChallenges, challenge } = useContext(DashboardContext);

  const aiRecommendations = challenge?.recommendations || [
    "Atur suhu AC di 24°C",
    "Gunakan kipas angin untuk mengurangi penggunaan AC",
    "Tutup pintu dan jendela saat AC dinyalakan",
    "Gunakan mode hemat energi",
  ];

  const impactPrediction = challenge?.impactPrediction;

  return (
    <div className="challengePage">
      <div className="challengeHeader">
        <h1>Tantangan</h1>

        <p>
          Selesaikan tantangan hemat energi dan dapatkan poin untuk membentuk
          kebiasaan hemat listrik setiap hari.
        </p>
      </div>

      {/* TOP CARD */}
      <div className="topCard">
        <div className="topItem">
          <div className="topIcon trophy">
            <FaTrophy />
          </div>

          <div>
            <p className="topLabel">Skor Efisiensi Anda</p>

            <div className="scoreNumber">
              <h2>78</h2>
              <span>/100</span>
              <div className="goodBadge">Baik</div>
            </div>
          </div>
        </div>

        <div className="line"></div>

        <div className="progressSection">
          <p className="topLabel">Progress Minggu Ini</p>

          <div className="progressBar">
            <div className="progressFill"></div>
          </div>

          <div className="progressBottom">
            <small>3 dari 5 tantangan selesai</small>
            <span>60%</span>
          </div>
        </div>

        <div className="line"></div>

        <div className="topItem">
          <div className="topIcon">
            <FaStar />
          </div>

          <div>
            <p className="topLabel">Poin Anda</p>
            <h3>1.250</h3>
            <small>poin</small>
          </div>
        </div>

        <div className="line"></div>

        <div className="topItem">
          <div className="topIcon fire">
            <FaFire />
          </div>

          <div>
            <p className="topLabel">Level Anda</p>
            <h3>Level 3</h3>
            <small>Pemula</small>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="challengeGrid">
        <div className="activeCard"></div>

        <div className="aiCard"></div>

        <div className="rightColumn">
          <div className="impactCard"></div>
          <div className="badgeCard"></div>
        </div>
      </div>
    </div>
  );
}

export default Info;
