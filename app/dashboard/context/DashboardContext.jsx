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
  const [analysis, setAnalysis] = useState(() => loadState("analysis", null));
  const [challenge, setChallenge] = useState(() => loadState("challenge", null));
  const [activeChallenges, setActiveChallenges] = useState(() =>
    loadState("activeChallenges", []),
  );

  const [currentMenu, setCurrentMenu] = useState("dashboard");
  const [devicesData, setDevicesData] = useState(() =>
    loadState("devicesData", []),
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [profilInfo, setProfilInfo] = useState(() =>
    loadState("profilInfo", {
      penghuni: 1,
      dayaListrikRumah: "",
      biayaListikBulanan: "",
    }),
  );

  useEffect(() => saveState("devicesData", devicesData), [devicesData]);
  useEffect(() => saveState("profilInfo", profilInfo), [profilInfo]);
  useEffect(() => saveState("analysis", analysis), [analysis]);
  useEffect(() => saveState("challenge", challenge), [challenge]);
  useEffect(() => saveState("analysisLoading", analysisLoading), [
    analysisLoading,
  ]);
  useEffect(() => saveState("activeChallenges", activeChallenges), [
    activeChallenges,
  ]);

  const acceptChallenge = (tantangan) => {
    setActiveChallenges((prev) => {
      const sudahAda = prev.some(
        (c) => (c.tantangan || c.title) === (tantangan.tantangan || tantangan.title),
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
      setCurrentMenu("dashboard");
    } catch (error) {
      setAnalysisError(error.message || "Error saat menganalisis data.");
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
