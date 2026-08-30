"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { UserAnalysisContext } from "@/app/context/UserAnalysisContext";

export const DashboardContext = createContext();

// =========================
// LOCAL STORAGE
// =========================

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

  // =========================
  // DEFAULT STATE
  // =========================

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
    listrikBulanan: "",
  });

  const [dashboardStats, setDashboardStats] = useState(null);

  const [currentElectric, setCurrentElectric] = useState(0);

  const [analysisHistory, setAnalysisHistory] = useState([]);

  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

  // =========================
  // LOAD DATA FROM LOCAL STORAGE
  // =========================

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
      listrikBulanan: "",
    });

    const savedDashboardStats = loadState("dashboardStats", null);

    const savedCurrentElectric = loadState("currentElectric", 0);

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

    setCurrentElectric(savedCurrentElectric);

    setAnalysisHistory(savedAnalysisHistory);

    setBadges(savedBadges);

    setCurrentMenu(savedAnalysis ? "dashboard" : "analisis");

    setIsInitialized(true);
  }, []);

  // =========================
  // SAVE DEVICES
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("devicesData", devicesData);
  }, [devicesData, isInitialized]);

  // =========================
  // SAVE PROFILE
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("profilInfo", profilInfo);
  }, [profilInfo, isInitialized]);

  // =========================
  // SAVE ANALYSIS
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysis", analysis);
  }, [analysis, isInitialized]);

  // =========================
  // SAVE CHALLENGE
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("challenge", challenge);
  }, [challenge, isInitialized]);

  // =========================
  // SAVE ACTIVE CHALLENGES
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("activeChallenges", activeChallenges);
  }, [activeChallenges, isInitialized]);

  // =========================
  // SAVE DASHBOARD STATS
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("dashboardStats", dashboardStats);
  }, [dashboardStats, isInitialized]);

  // =========================
  // SAVE CURRENT ELECTRIC
  // =========================

  useEffect(() => {
    if (!isInitialized) return;
    saveState("currentElectric", currentElectric);
  }, [currentElectric, isInitialized]);

  // =========================
  // SAVE ANALYSIS HISTORY
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("analysisHistory", analysisHistory);
  }, [analysisHistory, isInitialized]);

  // =========================
  // SAVE COMPLETED CHALLENGES
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("completedChallenges", completedChallenges);
  }, [completedChallenges, isInitialized]);

  // =========================
  // SAVE BADGES
  // =========================

  useEffect(() => {
    if (!isInitialized) return;

    saveState("badges", badges);
  }, [badges, isInitialized]);

  // =========================
  // ACCEPT CHALLENGE
  // =========================

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

    const electricBefore =
      Number(currentElectric) || Number(dashboardStats?.totalKwhPerDay) || 0;

    setActiveChallenges((prev) => [
      ...prev,
      {
        ...tantangan,
        acceptedAt: new Date().toISOString(),
        status: "berlangsung",
        electricBefore,
      },
    ]);

    return true;
  };

  // =========================
  // COMPLETE CHALLENGE
  // =========================

  const completeChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;
    const completedAt = new Date().toISOString();

    // Nilai setelah tantangan menjadi konsumsi terbaru
    const electricAfter = Number(tantangan.electricAfter) || 0;

    // Simpan konsumsi terbaru
    setCurrentElectric(electricAfter);

    // Simpan challenge yang selesai
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

    // Cari challenge berikutnya
    const daftarChallenge = challenge?.challenges || [];

    const sudahSelesai = [...completedChallenges, tantangan].map(
      (c) => c.tantangan || c.title,
    );

    const nextChallenge = daftarChallenge.find((c) => {
      const namaChallenge = c.tantangan || c.title;

      return !sudahSelesai.includes(namaChallenge);
    });

    // Ganti challenge aktif dengan challenge berikutnya
    if (nextChallenge) {
      setActiveChallenges([
        {
          ...nextChallenge,
          acceptedAt: new Date().toISOString(),
          status: "berlangsung",
          electricBefore: electricAfter,
        },
      ]);
    } else {
      // Kalau sudah tidak ada challenge lagi
      setActiveChallenges([]);
    }
  };

  // =========================
  // RUN AI ANALYSIS
  // =========================

  const runAnalysis = async () => {
    if (devicesData.length === 0) {
      setAnalysisError("Tambahkan minimal satu perangkat.");

      return;
    }

    setCurrentMenu("dashboard");

    setAnalysisLoading(true);

    setAnalysisError("");

    // ==========================================
    // HITUNG CO2
    // ==========================================

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

    // ==========================================
    // STATISTIK BADGE
    // ==========================================

    const statistikBadge = {
      tantanganSelesai: completedChallenges.length,

      co2HematKg: hitungCo2(),
    };

    try {
      // ==========================================
      // REQUEST AI
      // ==========================================

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

      // ==========================================
      // SAVE AI ANALYSIS
      // ==========================================

      setAnalysis(data);

      setBadges(data.earnedBadges || []);

      // ==========================================
      // HITUNG DASHBOARD
      // ==========================================

      // Konsumsi per hari
      const totalKwhPerDay = parseFloat(data.totalKwhPerDay) || 0;

      // Estimasi konsumsi 30 hari
      const totalKwhPerMonth = totalKwhPerDay * 30;

      // Biaya listrik bulanan
      const biayaEstimasi = Math.round(totalKwhPerMonth * 1444.7);

      // Rata-rata konsumsi per penghuni
      const rataKwhPerPenghuni =
        profilInfo.penghuni > 0 ? totalKwhPerDay / profilInfo.penghuni : 0;

      // ==========================================
      // DATA ANALISIS SEBELUMNYA
      // ==========================================

      const terakhir =
        analysisHistory[analysisHistory.length - 1]?.totalKwhPerDay;

      const dibanding =
        terakhir && Number(terakhir) > 0
          ? Math.round(
              ((totalKwhPerDay - Number(terakhir)) / Number(terakhir)) * 100,
            )
          : null;

      // ==========================================
      // SAVE DASHBOARD STATS
      // ==========================================

      setDashboardStats({
        penghuni: profilInfo.penghuni,

        // Total konsumsi bulanan
        totalKwhPerMonth: Math.round(totalKwhPerMonth * 100) / 100,

        // Konsumsi per hari
        totalKwhPerDay: Math.round(totalKwhPerDay * 100) / 100,

        // Biaya bulanan
        estimasiBiaya: biayaEstimasi,

        // Rata-rata per penghuni
        rataPerPenghuni: Math.round(rataKwhPerPenghuni * 100) / 100,

        // Perbandingan analisis sebelumnya
        dibandingSebelumnya: dibanding,
      });

      // ==========================================
      // SAVE HISTORY
      // ==========================================

      setAnalysisHistory((prev) => [
        ...prev,

        {
          totalKwhPerDay: Math.round(totalKwhPerDay * 100) / 100,

          totalKwhPerMonth: Math.round(totalKwhPerMonth * 100) / 100,

          tanggal: new Date().toISOString(),

          dayaListrik: profilInfo.dayaListrikRumah || "",

          biayaBulanan: biayaEstimasi,

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

  // =========================
  // CONTEXT VALUE
  // =========================

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

        currentElectric,
        setCurrentElectric,

        analysisHistory,

        isInitialized,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
