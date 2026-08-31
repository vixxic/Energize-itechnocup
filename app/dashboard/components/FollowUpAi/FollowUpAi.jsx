"use client";

import { useState, useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { App } from "antd";
import "./FollowUpAi.css";

import { FaRegHandPointDown } from "react-icons/fa";

export default function FollowUpAi() {
  const { analysis, challenge, setChallenge, completedChallenges } =
    useContext(DashboardContext);

  const { message } = App.useApp();

  const [selected, setSelected] = useState("");
  const [other, setOther] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseChoices = analysis?.followUpChoices || [
    "Untuk tidur",
    "Untuk bekerja / belajar",
  ];

  const options = baseChoices.includes("Lainnya")
    ? baseChoices
    : [...baseChoices, "Lainnya"];

  const topDevices = analysis?.wastefulDevices?.[0];

  const question =
    analysis?.followUpQuestion ||
    `Mengapa ${topDevices || "perangkat tersebut"} dipakai setiap hari?`;

  const summary = analysis?.summary;

  async function HandleSubmit() {
    const jawaban = selected === "Lainnya" ? other.trim() : selected;

    if (!jawaban) {
      setError("Silakan pilih jawaban atau tulis alasan dahulu");
      return;
    }

    setError("");
    setLoading(true);

    message.warning(
      "Jangan tutup halaman atau refresh halaman selama proses berlangsung!",
    );

    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis,
          answer: jawaban,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error server");
      }

      setChallenge(data);

      setSelected("");
      setOther("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (challenge) {
    if (completedChallenges.length >= 3) {
      return (
        <div className="followUpCard followUpCompleted">
          <div className="followHeader">
            <div>
              <h2>Semua Tantangan Selesai!</h2>
            </div>
          </div>

          <div className="challenge-icon">
            <img style={{ width: "70%" }} src="./cup-img.svg" />
          </div>

          <div className="challengeReminder">
            <p>
              Total tantangan selesai:{" "}
              <strong>{completedChallenges.length}/3</strong>
            </p>

            <strong>
              Kamu telah menyelesaikan semua tantangan hemat energi. Pertahankan
              kebiasaan hemat listrik setiap hari!
            </strong>
          </div>
        </div>
      );
    } else {
      return (
        <div className="followUpCard followUpCompleted">
          <div className="followHeader">
            <div>
              <h2>Tantangan kamu sudah siap!</h2>

              <p>
                Berdasarkan jawaban kamu, kami sudah menyiapkan 3 tantangan
                hemat energi yang sesuai.
              </p>
            </div>
          </div>

          <div className="challenge-icon">
            <img src="./challenge-img.svg" />
          </div>

          <div className="challengeReminder">
            <p>
              <FaRegHandPointDown /> Pilih dan mulai salah satu tantangan di
              bawah
            </p>

            <strong>
              Selesaikan tantangan untuk membantu mengurangi penggunaan energi
              di rumahmu!
            </strong>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="followUpCard">
      <div className="followBody">
        <h3>{question}</h3>

        <p className="subtitle">
          Pilih alasan yang paling sesuai atau tulis jawaban Anda sendiri.
        </p>

        {options.map((item) => (
          <label className="radioCard" key={item}>
            <input
              type="radio"
              checked={selected === item}
              onChange={() => setSelected(item)}
            />

            <span>{item}</span>
          </label>
        ))}

        {selected === "Lainnya" && (
          <input
            className="otherInput"
            placeholder="Tulis jawaban..."
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        )}

        {error && <p className="errorText">{error}</p>}
      </div>

      <button className="submitBtn" onClick={HandleSubmit} disabled={loading}>
        {loading ? "Menganalisis..." : "Kirim Jawaban →"}
      </button>
    </div>
  );
}
