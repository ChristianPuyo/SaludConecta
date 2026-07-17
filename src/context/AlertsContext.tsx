import React, { createContext, useContext, useState } from 'react';
import { MOCK_ALERTS, type EpidemicAlert } from '../data/mockData';

export type EmergencyLevel = 'alerta' | 'emergencia' | 'crisis';

interface AlertsContextValue {
  alerts: EpidemicAlert[];
  addAlert: (alert: Omit<EpidemicAlert, 'id'>) => void;
  declareEmergency: (district: string, level: EmergencyLevel, description: string) => void;
}

const LABEL_MAP: Record<EmergencyLevel, string> = {
  alerta: 'Alerta sanitaria',
  emergencia: 'Emergencia declarada',
  crisis: 'CRISIS SANITARIA',
};

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<EpidemicAlert[]>(MOCK_ALERTS);

  const addAlert = (alert: Omit<EpidemicAlert, 'id'>) => {
    setAlerts((prev) => [
      { id: Date.now().toString(), ...alert },
      ...prev,
    ]);
  };

  const declareEmergency = (district: string, level: EmergencyLevel, description: string) => {
    const risk = level === 'crisis' ? 'alto' : level === 'emergencia' ? 'alto' : 'medio';
    setAlerts((prev) => [
      {
        id: Date.now().toString(),
        title: LABEL_MAP[level],
        district,
        detail: description,
        risk: risk as 'alto' | 'medio' | 'bajo',
        date: 'Ahora',
      },
      ...prev,
    ]);
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, declareEmergency }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}
