"use client";

import { useState, useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { App } from "antd";
import "./FollowUpAi.css";

export default function FollowUpAi() {
  const { analysis, setChallenge } = useContext(DashboardContext);
  const { message } = App.useApp();
  const [selected, setSelected] = useState("");
  const [other, setOther] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = analysis?.followUpChoices || [
    "Untuk tidur",
    "Untuk bekerja / belajar",
    "Lainnya",
  ];

  const topDevices = analysis?.wastefulDevices?.[0];
  const question = analysis?.followUpQuestion || `Mengapa ${topDevices} dipakai setiap hari?`;
  const summary = analysis?.summary;

  async function HandleSubmit() {
    const jawaban = selected === "Lainnya" ? other : selected;
    if (!jawaban) {
      setError("Silakan pilih jawaban atau tulis alasan dahulu");
      return;
    }
    setError("");
    setLoading(true);
    message.warning("Jangan tutup halaman atau refresh halaman selama proses berlangsung!");
    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({analysis, answer: jawaban}),
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

  return (
    <div className="followUpCard">
      <div className="followHeader">
        <div className="followIcon">
          ❄️
        </div>
        <div>
          <h2>Perangkat Paling Boros: {topDevices}</h2>
          <p>
            {summary}
          </p>
        </div>
      </div>
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

      </div>

      <button className="submitBtn" onClick={HandleSubmit} disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Jawaban →"}
      </button>
    </div>
  );
}