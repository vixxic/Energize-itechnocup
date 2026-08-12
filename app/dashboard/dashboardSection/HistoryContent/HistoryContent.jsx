import "./HistoryContent.css";

import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import { TbDeviceDesktopFilled } from "react-icons/tb";

const data = [
  {
    date: "7 Agustus 2026",
    time: "16:20",
    energyConsumePerDay: "17.3",
    dayaListrik: "2.200",
    BiayaBulanan: "510.000",
    Perangkat: 12,
    wastePart: ["Water Heater", "AC", "Mesin Cuci"],
  },
  {
    date: "4 Agustus 2026",
    time: "19:05",
    energyConsumePerDay: "11.2",
    dayaListrik: "900",
    BiayaBulanan: "315.000",
    Perangkat: 7,
    wastePart: ["AC", "Setrika", "TV"],
  },
  {
    date: "1 Agustus 2026",
    time: "14:37",
    energyConsumePerDay: "8.4",
    dayaListrik: "900",
    BiayaBulanan: "245.000",
    Perangkat: 5,
    wastePart: ["Laptop", "TV", "Kipas"],
  },
];

function HistoryContent() {
  return (
    <div className="history-section">
      <div className="header-text-con-history">
        <p>Riwayat Analisis</p>
        <p>Lihat hasil analisis konsumsi energi yang pernah kamu lakukan</p>
      </div>

      <div className="history-list">
        {data.map((data, index) => (
          <div className="history-card">
            <div className="history-card-header">
              <div>
                <span className="history-date">{data.date}</span>
              </div>
              <span className="history-badge">Analisis Selesai</span>
            </div>

            <div className="history-main">
              <div className="history-energy">
                <span className="history-value">
                  {data.energyConsumePerDay}
                </span>
                <span className="history-unit">kWh/hari</span>
                <p>Total konsumsi energi</p>
              </div>

              <div className="history-info">
                <div className="history-info-item">
                  <span>
                    <BsFillLightningChargeFill />
                  </span>
                  <div>
                    <p>Daya Listrik</p>
                    <strong>{data.dayaListrik}</strong>
                  </div>
                </div>

                <div className="history-info-item">
                  <span>
                    <IoWallet />
                  </span>
                  <div>
                    <p>Biaya Bulanan</p>
                    <strong>Rp {data.BiayaBulanan}</strong>
                  </div>
                </div>

                <div className="history-info-item">
                  <span>
                    <TbDeviceDesktopFilled />
                  </span>
                  <div>
                    <p>Perangkat</p>
                    <strong>{data.Perangkat} perangkat</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="history-waste">
              <p>Perangkat paling boros</p>

              <div className="waste-list">
                <span>1. AC</span>
                <span>2. Water Heater</span>
                <span>3. TV</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryContent;
