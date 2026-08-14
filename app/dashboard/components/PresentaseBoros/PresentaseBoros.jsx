import React, { useState } from "react";
import "./PresentaseBoros.css";
import { Progress } from "antd";
import { ApiFilled } from "@ant-design/icons"

const colors = ["#6A3EF5", "#FF9F1C", "#4CAF50"];

function PresentaseBoros({ devicesData }) {
  const [lihatSemua, setLihatSemua] = useState(false);

  const grandTotal = (devicesData || []).reduce(
    (sum, d) =>
      sum +
      ((Number(d.devicePower) || 0) *
        (Number(d.quantity) || 1) *
        (Number(d.usageDuration) || 0)) /
        1000,
    0,
  );

  const ranked = (devicesData || [])
    .map((device) => {
      const kwh =
        ((Number(device.devicePower) || 0) *
          (Number(device.quantity) || 1) *
          (Number(device.usageDuration) || 0)) /
        1000;

      return {
        nama: device.deviceName,
        waktu: `${device.usageDuration} jam/hari`,
        watt: `${device.devicePower || "?"} W`,
        kwh,
      };
    })
    .sort((a, b) => b.kwh - a.kwh)
    .map((item, index) => ({
      ...item,
      no: index + 1,
      konsumsi: `${item.kwh.toFixed(2)} kWh/hari`,
      persen: grandTotal > 0 ? Math.round((item.kwh / grandTotal) * 100) : 0,
      color: colors[index] || "#6A3EF5",
      icon: <ApiFilled />,
    }));

  const data = lihatSemua ? ranked : ranked.slice(0, 3);

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

                <Progress percent={item.persen} strokeColor={item.color} />

                <span>{item.persen}%</span>
              </div>
            </div>
          ))}

          {ranked.length > 3 && (
            <div
              className="lihatSemua"
              role="button"
              tabIndex={0}
              onClick={() => setLihatSemua((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setLihatSemua((prev) => !prev);
                  e.preventDefault();
                }
              }}
            >
              {lihatSemua
                ? "Sembunyikan perangkat lain"
                : `Lihat semua perangkat (${ranked.length})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PresentaseBoros;
