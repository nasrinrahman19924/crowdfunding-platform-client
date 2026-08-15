"use client";

import { createContext, useContext } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ profile, setProfile, children }) {
  return (
    <DashboardContext.Provider value={{ profile, setProfile }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }

  return context;
}
