"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { UserAnalysisContext } from "@/app/context/UserAnalysisContext";

export const DashboardContext = createContext();

function loadState(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Abaikan error localStorage
  }
}

export function DashboardProvider({ children }) {
  const { analysis, setAnalysis } = useContext(UserAnalysisContext);

  const [isInitialized, setIsInitialized] = useState(false);

  const [challenge, setChallenge] = useState(null);

  const [activeChallenges, setActiveChallenges] = useState([]);

  const [currentMenu, setCurrentMenu] = useState("analisis");

  const [devicesData, setDevicesData] = useState([]);

  const [profilInfo, setProfilInfo] = useState({
    penghuni: 1,
    dayaListrikRumah: "",
    biayaListrikBulanan: "",
  });

  const [dashboardStats, setDashboardStats] = useState(null);

  const [analysisHistory, setAnalysisHistory] = useState([]);

  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    const savedChallenge = loadState("challenge", null);

    const savedActiveChallenges = loadState("activeChallenges", []);

    const savedDevices = loadState("devicesData", []);

    const savedProfile = loadState("profilInfo", {
      penghuni: 1,
      dayaListrikRumah: "",
      biayaListrikBulanan: "",
    });

    const savedDashboardStats = loadState("dashboardStats", null);

    const savedAnalysisHistory = loadState("analysisHistory", []);

    const savedAnalysis = loadState("analysis", null);

    setChallenge(savedChallenge);

    setActiveChallenges(savedActiveChallenges);

    setDevicesData(savedDevices);

    setProfilInfo(savedProfile);

    setDashboardStats(savedDashboardStats);

    setAnalysisHistory(savedAnalysisHistory);

    if (savedAnalysis) {
      setCurrentMenu("dashboard");
    } else {
      setCurrentMenu("analisis");
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("devicesData", devicesData);
  }, [devicesData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("profilInfo", profilInfo);
  }, [profilInfo, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysis", analysis);
  }, [analysis, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("challenge", challenge);
  }, [challenge, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("activeChallenges", activeChallenges);
  }, [activeChallenges, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("dashboardStats", dashboardStats);
  }, [dashboardStats, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysisHistory", analysisHistory);
  }, [analysisHistory, isInitialized]);

  const acceptChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    const sudahAda = activeChallenges.some(
      (c) => (c.tantangan || c.title) === nama,
    );

    if (sudahAda) {
      return true;
    }

    const adaYangBerjalan = activeChallenges.some(
      (c) => c.status === "berlangsung",
    );

    if (adaYangBerjalan) {
      return false;
    }

    setActiveChallenges((prev) => [
      ...prev,
      {
        ...tantangan,
        acceptedAt: new Date().toISOString(),
        status: "berlangsung",
      },
    ]);

    return true;
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

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          profilInfo,
          devicesData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error menganalisis data.");
      }

      setAnalysis(data);

      const totalKwh = parseFloat(data.totalKwhPerDay) || 0;

      const biaya = Math.round(totalKwh * 30 * 1444.7);

      const rataKwh =
        profilInfo.penghuni > 0 ? totalKwh / profilInfo.penghuni : 0;

      const terakhir =
        analysisHistory[analysisHistory.length - 1]?.totalKwhPerDay;

      const dibanding =
        terakhir && terakhir > 0
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

          dayaListrik: profilInfo.dayaListrikRumah || "",

          biayaBulanan: biaya,

          perangkat: devicesData.length,

          wastePart: data.wastefulDevices || [],
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
        isInitialized,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
