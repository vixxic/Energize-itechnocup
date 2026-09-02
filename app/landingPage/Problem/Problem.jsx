"use client";

import "./Problem.css";

import { FaArrowTrendUp } from "react-icons/fa6";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";

const problemsData = [
  {
    title: "Biaya Meningkat",
    icon: FaArrowTrendUp,
    text: "Penggunaan energi yang berlebihan menyebabkan biaya listrik terus bertambah setiap bulan.",
    img: "/problems-img/3.png",
  },
  {
    title: "Energi Terbuang",
    icon: BsLightningChargeFill,
    text: "Perangkat yang digunakan secara tidak efisien menyebabkan pemborosan energi dan meningkatkan tagihan listrik.",
    img: "/problems-img/4.png",
  },
  {
    title: "Dampak Lingkungan",
    icon: FaLeaf,
    text: "Konsumsi energi yang berlebihan dapat meningkatkan emisi karbon dan memperburuk kondisi lingkungan.",
    img: "/problems-img/5.png",
  },
];

function Problem() {
  return (
    <div id="problem-section">
      <div className="problem-header">
        <p className="problem-title">Dampak Pemborosan Energi</p>

        <p className="problem-subtitle">
          Kebiasaan kecil dalam penggunaan listrik dapat membawa dampak besar
          bagi pengeluaran dan lingkungan.
        </p>
      </div>

      <div className="problems-con">
        {problemsData.map((problem) => {
          const Icon = problem.icon;

          return (
            <div className="problem-box" key={problem.title}>
              <img
                src={problem.img}
                alt={problem.title}
                className="problem-image"
              />

              <div className="problem-popup">
                <div className="problem-icon">
                  <Icon />
                </div>

                <h3>{problem.title}</h3>

                <p>{problem.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Problem;
