import React, { createContext, useContext, useState } from 'react';
import type { CommunityVisit } from '../models/visit';

interface VisitsContextValue {
  visits: CommunityVisit[];
  addVisit: (visit: Omit<CommunityVisit, 'id' | 'synced' | 'createdAt' | 'visitDate'>) => void;
  syncAll: () => Promise<void>;
  isSyncing: boolean;
}

const VisitsContext = createContext<VisitsContextValue | undefined>(undefined);

export function VisitsProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<CommunityVisit[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addVisit = (visit: Omit<CommunityVisit, 'id' | 'synced' | 'createdAt' | 'visitDate'>) => {
    const now = new Date().toISOString();
    const newVisit: CommunityVisit = {
      ...visit,
      id: Date.now().toString(),
      synced: false,
      createdAt: now,
      visitDate: now,
    };
    setVisits((prev) => [newVisit, ...prev]);
  };

  const syncAll = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setVisits((prev) => prev.map((v) => ({ ...v, synced: true })));
    setIsSyncing(false);
  };

  return (
    <VisitsContext.Provider value={{ visits, addVisit, syncAll, isSyncing }}>
      {children}
    </VisitsContext.Provider>
  );
}

export function useVisits() {
  const context = useContext(VisitsContext);
  if (!context) throw new Error('useVisits must be used within a VisitsProvider');
  return context;
}
