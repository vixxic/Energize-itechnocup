import "./ProfileContent.css";

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

function ProfileContent() {
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

          <div className="badgeItem">
            <div className="badgeLeft">
              <div className="badgeIcon gold">
                <FaTrophy />
              </div>

              <div>
                <h4>Hemat Pemula</h4>
                <p>Selesaikan 1 tantangan</p>
              </div>
            </div>

            <span className="success">Diperoleh</span>
          </div>

          <div className="badgeItem">
            <div className="badgeLeft">
              <div className="badgeIcon purple">
                <FaStar />
              </div>

              <div>
                <h4>Konsisten</h4>
                <p>7 hari berturut-turut</p>
              </div>
            </div>

            <span className="success">Diperoleh</span>
          </div>

          <div className="badgeItem">
            <div className="badgeLeft">
              <div className="badgeIcon green">
                <FaLeaf />
              </div>

              <div>
                <h4>Peduli Lingkungan</h4>
                <p>Hemat 10 kg CO₂</p>
              </div>
            </div>

            <span className="success">Diperoleh</span>
          </div>

          <div className="badgeItem">
            <div className="badgeLeft">
              <div className="badgeIcon gray">
                <FaLock />
              </div>

              <div>
                <h4>Ahli Hemat</h4>
                <p>Selesaikan 20 tantangan</p>
              </div>
            </div>

            <span className="locked">Terkunci</span>
          </div>

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

            <span>25</span>
          </div>

          <div className="statBox">
            <div>
              <FaTrophy />
              <div>
                <h4>Tantangan Selesai</h4>
                <p>Challenge selesai</p>
              </div>
            </div>

            <span>18</span>
          </div>

          <div className="statBox greenBg">
            <div>
              <FaLeaf />
              <div>
                <h4>Energi Dihemat</h4>
                <p>Total energi hemat</p>
              </div>
            </div>

            <span>124 kWh</span>
          </div>

          <div className="statBox purpleBg">
            <div>
              <FaBolt />
              <div>
                <h4>Estimasi Penghematan</h4>
                <p>Total biaya hemat</p>
              </div>
            </div>

            <span>Rp235.000</span>
          </div>
        </div>

        {/* AKTIVITAS */}

        <div className="card">
          <div className="cardTitle">
            <FaHistory />
            <h3>Riwayat Aktivitas Terakhir</h3>
          </div>

          <div className="activityItem">
            <div>
              <h4>Menyelesaikan tantangan harian</h4>

              <small>+100 poin</small>
            </div>

            <span>2 jam lalu</span>
          </div>

          <div className="activityItem">
            <div>
              <h4>Melakukan analisis konsumsi AC</h4>
            </div>

            <span>5 jam lalu</span>
          </div>

          <div className="activityItem">
            <div>
              <h4>Menghemat 2.4 kWh energi</h4>
            </div>

            <span>Kemarin</span>
          </div>

          <div className="activityItem">
            <div>
              <h4>Login ke akun</h4>
            </div>

            <span>Kemarin</span>
          </div>

          <button className="outlineBtn">Lihat Semua Aktivitas</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
