import "./DashboardContent.css";

// icons
import { MdWavingHand } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi";
import { TbPercentage25 } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";

// components
import { App, Spin } from "antd";

// context
import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";

// data
import challengeData from "../../data/challengeData";

// components
import PresentaseBoros from "../../components/PresentaseBoros/PresentaseBoros";
import FollowUpAi from "../../components/FollowUpAi/FollowUpAi";

const userDataListrik = [
  {
    icon: <IoMdPeople size={30} />,
    title: "Jumlah Penghuni",
  },
  {
    icon: <BsFillLightningChargeFill size={30} />,
    title: "Total konsumsi Estimasi",
  },
  {
    icon: <IoWallet size={30} />,
    title: "Biaya Listrik Bulanan",
  },
  {
    icon: <HiOutlineChartBar size={30} />,
    title: "Rata-rata per Hari",
  },
  {
    icon: <TbPercentage25 size={30} />,
    title: "Dibanding Sebelumnya",
  },
];

function DashboardContent() {
  const {
    analysis,
    analysisLoading,
    dashboardStats,
    challenge,
    devicesData,
    activeChallenges,
    acceptChallenge,
    profilInfo,
  } = useContext(DashboardContext);

  const { message } = App.useApp();

  if (analysisLoading) {
    return (
      <div className="loading-analisis">
        <Spin size="large" style={{ margin: "auto 0" }} />
        <p>Sedang menganalisis data</p>
        <p className="loading-analisis-hint">
          Jangan tutup halaman ini selama analisis berlangsung
        </p>
      </div>
    );
  }

  const tantanganAi = challenge?.challenges || challengeData;

  const handleAccept = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    const sudahAda = activeChallenges.some(
      (c) => (c.tantangan || c.title) === nama,
    );

    if (sudahAda) {
      message.info("Tantangan ini sudah diterima");
      return;
    }

    const sukses = acceptChallenge(tantangan);

    if (sukses) {
      message.success("Tantangan berhasil diterima!");
    } else {
      message.warning(
        "Kamu hanya bisa memilih 1 tantangan sampai tantangan itu selesai",
      );
    }
  };

  return (
    <div>
      <div className="header-text-con-dashboard">
        <p>
          Halo! <MdWavingHand color="#F6BB3C" />
        </p>
        <p>Berikut adalah hasil analisis penggunaan energi rumah anda</p>
      </div>

      <div className="div-1-con data-listrik-user">
        {userDataListrik.map((data, index) => (
          <div key={index} className="data-con">
            <div>{data.icon}</div>
            <div className="data-con-info">
              <p>{data.title}</p>
              <p>
                {index === 0 && dashboardStats?.penghuni}
                {index === 1 && (dashboardStats?.totalKwhPerDay ?? "") + " kWh"}
                {index === 2 &&
                  (profilInfo?.biayaListrikBulanan
                    ? `Rp${Number(profilInfo.biayaListrikBulanan).toLocaleString("id-ID")}`
                    : `Rp${Number(dashboardStats?.estimasiBiaya || 0).toLocaleString("id-ID")}`)}
                {index === 3 &&
                  (dashboardStats?.rataPerPenghuni ?? "") + " kWh"}
                {index === 4 &&
                  (dashboardStats?.dibandingSebelumnya != null
                    ? dashboardStats.dibandingSebelumnya > 0
                      ? `+${dashboardStats.dibandingSebelumnya} %`
                      : `${dashboardStats.dibandingSebelumnya}%`
                    : "")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="div-2-con">
        <PresentaseBoros analysis={analysis} devicesData={devicesData} />
        <FollowUpAi />
      </div>

      {challenge && (
        <div className="challenge-div">
          <div className="text-container-challenge">
            <h3>
              Tiga langkah sederhana menuju penggunaan energi yang lebih efisien
            </h3>
            <p>Pilih tantangan pertama anda</p>
          </div>

          <div className="div-3-con pilihan-tantangan">
            {tantanganAi.map((tantangan) => {
              const diterima = activeChallenges.some(
                (c) =>
                  (c.tantangan || c.title) ===
                  (tantangan.tantangan || tantangan.title),
              );
              return (
                <div
                  className="tantangan-box"
                  key={
                    tantangan.id ??
                    tantangan.urutan ??
                    tantangan.tantangan ??
                    tantangan.title
                  }
                >
                  <div>
                    <p className="title">
                      {tantangan.tantangan || tantangan.title}
                    </p>
                    <p>{tantangan.des || tantangan.description}</p>
                  </div>

                  <button
                    disabled={diterima}
                    onClick={() => handleAccept(tantangan)}
                    style={{
                      backgroundColor: diterima ? "#756CE1" : "",
                    }}
                  >
                    {diterima ? "Sudah diterima ✓" : "Terima tantangan"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardContent;
