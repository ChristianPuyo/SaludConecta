import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MOCK_CITIZEN_REPORTS,
  MOCK_ALERTS,
  MOCK_DISTRICT_RISK,
  type SymptomReport,
  type EpidemicAlert,
  type DistrictRisk,
} from '../data/mockData';
import type { CommunityVisit } from '../context/VisitsContext';

// Configuración general de la API
export const API_CONFIG = {
  // Cambia a false para conectar a tu Base de Datos / Servidor real en el futuro
  USE_MOCK: true,
  BASE_URL: 'https://api.saludconecta.org/v1',
  DEV_URL: 'http://10.0.2.2:5000/api', // IP local estándar para el emulador
};

const REPORTS_KEY = '@saludconecta/reports';
const VISITS_KEY = '@saludconecta/visits';

export const HealthApiService = {
  // --- REPORTES CIUDADANOS ---
  async getReports(): Promise<SymptomReport[]> {
    if (API_CONFIG.USE_MOCK) {
      const stored = await AsyncStorage.getItem(REPORTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Inicialización con mocks por primera vez
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(MOCK_CITIZEN_REPORTS));
      return MOCK_CITIZEN_REPORTS;
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/reports`);
    if (!response.ok) throw new Error('Error al obtener reportes');
    return response.json();
  },

  async saveReport(report: SymptomReport): Promise<SymptomReport> {
    if (API_CONFIG.USE_MOCK) {
      const current = await this.getReports();
      const updated = [report, ...current];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
      return report;
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!response.ok) throw new Error('Error al guardar reporte');
    return response.json();
  },

  // --- VISITAS DE AGENTES ---
  async getVisits(): Promise<CommunityVisit[]> {
    if (API_CONFIG.USE_MOCK) {
      const stored = await AsyncStorage.getItem(VISITS_KEY);
      return stored ? JSON.parse(stored) : [];
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/visits`);
    if (!response.ok) throw new Error('Error al obtener visitas');
    return response.json();
  },

  async saveVisit(visit: CommunityVisit): Promise<CommunityVisit> {
    if (API_CONFIG.USE_MOCK) {
      const current = await this.getVisits();
      const updated = [visit, ...current];
      await AsyncStorage.setItem(VISITS_KEY, JSON.stringify(updated));
      return visit;
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visit),
    });
    if (!response.ok) throw new Error('Error al guardar visita');
    return response.json();
  },

  async syncVisits(visits: CommunityVisit[]): Promise<CommunityVisit[]> {
    if (API_CONFIG.USE_MOCK) {
      // Simulación offline a online
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const updated = visits.map((v) => ({ ...v, synced: true }));
      await AsyncStorage.setItem(VISITS_KEY, JSON.stringify(updated));
      return updated;
    }

    // Código futuro para conectar a Base de Datos real (envío en lote):
    const pending = visits.filter((v) => !v.synced);
    const response = await fetch(`${API_CONFIG.DEV_URL}/visits/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visits: pending }),
    });
    if (!response.ok) throw new Error('Error al sincronizar visitas');

    const synced = visits.map((v) => ({ ...v, synced: true }));
    await AsyncStorage.setItem(VISITS_KEY, JSON.stringify(synced));
    return synced;
  },

  // --- ANALÍTICA / ALERTAS ---
  async getAlerts(): Promise<EpidemicAlert[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_ALERTS;
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/alerts`);
    if (!response.ok) throw new Error('Error al obtener alertas');
    return response.json();
  },

  async getDistrictRisks(): Promise<DistrictRisk[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_DISTRICT_RISK;
    }

    // Código futuro para conectar a Base de Datos real:
    const response = await fetch(`${API_CONFIG.DEV_URL}/district-risks`);
    if (!response.ok) throw new Error('Error al obtener riesgos de distritos');
    return response.json();
  },
};
