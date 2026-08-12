import React from "react";
import "./PresentaseBoros.css";
import { AirConditionerOutlined, DashboardOutlined } from "@ant-design/icons";

const colors = ["#6A3EF5", "#FF9F1C", "#4CAF50"];

function PresentaseBoros({ analysis, devicesData }) {
  const defaultData = "";

  const wasteful = analysis?.wastefulDevices || [];

  const data =
    wasteful.length > 0
      ? wasteful.slice(0, 3).map((nama, i) => {
          const device = (devicesData || []).find(
            (d) => d.deviceName?.toLowerCase() === nama?.toLowerCase(),
          );
          const kwh = device
            ? ((device.devicePower || 0) *
                (device.quantity || 1) *
                (device.usageDuration || 0)) /
              1000
            : 0;
          return {
            no: i + 1,
            nama,
            waktu: device ? `${device.usageDuration} jam/hari` : "-",
            watt: device ? `${device.devicePower || "?"} W` : "-",
            konsumsi: device ? `${kwh.toFixed(2)} kWh/hari` : "-",
            persen: Math.max(1, 33 - i * 10),
            color: colors[i] || "#6A3EF5",
            icon: "🔌",
          };
        })
      : defaultData;

  return (
    <div className="borosCard">
      <div className="borosTitle">
        <h2>3 Perangkat Paling Boros</h2>
        <p>Perangkat dengan konsumsi energi tertinggi di rumah Anda.</p>
      </div>

      <div className="borosContent">
        <div className="deviceList">
          {data.map((item) => (
            <div className="deviceItem" key={item.no}>
              <div className="left">
                <div className="number" style={{ background: item.color }}>
                  {item.no}
                </div>

                <div className="deviceIcon">{item.icon}</div>

                <div>
                  <h3>{item.nama}</h3>

                  <span>
                    {item.waktu} • {item.watt}
                  </span>
                </div>
              </div>

              <div className="right">
                <strong>{item.konsumsi}</strong>

                <div className="progress">
                  <div
                    className="fill"
                    style={{
                      width: `${item.persen}%`,
                      background: item.color,
                    }}
                  />
                </div>

                <span>{item.persen}%</span>
              </div>
            </div>
          ))}

          <div className="lihatSemua">Lihat semua perangkat (7) →</div>
        </div>
      </div>
    </div>
  );
}

export default PresentaseBoros;
