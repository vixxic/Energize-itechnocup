import "./ChallengeContent.css";

import { useContext, useEffect, useState } from "react";

import { DashboardContext } from "../../context/DashboardContext";

import { FaTrophy } from "react-icons/fa";

import { HiOutlineLightBulb } from "react-icons/hi";

import { Progress, Modal, Form, Input, message } from "antd";

import lencanaData from "../../data/badgeData";

function Info() {
  const {
    activeChallenges,
    completedChallenges,
    challenge,
    completeChallenge,
    goToNextChallenge,
    analysis,
    setCurrentMenu,
    lencanas,
  } = useContext(DashboardContext);

  const acceptedChallenge = activeChallenges?.find(
    (item) => item.status === "berlangsung",
  );

  const currentChallenge = challenge?.challenges?.find(
    (item) =>
      (item.tantangan || item.title) ===
      (acceptedChallenge?.tantangan || acceptedChallenge?.title),
  );

  const aiRecommendations = currentChallenge?.recommendations || [];

  const energyScore = Number(analysis?.energyScore) || 0;
  const energyCategory = analysis?.energyCategory || "Belum dianalisis";

  const totalTantanganMingguIni = 3;
  const jumlahSelesai = completedChallenges?.length || 0;

  const progressTantangan = Math.min(
    Math.round((jumlahSelesai / totalTantanganMingguIni) * 100),
    100,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [energyResult, setEnergyResult] = useState(null);
  const [isLastChallenge, setIsLastChallenge] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (acceptedChallenge) {
      form.setFieldsValue({
        electricBefore: acceptedChallenge.electricBefore,
      });
    }
  }, [acceptedChallenge, form]);

  const completingChallenge = (values) => {
    if (!acceptedChallenge) {
      message.warning("Tidak ada tantangan aktif yang bisa diselesaikan.");
      return;
    }

    const electricBefore = Number(acceptedChallenge?.electricBefore) || 0;
    const electricAfter = Number(values.electricAfter);

    if (!electricAfter || electricAfter <= 0) {
      message.error("Masukkan penggunaan listrik yang valid.");
      return;
    }

    const isSaving = electricAfter < electricBefore;

    const lastChallenge = completedChallenges.length === 2;

    setEnergyResult(isSaving);
    setIsLastChallenge(lastChallenge);

    completeChallenge({
      ...acceptedChallenge,
      electricBefore,
      electricAfter,
    });

    form.setFieldsValue({
      electricBefore: electricAfter,
      electricAfter: undefined,
    });

    setIsModalOpen(true);
  };

  const getBadgeModal = () => {
    const urutanBadge = [
      "Penjaga Energi",
      "Ahli Hemat",
      "Pejuang Energi",
      "Mulai Berhemat",
      "Energi Efisien",
    ];

    const badgeYangDidapat = urutanBadge.find((nama) =>
      lencanas?.includes(nama),
    );

    if (!badgeYangDidapat) {
      return null;
    }

    const badge = lencanaData.find((item) => item.nama === badgeYangDidapat);

    if (!badge) {
      return null;
    }

    return {
      id: badge.id,
      nama: badge.nama,
      img: badge.img,
      syarat: badge.syarat,
    };
  };

  if (showAllCompleted) {
    return (
      <div className="clear-all-challenge-page">
        <img src="/cup-img.svg" alt="cup" width={100} height={80} />

        <h3>Semua Tantangan Selesai!</h3>

        <p>
          Kamu telah menyelesaikan 3 tantangan hemat energi. Pertahankan
          <br />
          kebiasaan baikmu untuk penggunaan energi yang lebih efisien.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="challenge-text-con-dashboard">
        <p>Tantangan</p>

        <p>
          Selesaikan tantangan hemat energi dan bangun kebiasaan hemat listrik
          setiap hari.
        </p>
      </div>

      <div className="topCard">
        <div className="topItem">
          <div className="topIcon trophy">
            <FaTrophy />
          </div>

          <div>
            <p className="topLabel">Skor Efisiensi Anda</p>

            <div className="scoreNumber">
              <h2>{energyScore}</h2>

              <span>/100</span>

              <div className="goodlencana">{energyCategory}</div>
            </div>
          </div>
        </div>

        <div className="line"></div>

        <div className="progressSection">
          <p className="topLabel">Progress Minggu Ini</p>

          <Progress percent={progressTantangan} showInfo={false} />

          <div className="progressBottom">
            <small>
              {jumlahSelesai} dari {totalTantanganMingguIni} tantangan selesai
            </small>
          </div>
        </div>
      </div>

      <div className="challengeGrid">
        <div className="activeCard">
          <h3>Tantangan Aktif</h3>

          {activeChallenges?.filter((item) => item.status !== "selesai")
            .length > 0 ? (
            activeChallenges
              .filter((item) => item.status !== "selesai")
              .map((item, index) => (
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
                </div>
              ))
          ) : (
            <p>Belum ada tantangan aktif.</p>
          )}
        </div>

        <div className="CompletedCard">
          <h3>Selesaikan tantangan ini</h3>

          <Form
            form={form}
            className="completeForm"
            layout="vertical"
            initialValues={{
              electricBefore: acceptedChallenge?.electricBefore || 0,
            }}
            onFinish={completingChallenge}
          >
            <Form.Item
              label="Penggunaan Listrik Sebelum Tantangan"
              name="electricBefore"
            >
              <Input readOnly suffix="kWh/hari" />
            </Form.Item>

            <Form.Item
              label="Penggunaan Listrik Setelah Tantangan"
              name="electricAfter"
              rules={[
                {
                  required: true,
                  message: "Data belum lengkap",
                },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === "") {
                      return Promise.resolve();
                    }

                    if (isNaN(Number(value)) || Number(value) <= 0) {
                      return Promise.reject(
                        new Error("Masukkan penggunaan listrik yang valid"),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={0} step="0.01" suffix="kWh/hari" />
            </Form.Item>

            <div className="electric-note">
              <span>
                <HiOutlineLightBulb color="rgb(140, 92, 255)" size={20} />
              </span>

              <p>
                Untuk mengetahui rata-rata penggunaan listrik setelah tantangan,
                lakukan analisis kembali setelah menerapkan kebiasaan hemat
                energi.
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="completeBtn"
                disabled={!acceptedChallenge}
              >
                Selesaikan
              </button>
            </div>
          </Form>
        </div>

        <Modal open={isModalOpen} footer={null} closable={false} centered>
          {energyResult ? (
            <div className="modal-after-challenge success">
              <h2>Berhasil Menghemat Energi!</h2>

              <p>
                Penggunaan listrik kamu berhasil diturunkan. Pertahankan
                kebiasaan hemat energi ini!
              </p>

              {getBadgeModal() && (
                <>
                  <p style={{ fontWeight: "bold" }}>
                    Kamu {getBadgeModal().syarat}
                  </p>

                  <div className="badge-modal-con">
                    <div className="badge-bg">
                      <img src="./badge-bg-modal.svg" alt="badge background" />
                    </div>

                    <div className="badge-con">
                      <img
                        src={getBadgeModal().img}
                        alt={getBadgeModal().nama}
                      />
                    </div>
                  </div>

                  <div className="get-badge-text">
                    <p>Selamat kamu mendapatkan lencana</p>

                    <h5>{getBadgeModal().nama}</h5>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="modal-after-challenge failed">
              <h2>Tantangan Belum Berhasil</h2>

              <p>
                Penggunaan listrik kamu belum mencapai target penghematan. Yuk,
                coba lagi dan lakukan perubahan kecil untuk menghemat lebih
                banyak energi!
              </p>

              {getBadgeModal() && (
                <>
                  <p style={{ fontWeight: "bold" }}>
                    Kamu {getBadgeModal().syarat}
                  </p>

                  <div className="badge-modal-con">
                    <div className="badge-bg">
                      <img src="./badge-bg-modal.svg" alt="badge background" />
                    </div>

                    <div className="badge-con">
                      <img
                        src={getBadgeModal().img}
                        alt={getBadgeModal().nama}
                      />
                    </div>
                  </div>

                  <div className="get-badge-text">
                    <p>Selamat kamu mendapatkan lencana</p>
                    <h5>{getBadgeModal().nama}</h5>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            className="completeBtn"
            onClick={() => {
              setIsModalOpen(false);

              if (isLastChallenge) {
                setShowAllCompleted(true);
                setCurrentMenu("profil");
                return;
              }

              goToNextChallenge();
            }}
          >
            {isLastChallenge ? "Lihat Hasil" : "Lanjutkan Tantangan Berikutnya"}
          </button>
        </Modal>

        <div className="aiCard">
          <h3>Rekomendasi AI</h3>

          <p>Berdasarkan pola penggunaan energi Anda:</p>

          <div className="recommendationList">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((recommendation, index) => (
                <div className="recommendationItem" key={index}>
                  <p>{recommendation}</p>
                </div>
              ))
            ) : (
              <p>Belum ada rekomendasi AI.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
