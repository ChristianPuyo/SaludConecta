import React, { createContext, useContext, useState } from 'react';
import { MOCK_CITIZEN_REPORTS, type SymptomReport } from '../data/mockData';

interface ReportsContextValue {
  reports: SymptomReport[];
  addReport: (report: SymptomReport) => void;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<SymptomReport[]>(MOCK_CITIZEN_REPORTS);

  const addReport = (report: SymptomReport) => {
    setReports((prev) => [report, ...prev]);
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
