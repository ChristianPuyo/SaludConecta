import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_CITIZEN_REPORTS, type SymptomReport } from '../data/mockData';

const REPORTS_STORAGE_KEY = '@saludconecta/reports';

interface ReportsContextValue {
  reports: SymptomReport[];
  addReport: (report: SymptomReport) => void;
  isLoading: boolean;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedReports = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
        if (storedReports) {
          setReports(JSON.parse(storedReports));
        } else {
          // Initialize with mock data if storage is empty
          setReports(MOCK_CITIZEN_REPORTS);
          await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(MOCK_CITIZEN_REPORTS));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const addReport = (report: SymptomReport) => {
    setReports((prev) => {
      const updated = [report, ...prev];
      AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error('Error saving report:', err)
      );
      return updated;
    });
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, isLoading }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
