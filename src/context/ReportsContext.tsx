import React, { createContext, useContext, useEffect, useState } from 'react';
import { HealthApiService } from '../services/healthApi';
import type { SymptomReport } from '../data/mockData';

interface ReportsContextValue {
  reports: SymptomReport[];
  addReport: (report: SymptomReport) => void;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<SymptomReport[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await HealthApiService.getReports();
        setReports(data);
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    })();
  }, []);

  const addReport = (report: SymptomReport) => {
    setReports((prev) => {
      const updated = [report, ...prev];
      HealthApiService.saveReport(report).catch((err) =>
        console.error('Error saving report in service:', err)
      );
      return updated;
    });
  };

  return <ReportsContext.Provider value={{ reports, addReport }}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}

