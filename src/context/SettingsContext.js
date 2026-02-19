"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getStrapiApiUrl } from "@/utils/strapi";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async (retries = 3, delay = 2000) => {
      try {
        const apiUrl = `${getStrapiApiUrl()}/api/setting?populate=*`;
        console.log(`Fetching settings from: ${apiUrl} (Attempts remaining: ${retries})`);

        const res = await fetch(apiUrl);

        if (!res.ok) {
          console.warn(`Settings API returned status: ${res.status}. Check your Strapi permissions or content state.`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const settingsData = data?.data?.attributes || data?.data || null;

        if (!settingsData && retries > 0) {
          console.log("No data content; retrying...");
          setTimeout(() => fetchSettings(retries - 1, delay), delay);
          return;
        }

        setSettings(settingsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        if (retries > 0) {
          console.log(`Retrying in ${delay}ms...`);
          setTimeout(() => fetchSettings(retries - 1, delay), delay);
        } else {
          setLoading(false);
        }
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