import "./DashboardContent.css";

// icons
import { MdWavingHand } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi";
import { TbPercentage25 } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";

// components
import { App, Skeleton } from "antd";

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
    title: "Estimasi Biaya Listrik",
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
  } = useContext(DashboardContext);

  const { message } = App.useApp();

  if (analysisLoading) return <Skeleton active paragraph={{ rows: 4 }} />;

  const tantanganAi = challenge?.challenges || challengeData;

  const handleAccept = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    const sudahada = activeChallenges.some(
      (c) => (c.tantangan || c.title) === nama,
    );
    if (sudahada) return;

    const sukses = acceptChallenge(tantangan);
    if (!sukses) {
      message.warning(
        "Kamu hanya bisa pilih 1 sampai tantangan itu selesai",
      );
    }
  };

  return (
    <div>
      <div className="header-text-con-dashboard">
        <p>
          Halo, Orang! <MdWavingHand color="#F6BB3C" />
        </p>
        <p>Berikut adalah hasil analisis penggunaan energi rumah anda</p>
      </div>

      <div className="div-1-con data-listrik-user">
        {userDataListrik.map((data, index) => (
          <div key={index} className="data-con">
            <div>{data.icon}</div>
            <div>
              <p>{data.title}</p>
              <p>
                {index === 0 && dashboardStats?.penghuni}
                {index === 1 &&
                  (dashboardStats?.totalKwhPerDay ?? "-") + " kWh"}
                {index === 2 && dashboardStats?.estimasiBiaya != null
                  ? "Rp" + dashboardStats.estimasiBiaya.toLocaleString("id-ID")
                  : "-"}
                {index === 3 &&
                  (dashboardStats?.rataPerPenghuni ?? "-") + " kWh"}
                {index === 4 &&
                  (dashboardStats?.dibandingSebelumnya != null
                    ? `${dashboardStats.dibandingSebelumnya}%`
                    : "-")}
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
        <>
          <hr />

          <h4>
            Tiga langkah sederhana menuju penggunaan energi yang lebih efisien
          </h4>
          <p>Pilih tantangan pertama anda</p>

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
                  key={tantangan.urutan ?? tantangan.id}
                >
                  <p className="title">
                    {tantangan.tantangan || tantangan.title}
                  </p>
                  <p>{tantangan.des || tantangan.description}</p>

                  <button
                  disabled={diterima}
                  onClick={() => handleAccept(tantangan)}
                >
                    {diterima ? "Sudah diterima ✓" : "Terima tantangan"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardContent;
