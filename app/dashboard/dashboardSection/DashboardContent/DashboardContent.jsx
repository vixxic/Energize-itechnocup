import "./DashboardContent.css";

// icons
import { MdWavingHand } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi";
import { TbPercentage25 } from "react-icons/tb";
import { IoMdPeople } from "react-icons/io";

import { App, Spin, Modal } from "antd";

import { useContext, useEffect, useState } from "react";

import { DashboardContext } from "../../context/DashboardContext";

import challengeData from "../../data/challengeData";
import PresentaseBoros from "../../components/PresentaseBoros/PresentaseBoros";
import FollowUpAi from "../../components/FollowUpAi/FollowUpAi";

// isi dashboard stats
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
    completedChallenges,
    acceptChallenge,
    profilInfo,
    setCurrentMenu,
    lencanas,
  } = useContext(DashboardContext);

  const { message } = App.useApp();

  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // mengatur kapan modal energi efisien boleh muncul
  useEffect(() => {
    if (!analysis) return;

    if (!lencanas?.includes("Energi Efisien")) return;

    const sudahPernahLihat = localStorage.getItem(
      "modalEnergiEfisienSudahDilihat",
    );

    if (!sudahPernahLihat) {
      setShowBadgeModal(true);
    }
  }, [analysis, lencanas]);

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);

    localStorage.setItem("modalEnergiEfisienSudahDilihat", "true");
  };

  // loading setelah melakukan analisis (load data)
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

  // variable menyimpan 3 tantanfan dari ai
  const tantanganAi = challenge?.challenges || challengeData;

  // function menerima tantangan
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

      setCurrentMenu("tantangan");
    } else {
      message.warning(
        "Kamu hanya bisa memilih 1 tantangan sampai tantangan itu selesai",
      );
    }
  };

  return (
    <div>
      {/* modal saat user mendapat lencana energi sudah efisien */}
      <Modal
        open={showBadgeModal}
        footer={null}
        closable={true}
        onCancel={handleCloseBadgeModal}
        centered
      >
        <div className="modal-after-challenge success">
          <h2>Berhasil Menghemat Energi!</h2>

          <p>
            Penggunaan listrik kamu sudah cukup efisien. Pertahankan kebiasaan
            hemat energi ini!
          </p>

          <p style={{ fontWeight: "bold" }}>
            Kamu mendapatkan skor energi lebih dari 60
          </p>

          <div className="badge-modal-con">
            <div className="badge-bg">
              <img src="/badge-bg-modal.svg" alt="badge background" />
            </div>

            <div className="badge-con">
              <img
                src="/badge-img/badge-efisien.png"
                alt="Badge Energi Efisien"
              />
            </div>
          </div>

          <div className="get-badge-text">
            <p>Selamat! Kamu mendapatkan lencana</p>
            <h5>Energi Efisien</h5>
          </div>
        </div>
      </Modal>

      <div className="header-text-con-dashboard">
        <p>
          Halo! <MdWavingHand color="#F6BB3C" />
        </p>

        <p>Berikut adalah hasil analisis penggunaan energi rumah anda</p>
      </div>

      {/* dahsboard stats */}
      <div className="div-1-con data-listrik-user">
        {userDataListrik.map((data, index) => (
          <div key={index} className="data-con">
            <div>{data.icon}</div>

            <div className="data-con-info">
              <p>{data.title}</p>

              <p>
                {index === 0 && dashboardStats?.penghuni}

                {index === 1 &&
                  (profilInfo?.listrikBulanan
                    ? profilInfo.listrikBulanan
                    : (dashboardStats?.totalKwhPerMonth ?? "")) + " kWh/bulan"}

                {index === 2 &&
                  (profilInfo?.biayaListrikBulanan
                    ? `Rp${Number(
                        profilInfo.biayaListrikBulanan,
                      ).toLocaleString("id-ID")}`
                    : `Rp${Number(
                        dashboardStats?.estimasiBiaya || 0,
                      ).toLocaleString("id-ID")}`)}

                {index === 3 && (dashboardStats?.totalKwhPerDay ?? "") + " kWh"}

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

      {/* hasil perhitunagn energi dan pertanyaan dari ai */}
      <div className="div-2-con">
        <PresentaseBoros analysis={analysis} devicesData={devicesData} />
        <FollowUpAi />
      </div>

      {/* tantangan setelah menjawab pertanyaan ai */}
      {completedChallenges.length >= 3
        ? null
        : challenge && (
            <div className="challenge-div">
              <div className="text-container-challenge">
                <h3>
                  Tiga langkah sederhana menuju penggunaan energi yang lebih
                  efisien
                </h3>

                <p>Pilih tantangan pertama anda</p>
              </div>

              <div className="div-3-con pilihan-tantangan">
                {tantanganAi.map((tantangan) => {
                  const namaTantangan = tantangan.tantangan || tantangan.title;

                  const diterima = activeChallenges.some(
                    (c) => (c.tantangan || c.title) === namaTantangan,
                  );

                  const sudahSelesai = completedChallenges.some(
                    (c) => (c.tantangan || c.title) === namaTantangan,
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
                        disabled={diterima || sudahSelesai}
                        onClick={() => handleAccept(tantangan)}
                        style={{
                          backgroundColor:
                            diterima || sudahSelesai ? "#756CE1" : "",
                        }}
                      >
                        {sudahSelesai
                          ? "Sudah selesai ✓"
                          : diterima
                            ? "Sudah diterima ✓"
                            : "Terima tantangan"}
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
