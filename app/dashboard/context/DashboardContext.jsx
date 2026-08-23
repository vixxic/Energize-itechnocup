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

  const initialSavedAnalysis = loadState("analysis", null);

  const initialChallenge = loadState("challenge", null);
  const initialActiveChallenges = loadState("activeChallenges", []);
  const initialDevices = loadState("devicesData", []);
  const initialProfile = loadState("profilInfo", {
    penghuni: 1,
    dayaListrikRumah: "",
    biayaListrikBulanan: "",
  });
  const initialDashboardStats = loadState("dashboardStats", null);
  const initialAnalysisHistory = loadState("analysisHistory", []);
  const initialCompletedChallenges = loadState("completedChallenges", []);
  const initialBadges = initialSavedAnalysis?.earnedBadges?.length
    ? initialSavedAnalysis.earnedBadges
    : loadState("badges", []);

  const [isInitialized, setIsInitialized] = useState(true);

  const [challenge, setChallenge] = useState(initialChallenge);

  const [activeChallenges, setActiveChallenges] = useState(initialActiveChallenges);

  const [completedChallenges, setCompletedChallenges] = useState(initialCompletedChallenges);

  const [badges, setBadges] = useState(initialBadges);

  const [currentMenu, setCurrentMenu] = useState(initialSavedAnalysis ? "dashboard" : "analisis");

  const [devicesData, setDevicesData] = useState(initialDevices);

  const [profilInfo, setProfilInfo] = useState(initialProfile);

  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);

  const [analysisHistory, setAnalysisHistory] = useState(initialAnalysisHistory);

  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

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

  useEffect(() => {
    if (!isInitialized) return;

    saveState("completedChallenges", completedChallenges);
  }, [completedChallenges, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveState("badges", badges);
  }, [badges, isInitialized]);

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

  const completeChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    setActiveChallenges((prev) =>
      prev.map((c) =>
        (c.tantangan || c.title) === nama
          ? { ...c, status: "selesai", completedAt: new Date().toISOString() }
          : c,
      ),
    );

    setCompletedChallenges((prev) => {
      const sudahAda = prev.some((c) => (c.tantangan || c.title) === nama);
      if (sudahAda) return prev;

      return [
        ...prev,
        {
          ...tantangan,
          status: "selesai",
          completedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const runAnalysis = async () => {
    if (devicesData.length === 0) {
      setAnalysisError("Tambahkan minimal satu perangkat.");
      return;
    }

    setCurrentMenu("dashboard");

    setAnalysisLoading(true);
    setAnalysisError("");

    const hitungStreak = () => {
      const unik = [
        ...new Set(
          analysisHistory
            .map((h) => {
              const d = new Date(h.tanggal);
              d.setHours(0, 0, 0, 0);
              return d.getTime();
            })
            .filter((t) => !Number.isNaN(t)),
        ),
      ].sort((a, b) => b - a);

      if (!unik.length) return 0;

      let streak = 1;
      const sehari = 24 * 60 * 60 * 1000;
      for (let i = 1; i < unik.length; i++) {
        if (unik[i - 1] - unik[i] === sehari) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    };

    const hitungCo2 = () => {
      const totals = analysisHistory.map(
        (h) => parseFloat(h.totalKwhPerDay) || 0,
      );
      let simpan = 0;
      for (let i = 1; i < totals.length; i++) {
        const selisih = totals[i - 1] - totals[i];
        if (selisih > 0) simpan += selisih;
      }
      return Math.round(simpan * 0.85 * 10) / 10;
    };

    const statistikBadge = {
      tantanganSelesai: completedChallenges.length,
      streakHari: hitungStreak(),
      co2HematKg: hitungCo2(),
    };

    try {
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

      setAnalysis(data);

      setBadges(data.earnedBadges || []);

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
