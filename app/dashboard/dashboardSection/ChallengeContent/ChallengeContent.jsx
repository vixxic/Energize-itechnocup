import "./ChallengeContent.css";
import { useContext, useState } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { FaTrophy } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Progress, Modal, Form, Input } from "antd";

function Info() {
  const {
    activeChallenges,
    completedChallenges,
    challenge,
    completeChallenge,
    analysis,
    dashboardStats,
    setCurrentMenu,
  } = useContext(DashboardContext);

  // data ai
  const acceptedChallenge = activeChallenges?.find(
    (item) => item.status !== "selesai",
  );

  const currentChallenge = challenge?.challenges?.find(
    (item) =>
      (item.tantangan || item.title) ===
      (acceptedChallenge?.tantangan || acceptedChallenge?.title),
  );

  const aiRecommendations = currentChallenge?.recommendations || [];

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { form } = Form.useForm();
  const [energyResult, setEnergyResult] = useState(null);

  const completingChallenge = (acceptedChallenge, values) => {
    const electricBefore = Number(values.electricBefore);
    const electricAfter = Number(values.electricAfter);

    setEnergyResult(electricAfter < electricBefore);

    completeChallenge({
      ...acceptedChallenge,
      electricBefore,
      electricAfter,
    });

    if (progressTantangan === 100) {
      return;
    }

    setIsModalOpen(true);
  };

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
          </div>
        </div>
      </div>

      {/* bagian bawah */}

      <div className="challengeGrid">
        <div className="activeCard">
          <h3>Tantangan Aktif</h3>

          {activeChallenges.filter((item) => item.status !== "selesai").length >
          0 ? (
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
            initialValues={{ electricBefore: dashboardStats.totalKwhPerDay }}
            onFinish={(values) =>
              completingChallenge(acceptedChallenge, values)
            }
          >
            <Form.Item
              label=" Penggunaan Listrik Sebelum Tantangan"
              name="electricBefore"
            >
              <Input readOnly suffix="kWh" />
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
              <Input type="number" min={0} step="0.01" suffix="kWh" />
            </Form.Item>

            <div>
              <button type="submit" className="completeBtn ">
                Selesaikan
              </button>
            </div>
          </Form>
        </div>

        {/* modal notif tantangan selesai */}

        <Modal type="success" open={isModalOpen} footer={null} closable={false}>
          {energyResult ? (
            <>
              <h3>🎉 Berhasil Menghemat Energi!</h3>

              <div>
                <FaArrowTrendDown />
              </div>

              <p>
                Penggunaan listrik kamu berhasil diturunkan. Pertahankan
                kebiasaan hemat energi ini!
              </p>
            </>
          ) : (
            <>
              <h3>💪 Tetap Semangat!</h3>

              <div>
                <FaArrowTrendUp />
              </div>

              <p>
                Penggunaan listrik kamu belum mengalami penurunan. Coba terapkan
                kembali rekomendasi hemat energi untuk hasil yang lebih baik.
              </p>
            </>
          )}

          <button
            className="completeBtn"
            onClick={() => {
              setIsModalOpen(false);
              setCurrentMenu("dashboard");
            }}
          >
            Lanjut Ke tantangan berikutnya
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
