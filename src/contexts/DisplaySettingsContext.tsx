
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DisplaySettings {
  showAvatars: boolean;
  showAgentPerformance: boolean;
  showCampaignPerformance: boolean;
  // Future settings can be added here
}

interface DisplaySettingsContextProps {
  settings: DisplaySettings;
  setSettings: React.Dispatch<React.SetStateAction<DisplaySettings>>;
}

const DisplaySettingsContext = createContext<DisplaySettingsContextProps | undefined>(undefined);

export const DisplaySettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<DisplaySettings>(() => {
    const defaultSettings = {
      showAvatars: true,
      showAgentPerformance: true,
      showCampaignPerformance: true,
    };
    try {
      const item = window.localStorage.getItem('displaySettings');
      if (item) {
        return { ...defaultSettings, ...JSON.parse(item) };
      }
      return defaultSettings;
    } catch (error) {
      console.error(error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('displaySettings', JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }, [settings]);

  return (
    <DisplaySettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </DisplaySettingsContext.Provider>
  );
};

export const useDisplaySettings = () => {
  const context = useContext(DisplaySettingsContext);
  if (context === undefined) {
    throw new Error('useDisplaySettings must be used within a DisplaySettingsProvider');
  }
  return context;
};
