import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_CITIZEN_REPORTS, MOCK_DISTRICT_RISK, type SymptomReport, type DistrictRisk } from '../data/mockData';
import type { RiskLevel } from '../components/RiskBadge';

const REPORTS_STORAGE_KEY = '@saludconecta/reports';

interface ReportsContextValue {
  reports: SymptomReport[];
  districtRisks: DistrictRisk[];
  addReport: (report: SymptomReport) => Promise<void>;
  isLoading: boolean;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
        if (stored) {
          setReports(JSON.parse(stored));
        } else {
          setReports(MOCK_CITIZEN_REPORTS);
          await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(MOCK_CITIZEN_REPORTS));
        }
      } catch (error) {
        console.error('Error loading reports', error);
        setReports(MOCK_CITIZEN_REPORTS);
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
      console.error('Error saving report', error);
    }
  };

  const districtRisks = useMemo(() => {
    const baseRisks = MOCK_DISTRICT_RISK.map((r) => ({ ...r }));

    // Count reports per district and find the highest risk level
    const reportsByDistrict = reports.reduce((acc, r) => {
      if (!acc[r.district]) {
        acc[r.district] = { count: 0, highestRisk: 'bajo' as RiskLevel };
      }
      acc[r.district].count += 1;

      const riskOrder: Record<RiskLevel, number> = { alto: 3, medio: 2, bajo: 1 };
      const currentHighest = acc[r.district].highestRisk;
      if (riskOrder[r.risk] > riskOrder[currentHighest]) {
        acc[r.district].highestRisk = r.risk;
      }
      return acc;
    }, {} as Record<string, { count: number; highestRisk: RiskLevel }>);

    // Count baseline mock reports per district to avoid double counting
    const baselineReportsByDistrict = MOCK_CITIZEN_REPORTS.reduce((acc, r) => {
      acc[r.district] = (acc[r.district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return baseRisks.map((d) => {
      const current = reportsByDistrict[d.district] || { count: 0, highestRisk: 'bajo' };
      const baseCount = baselineReportsByDistrict[d.district] || 0;
      const addedCases = Math.max(0, current.count - baseCount);

      const updatedCases = d.cases + addedCases;

      const riskOrder: Record<RiskLevel, number> = { alto: 3, medio: 2, bajo: 1 };
      let updatedRisk = d.risk;
      if (riskOrder[current.highestRisk] > riskOrder[d.risk]) {
        updatedRisk = current.highestRisk;
      }

      return {
        ...d,
        cases: updatedCases,
        risk: updatedRisk,
      };
    });
  }, [reports]);

  const value = useMemo(
    () => ({ reports, districtRisks, addReport, isLoading }),
    [reports, districtRisks, isLoading]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}


export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}

