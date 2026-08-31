"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserAnalysisContext } from "@/app/context/UserAnalysisContext";
import { useSearchParams } from "next/navigation";

export const DashboardContext = createContext();

// ====================
// LOCAL STORAGE
// ====================

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

  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  // ====================
  // DEFAULT STATE
  // ====================

  const [isInitialized, setIsInitialized] = useState(false);

  const [challenge, setChallenge] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const [lencanas, setLencanas] = useState(() => loadState("lencanas", []));

  const [currentMenu, setCurrentMenu] = useState("analisis");

  const [devicesData, setDevicesData] = useState([]);

  const [profilInfo, setProfilInfo] = useState({
    penghuni: 1,
    dayaListrikRumah: "",
    biayaListrikBulanan: "",
    listrikBulanan: "",
  });

  const [dashboardStats, setDashboardStats] = useState(null);

  // Konsumsi listrik terbaru
  const [currentElectric, setCurrentElectric] = useState(null);

  const [analysisHistory, setAnalysisHistory] = useState([]);

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // ====================
  // LOAD DATA
  // ====================

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
    const savedCurrentElectric = loadState("currentElectric", null);
    const savedAnalysisHistory = loadState("analysisHistory", []);

    const savedLencanas = loadState("lencanas", []);

    setChallenge(savedChallenge);
    setActiveChallenges(savedActiveChallenges);
    setCompletedChallenges(savedCompletedChallenges);
    setDevicesData(savedDevices);
    setProfilInfo(savedProfile);
    setDashboardStats(savedDashboardStats);

    setCurrentElectric(
      savedCurrentElectric ?? savedDashboardStats?.totalKwhPerDay ?? null,
    );

    setAnalysisHistory(savedAnalysisHistory);
    setLencanas(savedLencanas);
    // ==========================================
    // TENTUKAN MENU AWAL
    // ==========================================

    const validSections = [
      "dashboard",
      "analisis",
      "tantangan",
      "riwayat",
      "profil",
    ];

    if (validSections.includes(section)) {
      setCurrentMenu(section);
    } else {
      setCurrentMenu(savedAnalysis ? "dashboard" : "analisis");
    }

    setIsInitialized(true);
  }, []);

  // ====================
  // SAVE DATA
  // ====================

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
    saveState("completedChallenges", completedChallenges);
  }, [completedChallenges, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveState("dashboardStats", dashboardStats);
  }, [dashboardStats, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveState("currentElectric", currentElectric);
  }, [currentElectric, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveState("analysisHistory", analysisHistory);
  }, [analysisHistory, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveState("lencanas", lencanas);
  }, [lencanas, isInitialized]);

  // ====================
  // HITUNG PENGHEMATAN DARI ANALISIS
  // ====================

  const hitungPenghematanAnalisis = (history = analysisHistory) => {
    if (!history || history.length < 2) {
      return 0;
    }

    let totalHemat = 0;

    for (let i = 1; i < history.length; i++) {
      const sebelumnya = Number(history[i - 1]?.totalKwhPerDay) || 0;

      const sekarang = Number(history[i]?.totalKwhPerDay) || 0;

      const selisih = sebelumnya - sekarang;

      // Hanya menghitung jika terjadi penurunan
      if (selisih > 0) {
        totalHemat += selisih;
      }
    }

    return Math.round(totalHemat * 100) / 100;
  };

  // ====================
  // HITUNG PENGHEMATAN DARI TANTANGAN
  // ====================

  const hitungPenghematanTantangan = (challenges = completedChallenges) => {
    if (!challenges || challenges.length === 0) {
      return 0;
    }

    let totalHemat = 0;

    challenges.forEach((item) => {
      const sebelum = Number(item?.electricBefore) || 0;
      const sesudah = Number(item?.electricAfter) || 0;

      const selisih = sebelum - sesudah;

      if (selisih > 0) {
        totalHemat += selisih;
      }
    });

    return Math.round(totalHemat * 100) / 100;
  };

  // ====================
  // TOTAL PENGHEMATAN
  // ====================

  const hitungTotalPenghematan = (
    history = analysisHistory,
    challenges = completedChallenges,
  ) => {
    const dariAnalisis = hitungPenghematanAnalisis(history);
    const dariTantangan = hitungPenghematanTantangan(challenges);

    return Math.round((dariAnalisis + dariTantangan) * 100) / 100;
  };

  // ====================
  // HITUNG CO2
  // ====================

  const hitungCO2 = (kwh) => {
    const faktorEmisi = 0.85;

    return Math.round(kwh * faktorEmisi * 100) / 100;
  };

  // ====================
  // HITUNG BIAYA
  // ====================

  const hitungBiayaHemat = (kwh) => {
    const tarifListrik = 1444.7;

    // kWh/hari × 30 hari × tarif
    return Math.round(kwh * 30 * tarifListrik);
  };

  // ====================
  // CEK LENCANA
  // ====================

  const checkLencanas = (
    score = analysis?.energyScore,
    challenges = completedChallenges,
    history = analysisHistory,
  ) => {
    const energyScore = Number(score) || 0;
    const jumlahTantangan = challenges?.length || 0;

    const hitungPersentasePenurunan = (history = analysisHistory) => {
      if (!history || history.length < 2) {
        return 0;
      }

      const sebelumnya =
        Number(history[history.length - 2]?.totalKwhPerMonth) || 0;

      const sekarang =
        Number(history[history.length - 1]?.totalKwhPerMonth) || 0;

      if (sebelumnya <= 0 || sekarang >= sebelumnya) {
        return 0;
      }

      const persentase = ((sebelumnya - sekarang) / sebelumnya) * 100;

      return Math.round(persentase * 100) / 100;
    };

    const persentasePenurunan = hitungPersentasePenurunan(history);

    const lencanaBaru = [];

    if (energyScore >= 60) {
      lencanaBaru.push("Energi Efisien");
    }

    if (jumlahTantangan >= 1) {
      lencanaBaru.push("Mulai Berhemat");
    }

    if (jumlahTantangan >= 2) {
      lencanaBaru.push("Pejuang Energi");
    }

    if (jumlahTantangan >= 3) {
      lencanaBaru.push("Ahli Hemat");
    }

    if (persentasePenurunan >= 10) {
      lencanaBaru.push("Penjaga Energi");
    }

    setLencanas((prev) => {
      const semuaLencana = [...new Set([...prev, ...lencanaBaru])];

      saveState("lencanas", semuaLencana);

      return semuaLencana;
    });
  };

  // ====================
  // ACCEPT CHALLENGE
  // ====================

  const acceptChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    // Jangan menerima challenge yang sama
    const sudahAda = activeChallenges.some(
      (item) => (item.tantangan || item.title) === nama,
    );

    if (sudahAda) {
      return true;
    }

    // Hanya satu challenge yang boleh aktif
    const adaYangBerjalan = activeChallenges.some(
      (item) => item.status === "berlangsung",
    );

    if (adaYangBerjalan) {
      return false;
    }

    // Konsumsi sebelum challenge
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

  // ====================
  // COMPLETE CHALLENGE
  // ====================

  const completeChallenge = (tantangan) => {
    const nama = tantangan.tantangan || tantangan.title;

    const completedAt = new Date().toISOString();

    const electricBefore = Number(tantangan.electricBefore) || 0;

    const electricAfter = Number(tantangan.electricAfter) || 0;

    // Update konsumsi terbaru
    setCurrentElectric(electricAfter);

    // Hapus challenge aktif
    setActiveChallenges((prev) =>
      prev.filter((item) => (item.tantangan || item.title) !== nama),
    );

    // Simpan challenge yang selesai
    setCompletedChallenges((prev) => {
      const sudahAda = prev.some(
        (item) => (item.tantangan || item.title) === nama,
      );

      if (sudahAda) {
        return prev;
      }

      return [
        ...prev,
        {
          ...tantangan,
          status: "selesai",
          completedAt,
          electricBefore,
          electricAfter,
        },
      ];
    });

    // ====================
    // CARI CHALLENGE BERIKUTNYA
    // ====================

    const daftarChallenge = challenge?.challenges || [];

    const namaSelesai = [...completedChallenges, tantangan].map(
      (item) => item.tantangan || item.title,
    );

    const nextChallenge = daftarChallenge.find((item) => {
      const namaChallenge = item.tantangan || item.title;

      return !namaSelesai.includes(namaChallenge);
    });

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
      // Semua challenge sudah selesai
      setActiveChallenges([]);
    }
  };

  // ====================
  // NEXT CHALLENGE
  // ====================

  const goToNextChallenge = () => {
    const daftarChallenge = challenge?.challenges || [];

    const sudahSelesai = completedChallenges.map(
      (item) => item.tantangan || item.title,
    );

    const nextChallenge = daftarChallenge.find((item) => {
      const namaChallenge = item.tantangan || item.title;

      return !sudahSelesai.includes(namaChallenge);
    });

    if (!nextChallenge) {
      setActiveChallenges([]);
      return;
    }

    setActiveChallenges([
      {
        ...nextChallenge,
        acceptedAt: new Date().toISOString(),
        status: "berlangsung",
        electricBefore: currentElectric,
      },
    ]);
  };

  // ====================
  // RUN AI ANALYSIS
  // ====================

  const runAnalysis = async () => {
    if (devicesData.length === 0) {
      setAnalysisError("Tambahkan minimal satu perangkat.");
      return;
    }

    setCurrentMenu("dashboard");
    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      // ====================
      // REQUEST AI
      // ====================

      const response = await fetch("/api/analyze", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          profilInfo,
          devicesData,

          // Statistik sebelum analisis terbaru
          statistiklencana: {
            tantanganSelesai: completedChallenges.length,
            co2HematKg: hitungCO2(
              hitungTotalPenghematan(analysisHistory, completedChallenges),
            ),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error menganalisis data.");
      }

      // ====================
      // DATA ANALISIS BARU
      // ====================

      const totalKwhPerDay = parseFloat(data.totalKwhPerDay) || 0;

      const totalKwhPerMonth = totalKwhPerDay * 30;

      const biayaEstimasi = Math.round(totalKwhPerMonth * 1444.7);

      const rataKwhPerPenghuni =
        profilInfo.penghuni > 0 ? totalKwhPerDay / profilInfo.penghuni : 0;

      // ====================
      // BANDINGKAN DENGAN ANALISIS SEBELUMNYA
      // ====================

      const terakhir =
        analysisHistory.length > 0
          ? Number(
              analysisHistory[analysisHistory.length - 1]?.totalKwhPerDay,
            ) || 0
          : 0;

      const dibanding =
        terakhir > 0
          ? Math.round(((totalKwhPerDay - terakhir) / terakhir) * 100)
          : null;

      // ====================
      // SIMPAN HISTORY BARU
      // ====================

      const newHistoryItem = {
        totalKwhPerDay: Math.round(totalKwhPerDay * 100) / 100,

        totalKwhPerMonth: Math.round(totalKwhPerMonth * 100) / 100,

        tanggal: new Date().toISOString(),

        dayaListrik: profilInfo.dayaListrikRumah || "",

        biayaBulanan: biayaEstimasi,

        perangkat: devicesData.length,

        wastePart: data.wastefulDevices || [],
      };

      const newAnalysisHistory = [...analysisHistory, newHistoryItem];

      // ====================
      // DASHBOARD STATS
      // ====================

      const newDashboardStats = {
        penghuni: profilInfo.penghuni,

        totalKwhPerMonth: Math.round(totalKwhPerMonth * 100) / 100,

        totalKwhPerDay: Math.round(totalKwhPerDay * 100) / 100,

        estimasiBiaya: biayaEstimasi,

        rataPerPenghuni: Math.round(rataKwhPerPenghuni * 100) / 100,

        dibandingSebelumnya: dibanding,
      };

      // ====================
      // UPDATE STATE
      // ====================

      setAnalysis(data);

      setDashboardStats(newDashboardStats);

      setCurrentElectric(newDashboardStats.totalKwhPerDay);

      setAnalysisHistory(newAnalysisHistory);
    } catch (error) {
      setAnalysisError(error.message || "Error saat menganalisis data.");

      setCurrentMenu("analisis");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ====================
  // CEK LENCANA SETIAP DATA BERUBAH
  // ====================

  useEffect(() => {
    if (!isInitialized) return;

    checkLencanas();
  }, [analysis, completedChallenges, analysisHistory, isInitialized]);

  // ====================
  // CONTEXT VALUE
  // ====================

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
        goToNextChallenge,

        lencanas,
        setLencanas,

        profilInfo,
        setProfilInfo,

        dashboardStats,
        setDashboardStats,

        currentElectric,
        setCurrentElectric,

        analysisHistory,

        hitungPenghematanAnalisis,
        hitungPenghematanTantangan,
        hitungTotalPenghematan,
        hitungCO2,
        hitungBiayaHemat,

        isInitialized,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
