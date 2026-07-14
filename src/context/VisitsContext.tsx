import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VISITS_STORAGE_KEY = '@saludconecta/visits';

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
  addVisit: (visit: Omit<CommunityVisit, 'id' | 'synced'>) => Promise<void>;
  syncAll: () => Promise<void>;
  isSyncing: boolean;
  isLoading: boolean;
}

const VisitsContext = createContext<VisitsContextValue | undefined>(undefined);

export function VisitsProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<CommunityVisit[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar visitas al iniciar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(VISITS_STORAGE_KEY);
        if (stored) {
          setVisits(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error al cargar visitas:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const addVisit = async (visit: Omit<CommunityVisit, 'id' | 'synced'>) => {
    try {
      const newVisit: CommunityVisit = {
        ...visit,
        id: Date.now().toString(),
        synced: false,
      };
      const updated = [newVisit, ...visits];
      setVisits(updated);
      await AsyncStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar visita:', error);
    }
  };

  const syncAll = async () => {
    setIsSyncing(true);
    // Simular latencia de red de 1.2 segundos
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      const updated = visits.map((v) => ({ ...v, synced: true }));
      setVisits(updated);
      await AsyncStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al sincronizar visitas:', error);
    } finally {
      setIsSyncing(false);
    }
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

