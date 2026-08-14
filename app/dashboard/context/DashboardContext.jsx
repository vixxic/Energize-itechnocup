"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const DashboardContext = createContext();

function loadState(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // biarin
  }
}

export function DashboardProvider({ children }) {
  // const [analysis, setAnalysis] = useState(() => loadState("analysis", null));

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    setAnalysis(loadState("analysis", null));
  }, []);

  // const [challenge, setChallenge] = useState(() =>
  //   loadState("challenge", null),
  // );

  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    setChallenge(loadState("challenge", null));
  }, []);

  // const [activeChallenges, setActiveChallenges] = useState(() =>
  //   loadState("activeChallenges", []),
  // );

  const [activeChallenges, setActiveChallenges] = useState([]);

  useEffect(() => {
    setActiveChallenges(loadState("activeChallenges", []));
  }, []);

  // const [currentMenu, setCurrentMenu] = useState(() =>
  //   loadState("analysis", null) ? "dashboard" : "analisis",
  // );

  const [currentMenu, setCurrentMenu] = useState("analisis");

  useEffect(() => {
    const savedAnalysis = loadState("analysis", null);

    if (savedAnalysis) {
      setCurrentMenu("dashboard");
    }
  }, []);

  // const [devicesData, setDevicesData] = useState(() =>
  //   loadState("devicesData", []),
  // );

  const [devicesData, setDevicesData] = useState([]);

  useEffect(() => {
    setDevicesData(loadState("devicesData", []));
  }, []);

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // const [profilInfo, setProfilInfo] = useState(() =>
  //   loadState("profilInfo", {
  //     penghuni: 1,
  //     dayaListrikRumah: "",
  //     biayaListikBulanan: "",
  //   }),
  // );

  const [profilInfo, setProfilInfo] = useState({
    penghuni: 1,
    dayaListrikRumah: "",
    biayaListikBulanan: "",
  });

  useEffect(() => {
    const savedProfilInfo = loadState("profilInfo", null);

    if (savedProfilInfo) {
      setProfilInfo(savedProfilInfo);
    }
  }, []);

  // const [dashboardStats, setDashboardStats] = useState(() =>
  //   loadState("dashboardStats", null),
  // );

  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    setDashboardStats(loadState("dashboardStats", null));
  }, []);

  // const [analysisHistory, setAnalysisHistory] = useState(() =>
  //   loadState("analysisHistory", []),
  // );

  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    setAnalysisHistory(loadState("analysisHistory", []));
  }, []);

  useEffect(() => saveState("devicesData", devicesData), [devicesData]);
  useEffect(() => saveState("profilInfo", profilInfo), [profilInfo]);
  useEffect(() => saveState("analysis", analysis), [analysis]);
  useEffect(() => saveState("challenge", challenge), [challenge]);

  useEffect(
    () => saveState("analysisLoading", analysisLoading),
    [analysisLoading],
  );
  useEffect(
    () => saveState("activeChallenges", activeChallenges),
    [activeChallenges],
  );
  useEffect(
    () => saveState("dashboardStats", dashboardStats),
    [dashboardStats],
  );
  useEffect(
    () => saveState("analysisHistory", analysisHistory),
    [analysisHistory],
  );

  const acceptChallenge = (tantangan) => {
    setActiveChallenges((prev) => {
      const sudahAda = prev.some(
        (c) =>
          (c.tantangan || c.title) === (tantangan.tantangan || tantangan.title),
      );
      if (sudahAda) return prev;
      return [
        ...prev,
        {
          ...tantangan,
          acceptedAt: new Date().toISOString(),
          status: "berlangsung",
        },
      ];
    });
  };

  const runAnalysis = async () => {
    if (devicesData.length === 0) {
      setAnalysisError("Tambahkan minimal satu perangkat dahulu.");
      return;
    }

    setCurrentMenu("dashboard");
    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilInfo, devicesData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error menganalisis data.");
      }

      setAnalysis(data);

      const totalKwh = parseFloat(data.totalKwhPerDay) || 0;
      const biaya = Math.round(totalKwh * 30 * 1.444);
      const rataKwh =
        profilInfo.penghuni > 0 ? totalKwh / profilInfo.penghuni : 0;

      const terakhir =
        analysisHistory[analysisHistory.length - 1]?.totalKwhPerDay;
      const dibanding = terakhir
        ? Math.round(((totalKwh - terakhir) / terakhir) * 100)
        : null;

      setDashboardStats({
        penghuni: profilInfo.penghuni,
        totalKwhPerDay: Math.round(totalKwh * 100) / 100,
        estimasiBiaya: biaya,
        rataPerPenghuni: Math.round(rataKwh * 100) / 100,
        dibandingSebelumnya: dibanding,
      });

      setAnalysisHistory((prev) => [
        ...prev,
        {
          totalKwhPerDay: Math.round(totalKwh * 100) / 100,
          tanggal: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setAnalysisError(error.message || "Error saat menganalisis data.");
      setCurrentMenu("analisis");
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        devicesData,
        setDevicesData,
        analysis,
        setAnalysis,
        analysisLoading,
        setAnalysisLoading,
        analysisError,
        setAnalysisError,
        runAnalysis,
        challenge,
        setChallenge,
        activeChallenges,
        setActiveChallenges,
        acceptChallenge,
        profilInfo,
        setProfilInfo,
        dashboardStats,
        setDashboardStats,
        analysisHistory,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
