"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/setting?populate=*`;
        console.log("Fetching settings from:", apiUrl);

        const res = await fetch(apiUrl);
        console.log("Response status:", res.status);

        const data = await res.json();
        console.log("Settings API Response:", data);

        const settingsData = data?.data?.attributes || data?.data || null;
        console.log("Extracted settings:", settingsData);

        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};