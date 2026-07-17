import React, { createContext, useContext, useMemo, useState } from 'react';
import type { HealthIndicator } from '../models/healthIndicator';
import { HealthTrackingService } from '../services/healthTrackingService';

interface HealthContextValue {
  indicators: HealthIndicator[];
  latest: HealthIndicator | null;
  isLoading: boolean;
  addIndicator: (indicator: Omit<HealthIndicator, 'id' | 'timestamp'>) => Promise<void>;
  refresh: () => Promise<void>;
}

const HealthContext = createContext<HealthContextValue | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [indicators, setIndicators] = useState<HealthIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const data = await HealthTrackingService.getAll();
    setIndicators(data);
    setIsLoading(false);
  };

  React.useEffect(() => { load(); }, []);

  const addIndicator = async (indicator: Omit<HealthIndicator, 'id' | 'timestamp'>) => {
    await HealthTrackingService.add(indicator);
    await load();
  };

  const latest = indicators.length > 0 ? indicators[0] : null;

  const value = useMemo(() => ({ indicators, latest, isLoading, addIndicator, refresh: load }), [indicators, isLoading]);

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within a HealthProvider');
  return context;
}
