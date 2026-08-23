import "./ProfileContent.css";

import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import badgeData from "../../data/badgeData";

import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaTrophy,
  FaStar,
  FaLeaf,
  FaLock,
  FaBolt,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

const iconMap = {
  FaTrophy: <FaTrophy />,
  FaStar: <FaStar />,
  FaLeaf: <FaLeaf />,
  FaLock: <FaLock />,
};

function ProfileContent() {
  const { badges, analysisHistory, completedChallenges, dashboardStats } =
    useContext(DashboardContext);

  const totalAnalisis = analysisHistory.length;
  const tantanganSelesai = completedChallenges.length;

  const energiHemat = (() => {
    const totals = analysisHistory.map(
      (h) => parseFloat(h.totalKwhPerDay) || 0,
    );
    let simpan = 0;
    for (let i = 1; i < totals.length; i++) {
      const selisih = totals[i - 1] - totals[i];
      if (selisih > 0) simpan += selisih;
    }
    return Math.round(simpan * 10) / 10;
  })();

  const penghematanBiaya = (() => {
    const totals = analysisHistory.map(
      (h) => parseFloat(h.totalKwhPerDay) || 0,
    );
    let simpan = 0;
    for (let i = 1; i < totals.length; i++) {
      const selisih = totals[i - 1] - totals[i];
      if (selisih > 0) simpan += selisih;
    }
    return Math.round(simpan * 30 * 1444.7);
  })();

  return (
    <div className="profilePage">
      {/* ================= HEADER ================= */}

      <div className="profileHeader">
        <p>Profil Saya</p>
        <p>Kelola informasi akun dan preferensi Anda</p>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="profileCard">
        <div className="profileLeft">
          <div className="profileAvatar">
            <FaUserCircle />
          </div>

          <div className="profileInfo">
            <h2>Sherin Ven Florennita</h2>

            <span>@sherven</span>

            <p>
              <FaEnvelope />
              sherin@email.com
            </p>

            <p>
              <FaMapMarkerAlt />
              Jakarta, Indonesia
            </p>

            <p>
              <FaCalendarAlt />
              Bergabung sejak Januari 2024
            </p>
          </div>
        </div>

        <button className="editBtn">
          <FaEdit />
          Edit Profil
        </button>
      </div>

      {/* ================= 3 CARD ================= */}

      <div className="profileGrid">
        {/* BADGE */}

        <div className="card">
          <div className="cardTitle">
            <FaTrophy />
            <h3>Pencapaian (Badge)</h3>
          </div>

          {badgeData.map((item) => {
            const terkunci = !badges.includes(item.nama);
            return (
              <div className="badgeItem" key={item.id}>
                <div className="badgeLeft">
                  <div className={`badgeIcon ${item.color}`}>
                    {iconMap[item.icon]}
                  </div>

                  <div>
                    <h4>{item.nama}</h4>
                    <p>{item.syarat}</p>
                  </div>
                </div>

                <span className={terkunci ? "locked" : "success"}>
                  {terkunci ? "Terkunci" : "Diperoleh"}
                </span>
              </div>
            );
          })}

          <button className="outlineBtn">Lihat Semua Badge</button>
        </div>

        {/* STATISTIK */}

        <div className="card">
          <div className="cardTitle">
            <FaChartBar />
            <h3>Statistik Akun</h3>
          </div>

          <div className="statBox">
            <div>
              <FaBolt />
              <div>
                <h4>Total Analisis</h4>
                <p>Analisis energi dilakukan</p>
              </div>
            </div>

            <span>{totalAnalisis}</span>
          </div>

          <div className="statBox">
            <div>
              <FaTrophy />
              <div>
                <h4>Tantangan Selesai</h4>
                <p>Challenge selesai</p>
              </div>
            </div>

            <span>{tantanganSelesai}</span>
          </div>

          <div className="statBox greenBg">
            <div>
              <FaLeaf />
              <div>
                <h4>Energi Dihemat</h4>
                <p>Total energi hemat</p>
              </div>
            </div>

            <span>{energiHemat} kWh</span>
          </div>

          <div className="statBox purpleBg">
            <div>
              <FaBolt />
              <div>
                <h4>Estimasi Penghematan</h4>
                <p>Total biaya hemat</p>
              </div>
            </div>

            <span>
              Rp
              {penghematanBiaya.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* AKTIVITAS */}

        <div className="card">
          <div className="cardTitle">
            <FaHistory />
            <h3>Riwayat Aktivitas Terakhir</h3>
          </div>

          {analysisHistory.length > 0 ? (
            [...analysisHistory]
              .reverse()
              .slice(0, 4)
              .map((h, i) => (
                <div className="activityItem" key={i}>
                  <div>
                    <h4>
                      Analisis: {h.totalKwhPerDay} kWh/hari
                      {h.perangkat ? ` (${h.perangkat} perangkat)` : ""}
                    </h4>
                  </div>

                  <span>
                    {new Date(h.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))
          ) : (
            <div className="activityItem">
              <div>
                <h4>Belum ada aktivitas</h4>
              </div>
            </div>
          )}

          <button className="outlineBtn">Lihat Semua Aktivitas</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
