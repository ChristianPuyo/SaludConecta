import React, { createContext, useContext, useEffect, useState } from 'react';
import { HealthApiService } from '../services/healthApi';

export interface CommunityVisit {
  id: string;
  patientName: string;
  community: string;
  bloodPressure: string;
  glucose: string;
  temperature: string;
  weight: string;
  height: string;
  isPregnant: boolean;
  vaccinesUpToDate: boolean;
  synced: boolean;
}

interface VisitsContextValue {
  visits: CommunityVisit[];
  addVisit: (visit: Omit<CommunityVisit, 'id' | 'synced'>) => void;
  syncAll: () => Promise<void>;
  isSyncing: boolean;
}

const VisitsContext = createContext<VisitsContextValue | undefined>(undefined);

export function VisitsProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<CommunityVisit[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await HealthApiService.getVisits();
        setVisits(data);
      } catch (error) {
        console.error('Error loading visits:', error);
      }
    })();
  }, []);

  const addVisit = (visit: Omit<CommunityVisit, 'id' | 'synced'>) => {
    const newVisit: CommunityVisit = {
      ...visit,
      id: Date.now().toString(),
      synced: false,
    };
    setVisits((prev) => {
      const updated = [newVisit, ...prev];
      HealthApiService.saveVisit(newVisit).catch((err) =>
        console.error('Error saving visit in service:', err)
      );
      return updated;
    });
  };

  const syncAll = async () => {
    setIsSyncing(true);
    try {
      const updatedVisits = await HealthApiService.syncVisits(visits);
      setVisits(updatedVisits);
    } catch (error) {
      console.error('Error syncing visits in service:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <VisitsContext.Provider value={{ visits, addVisit, syncAll, isSyncing }}>
      {children}
    </VisitsContext.Provider>
  );
}

export function useVisits() {
  const context = useContext(VisitsContext);
  if (!context) {
    throw new Error('useVisits must be used within a VisitsProvider');
  }
  return context;
}

