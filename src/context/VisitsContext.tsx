import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CommunityVisit {
  id: string;
  patientName: string;
  community: string;
  bloodPressure: string;
  glucose: string;
  temperature: string;
  weight: string;
  height: string;
  synced: boolean;
}

interface VisitsContextValue {
  visits: CommunityVisit[];
  addVisit: (visit: Omit<CommunityVisit, 'id' | 'synced'>) => void;
  syncAll: () => Promise<void>;
  isSyncing: boolean;
  isLoading: boolean;
}

const VISITS_STORAGE_KEY = '@saludconecta/visits';

const VisitsContext = createContext<VisitsContextValue | undefined>(undefined);

export function VisitsProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<CommunityVisit[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedVisits = await AsyncStorage.getItem(VISITS_STORAGE_KEY);
        if (storedVisits) {
          setVisits(JSON.parse(storedVisits));
        }
      } catch (error) {
        console.error('Error loading visits:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const addVisit = (visit: Omit<CommunityVisit, 'id' | 'synced'>) => {
    setVisits((prev) => {
      const updated = [{ ...visit, id: Date.now().toString(), synced: false }, ...prev];
      AsyncStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error('Error saving visit:', err)
      );
      return updated;
    });
  };

  const syncAll = async () => {
    setIsSyncing(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setVisits((prev) => {
      const updated = prev.map((v) => ({ ...v, synced: true }));
      AsyncStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error('Error saving synced visits:', err)
      );
      return updated;
    });
    setIsSyncing(false);
  };

  return (
    <VisitsContext.Provider value={{ visits, addVisit, syncAll, isSyncing, isLoading }}>
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
