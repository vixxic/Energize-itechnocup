import React, { useState } from "react";
import "./PresentaseBoros.css";
import { Progress } from "antd";
import { LuCable } from "react-icons/lu";
import { ApiFilled } from "@ant-design/icons";

function PresentaseBoros({ analysis, devicesData }) {
  const [lihatSemua, setLihatSemua] = useState(false);

  const normalizeName = (name) =>
    String(name || "")
      .trim()
      .toLowerCase();

  const deviceAnalysisMap = new Map(
    (analysis?.deviceAnalysis || []).map((d) => [normalizeName(d.name), d]),
  );

  const computed = (devicesData || []).map((device) => {
    const aiData = deviceAnalysisMap.get(device.deviceName);

    const power = aiData?.power ?? (Number(device.devicePower) || 0);

    const kwh =
      aiData?.kwhPerDay != null
        ? Number(aiData.kwhPerDay)
        : (power *
            (Number(device.quantity) || 1) *
            (Number(device.usageDuration) || 0)) /
          1000;

    return {
      nama: device.deviceName ?? "Perangkat tidak diketahui",
      waktu: `${device.usageDuration ?? 0} jam/hari`,
      watt: `${power || "?"} W${device.estimatedPower ? " (estimasi AI)" : ""}`,
      kwh: Number.isFinite(kwh) ? kwh : 0,
    };
  });

  const grandTotal = computed.reduce((sum, d) => sum + d.kwh, 0);

  const ranked = computed
    .sort((a, b) => b.kwh - a.kwh)
    .map((item, index) => ({
      ...item,
      no: index + 1,
      konsumsi: `${item.kwh.toFixed(2)} kWh/hari`,
      persen: grandTotal > 0 ? Math.round((item.kwh / grandTotal) * 100) : 0,
      color: "#33187E",
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

                <div className="deviceIcon">
                  <LuCable color="#2F2074" />
                </div>

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
