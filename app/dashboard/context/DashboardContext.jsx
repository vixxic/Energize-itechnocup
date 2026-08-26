"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { UserAnalysisContext } from "@/app/context/UserAnalysisContext";

export const DashboardContext = createContext();

// LOCAL STORAGE

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
    // biarin error localStorage
  }
}

export function DashboardProvider({ children }) {
  const { analysis, setAnalysis } = useContext(UserAnalysisContext);

  //  DEFAULT STATE

  const [isInitialized, setIsInitialized] = useState(false);

  const [challenge, setChallenge] = useState(null);

  const [activeChallenges, setActiveChallenges] = useState([]);

  const [completedChallenges, setCompletedChallenges] = useState([]);

  const [badges, setBadges] = useState([]);

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

  //  LOAD DATA FROM LOCAL STORAGE

  useEffect(() => {
    const savedAnalysis = loadState("analysis", null);

    const savedChallenge = loadState("challenge", null);

    const savedActiveChallenges = loadState("activeChallenges", []);

    const savedCompletedChallenges = loadState("completedChallenges", []);

    const savedDevices = loadState("devicesData", []);

    const savedProfile = loadState("profilInfo", {
      penghuni: 1,
      dayaListrikRumah: "",
      biayaListrikBulanan: "",
    });

    const savedDashboardStats = loadState("dashboardStats", null);

    const savedAnalysisHistory = loadState("analysisHistory", []);

    const savedBadges = savedAnalysis?.earnedBadges?.length
      ? savedAnalysis.earnedBadges
      : loadState("badges", []);

    setChallenge(savedChallenge);

    setActiveChallenges(savedActiveChallenges);

    setCompletedChallenges(savedCompletedChallenges);

    setDevicesData(savedDevices);

    setProfilInfo(savedProfile);

    setDashboardStats(savedDashboardStats);

    setAnalysisHistory(savedAnalysisHistory);

    setBadges(savedBadges);

    setCurrentMenu(savedAnalysis ? "dashboard" : "analisis");

    setIsInitialized(true);
  }, []);

  //  SAVE DEVICES

  useEffect(() => {
    if (!isInitialized) return;

    saveState("devicesData", devicesData);
  }, [devicesData, isInitialized]);

  //  SAVE PROFILE

  useEffect(() => {
    if (!isInitialized) return;

    saveState("profilInfo", profilInfo);
  }, [profilInfo, isInitialized]);

  //  SAVE ANALYSIS

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysis", analysis);
  }, [analysis, isInitialized]);

  // SAVE CHALLENGE

  useEffect(() => {
    if (!isInitialized) return;

    saveState("challenge", challenge);
  }, [challenge, isInitialized]);

  //  SAVE ACTIVE CHALLENGES

  useEffect(() => {
    if (!isInitialized) return;

    saveState("activeChallenges", activeChallenges);
  }, [activeChallenges, isInitialized]);

  //  SAVE DASHBOARD STATS

  useEffect(() => {
    if (!isInitialized) return;

    saveState("dashboardStats", dashboardStats);
  }, [dashboardStats, isInitialized]);

  //  SAVE ANALYSIS HISTORY

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysisHistory", analysisHistory);
  }, [analysisHistory, isInitialized]);

  //  SAVE COMPLETED CHALLENGES

  useEffect(() => {
    if (!isInitialized) return;

    saveState("completedChallenges", completedChallenges);
  }, [completedChallenges, isInitialized]);

  //  SAVE BADGES

  useEffect(() => {
    if (!isInitialized) return;

    saveState("badges", badges);
  }, [badges, isInitialized]);

  //  ACCEPT CHALLENGE

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

  //  COMPLETE CHALLENGE

  const completeChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    const completedAt = new Date().toISOString();

    /* Update active challenge */

    setActiveChallenges((prev) =>
      prev.map((c) =>
        (c.tantangan || c.title) === nama
          ? {
              ...c,
              ...tantangan,
              status: "selesai",
              completedAt,
            }
          : c,
      ),
    );

    /* masukin ke completed challenges */

    setCompletedChallenges((prev) => {
      const sudahAda = prev.some((c) => (c.tantangan || c.title) === nama);

      if (sudahAda) {
        return prev;
      }

      return [
        ...prev,
        {
          ...tantangan,
          status: "selesai",
          completedAt,
        },
      ];
    });
  };

  //  RUN AI ANALYSIS

  const runAnalysis = async () => {
    if (devicesData.length === 0) {
      setAnalysisError("Tambahkan minimal satu perangkat.");
      return;
    }

    setCurrentMenu("dashboard");

    setAnalysisLoading(true);

    setAnalysisError("");

    //  HITUNG CO2 - profile

    const hitungCo2 = () => {
      const totals = analysisHistory.map(
        (h) => parseFloat(h.totalKwhPerDay) || 0,
      );

      let simpan = 0;

      for (let i = 1; i < totals.length; i++) {
        const selisih = totals[i - 1] - totals[i];

        if (selisih > 0) {
          simpan += selisih;
        }
      }

      return Math.round(simpan * 0.85 * 10) / 10;
    };

    //  STATISTIK BADGE - profile

    const statistikBadge = {
      tantanganSelesai: completedChallenges.length,

      co2HematKg: hitungCo2(),
    };

    try {
      //  REQUEST AI

      const response = await fetch("/api/analyze", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          profilInfo,
          devicesData,
          statistikBadge,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error menganalisis data.");
      }

      //  SAVE AI ANALYSIS

      setAnalysis(data);

      setBadges(data.earnedBadges || []);

      //  HITUNG DASHBOARD

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

      //  SAVE HISTORY

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

  //  CONTEXT VALUE

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

        completedChallenges,
        setCompletedChallenges,

        completeChallenge,

        badges,
        setBadges,

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
