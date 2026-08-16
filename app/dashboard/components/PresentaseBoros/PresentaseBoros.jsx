import React from "react";
import "./PresentaseBoros.css";
import { Progress } from "antd";
import { LuCable } from "react-icons/lu";

const colors = ["#6A3EF5", "#FF9F1C", "#4CAF50"];

function PresentaseBoros({ analysis, devicesData }) {
  const defaultData = [];

  const wasteful = analysis?.wastefulDevices || [];

  const normalize = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, " ");

  const findDevice = (nama) => {
    const target = normalize(nama);

    return (devicesData || []).find(
      (d) =>
        normalize(d.deviceName) === target ||
        normalize(d.deviceName).includes(target) ||
        target.includes(normalize(d.deviceName)),
    );
  };

  let data = defaultData;

  if (wasteful.length > 0) {
    const totalKwhLokal = (devicesData || []).reduce(
      (sum, d) =>
        sum +
        ((Number(d.devicePower) || 0) *
          (Number(d.quantity) || 1) *
          (Number(d.usageDuration) || 0)) /
          1000,
      0,
    );

    const grandTotal = totalKwhLokal;

    data = wasteful.slice(0, 3).map((nama, i) => {
      const device = findDevice(nama);

      const kwh = device
        ? ((Number(device.devicePower) || 0) *
            (Number(device.quantity) || 1) *
            (Number(device.usageDuration) || 0)) /
          1000
        : 0;

      return {
        no: i + 1,
        nama,
        waktu: device ? `${device.usageDuration} jam/hari` : "-",
        watt: device ? `${device.devicePower || "?"} W` : "-",
        konsumsi: device ? `${kwh.toFixed(2)} kWh/hari` : "-",
        kwh,
        persen: grandTotal > 0 ? Math.round((kwh / grandTotal) * 100) : 0,
        color: colors[i] || "#6A3EF5",
        icon: <LuCable color="#2F2074" />,
      };
    });
  }

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

          <div className="lihatSemua">
            Lihat semua perangkat ({devicesData?.length || 0}) →
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresentaseBoros;
