"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const UserAnalysisContext = createContext();

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

export function UserAnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(() => loadState("analysis", null));

  useEffect(() => {
    saveState("analysis", analysis);
  }, [analysis]);

  return (
    <UserAnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
      }}
    >
      {children}
    </UserAnalysisContext.Provider>
  );
}
