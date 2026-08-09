import "./DashboardContent.css";

// icons
import { MdWavingHand } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi";
import { TbPercentage25 } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";

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
    icon: <IoMdPeople color="#0C0850" size={30} />,
    bgColor: "#f1f1f9",
    title: "Jumlah Penghuni",
  },
  {
    icon: <BsFillLightningChargeFill color="#7956EA" size={30} />,
    bgColor: "#F8F2FA",
    title: "Total konsumsi Estimasi",
  },
  {
    icon: <IoWallet color="#34A749" size={30} />,
    bgColor: "#F6F6EA",
    title: "Estimasi Biaya Listrik",
  },
  {
    icon: <HiOutlineChartBar color="#F4A94E" size={30} />,
    bgColor: "#FDF6E8",
    title: "Rata-rata per Hari",
  },
  {
    icon: <TbPercentage25 color="#0592F8" size={30} />,
    bgColor: "#F1F4F9",
    title: "Dibanding Sebelumnya",
  },
];

function DashboardContent() {
  const {
    analysis,
    challenge,
    devicesData,
    activeChallenges,
    acceptChallenge,
  } = useContext(DashboardContext);

  const tantanganAi = challenge?.challenges || challengeData;

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
            <div style={{ backgroundColor: data.bgColor }}>{data.icon}</div>
            <div>
              <p>{data.title}</p>
              <p>
                {index === 0 && analysis?.totalKwhPerDay}
                {index === 1 && challenge?.impactPrediction}
                {index === 2 && analysis?.totalKwhPerDay}
                {index === 3 && analysis?.totalKwhPerDay}
                {index === 4 && "-"}
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
                <div key={tantangan.urutan ?? tantangan.id}>
                  <p>{tantangan.tantangan || tantangan.title}</p>
                  <p>{tantangan.des || tantangan.description}</p>

                  <button
                    disabled={diterima}
                    onClick={() => acceptChallenge(tantangan)}
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
