import React, { createContext, useContext, useState, useEffect } from 'react';
import { isDemoModeActive, subscribeDataMode, setDemoModeActive } from '../api/services';

export type DataMode = 'live' | 'demo';

export interface DataModeContextType {
  isDemoMode: boolean;
  dataMode: DataMode;
  setIsDemoMode: (isDemo: boolean) => void;
}

const DataModeContext = createContext<DataModeContextType | null>(null);

export const DataModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(isDemoModeActive());

  useEffect(() => {
    setIsDemoModeState(isDemoModeActive());
    return subscribeDataMode(setIsDemoModeState);
  }, []);

  const setIsDemoMode = (isDemo: boolean) => {
    setIsDemoModeState(isDemo);
    setDemoModeActive(isDemo);
  };

  const effectiveDemoMode = isDemoMode || isDemoModeActive();

  return (
    <DataModeContext.Provider
      value={{
        isDemoMode: effectiveDemoMode,
        dataMode: effectiveDemoMode ? 'demo' : 'live',
        setIsDemoMode,
      }}
    >
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = (): DataModeContextType => {
  const context = useContext(DataModeContext);
  if (context) {
    return context;
  }
  // Graceful fallback for components tested without DataModeProvider wrapper
  return {
    isDemoMode: isDemoModeActive(),
    dataMode: isDemoModeActive() ? 'demo' : 'live',
    setIsDemoMode: setDemoModeActive,
  };
};
