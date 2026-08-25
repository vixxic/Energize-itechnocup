import "./HistoryContent.css";
import { useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

const formatTanggal = (tanggal) =>
  new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatWaktu = (tanggal) =>
  new Date(tanggal).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

// Ambil 3 perangkat dengan konsumsi kWh/hari terbesar
const getTopWastefulDevices = (deviceAnalysis) => {
  if (!Array.isArray(deviceAnalysis)) return [];

  return [...deviceAnalysis]
    .filter((device) => Number(device.kwhPerDay) > 0)
    .sort((a, b) => Number(b.kwhPerDay || 0) - Number(a.kwhPerDay || 0))
    .slice(0, 3);
};

function HistoryContent() {
  const { analysisHistory } = useContext(DashboardContext);

  const data = [...analysisHistory].reverse();

  return (
    <div className="history-section">
      <div className="header-text-con-history">
        <p>Riwayat Analisis</p>
        <p>Lihat hasil analisis konsumsi energi yang pernah kamu lakukan</p>
      </div>

      {data.length > 0 ? (
        <div className="history-list">
          {data.map((item, index) => {
            const topWastefulDevices = getTopWastefulDevices(
              item.deviceAnalysis,
            );

            return (
              <div className="history-card" key={item.tanggal || index}>
                <div className="history-card-header">
                  <div>
                    <span className="history-date">
                      {formatTanggal(item.tanggal)} -{" "}
                      {formatWaktu(item.tanggal)}
                    </span>
                  </div>
                </div>

                <div className="history-main">
                  <div className="history-energy">
                    <span className="history-value">{item.totalKwhPerDay}</span>

                    <span className="history-unit">kWh/hari</span>
                  </div>

                  <div className="history-info">
                    <div className="history-info-item">
                      <div>
                        <p>Daya Listrik</p>
                        <strong>{item.dayaListrik || "-"}</strong>
                      </div>
                    </div>

                    <div className="history-info-item">
                      <div>
                        <p>Biaya Bulanan</p>
                        <strong>
                          {item.biayaBulanan != null
                            ? `Rp ${Number(item.biayaBulanan).toLocaleString(
                                "id-ID",
                              )}`
                            : "-"}
                        </strong>
                      </div>
                    </div>

                    <div className="history-info-item">
                      <div>
                        <p>Perangkat</p>
                        <strong>
                          {item.perangkat != null
                            ? `${item.perangkat} perangkat`
                            : "-"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {topWastefulDevices.length > 0 && (
                  <div className="history-waste">
                    <p>Perangkat paling boros</p>

                    <div className="waste-list">
                      {topWastefulDevices.map((device, i) => (
                        <span key={`${device.name}-${i}`}>
                          {i + 1}. {device.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="history-empty">Belum ada riwayat analisis.</p>
      )}
    </div>
  );
}

export default HistoryContent;