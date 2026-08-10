import React from "react";
import "./PresentaseBoros.css";
import { Progress } from "antd";
import { AirConditionerOutlined, DashboardOutlined } from "@ant-design/icons";

const colors = ["#6A3EF5", "#FF9F1C", "#4CAF50"];

function PresentaseBoros({ analysis, devicesData }) {
  const defaultData = [
    {
      no: 1,
      nama: "AC",
      waktu: "8 jam/hari",
      watt: "800 W",
      konsumsi: "5,21 kWh/hari",
      persen: 42,
      color: "#6A3EF5",
      icon: "❄️",
    },
    {
      no: 2,
      nama: "Kulkas",
      waktu: "24 jam/hari",
      watt: "150 W",
      konsumsi: "2,28 kWh/hari",
      persen: 18,
      color: "#FF9F1C",
      icon: "🧊",
    },
    {
      no: 3,
      nama: "TV",
      waktu: "5 jam/hari",
      watt: "100 W",
      konsumsi: "1,37 kWh/hari",
      persen: 11,
      color: "#4CAF50",
      icon: "📺",
    },
  ];

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
  let totalPersen = defaultData.reduce((sum, d) => sum + d.persen, 0);

  if (wasteful.length > 0) {
    const totalKwhLokal = (devicesData || []).reduce(
      (sum, d) =>
        sum + ((Number(d.devicePower) || 0) * (d.quantity || 1) * (d.usageDuration || 0)) / 1000,
      0,
    );
    const grandTotal = totalKwhLokal;

    data = wasteful.slice(0, 3).map((nama, i) => {
      const device = findDevice(nama);
      const kwh = device
        ? ((Number(device.devicePower) || 0) * (device.quantity || 1) * (device.usageDuration || 0)) / 1000
        : 0;
      return {
        no: i + 1,
        nama,
        waktu: device ? `${device.usageDuration} jam/hari` : "-",
        watt: device ? `${device.devicePower || "?"} W` : "-",
        konsumsi: device ? `${kwh.toFixed(2)} kWh/hari` : "-",
        kwh,
        color: colors[i] || "#6A3EF5",
        icon: "🔌",
      };
    });

    const sumTop3 = data.reduce((s, d) => s + d.kwh, 0);
    totalPersen = Math.min(100, grandTotal > 0 ? Math.round((sumTop3 / grandTotal) * 100) : 0);
    data = data.map((d) => ({
      ...d,
      persen: Math.min(100, grandTotal > 0 ? Math.round((d.kwh / grandTotal) * 100) : 0),
    }));
  }

  return (
    <div className="borosCard">
      <div className="borosTitle">
        <h2>3 Perangkat Paling Boros</h2>
        <p>Perangkat dengan konsumsi energi tertinggi di rumah Anda.</p>
      </div>

      <div className="borosContent">
        <div className="donutWrapper">
          <div className="donut">
            <div className="donutCenter">
              <Progress type="circle" percent={totalPersen} />
              <p>Total konsumsi dari 3 perangkat</p>
            </div>
          </div>
        </div>

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

                <Progress
                  percent={item.persen}
                  strokeColor={item.color}
                />

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
