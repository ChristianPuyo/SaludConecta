import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_CITIZEN_REPORTS, type SymptomReport } from '../data/mockData';

const REPORTS_STORAGE_KEY = '@saludconecta/reports';

interface ReportsContextValue {
  reports: SymptomReport[];
  addReport: (report: SymptomReport) => Promise<void>;
  isLoading: boolean;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar reportes locales al iniciar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
        if (stored) {
          setReports(JSON.parse(stored));
        } else {
          // Pre-poblar con datos de prueba la primera vez
          await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(MOCK_CITIZEN_REPORTS));
          setReports(MOCK_CITIZEN_REPORTS);
        }
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const addReport = async (report: SymptomReport) => {
    try {
      const updated = [report, ...reports];
      setReports(updated);
      await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar reporte:', error);
    }
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

