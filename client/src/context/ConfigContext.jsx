import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings } from '../api';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'DIVA HAUS',
    siteDescription: 'Luxury Boutique E-Commerce',
    enableRegistration: true,
    maintenanceMode: false,
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <ConfigContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
