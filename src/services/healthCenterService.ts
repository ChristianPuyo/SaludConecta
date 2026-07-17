import type { HealthCenter, HealthCenterType } from '../models/healthCenter';
import { StorageService } from './storage';

const KEY = 'health_centers';

const MOCK_CENTERS: HealthCenter[] = [
  {
    id: 'hc-1',
    name: 'Hospital Regional de Ucayali',
    type: 'hospital',
    address: 'Av. San Martín 123, Pucallpa',
    phone: '(061) 575000',
    hours: '24 horas',
    services: ['Emergencia', 'Pediatría', 'Ginecología', 'Medicina General', 'Cirugía', 'Laboratorio'],
    district: 'Callería',
    community: 'Pucallpa',
    lat: -8.379,
    lng: -74.537,
  },
  {
    id: 'hc-2',
    name: 'Centro de Salud Callería',
    type: 'posta',
    address: 'Jr. Ucayali 456, Callería',
    phone: '(061) 571234',
    hours: 'Lun-Vie 8:00-18:00, Sáb 8:00-12:00',
    services: ['Medicina General', 'Vacunación', 'Control prenatal', 'Planificación familiar'],
    district: 'Callería',
    community: 'Callería',
  },
  {
    id: 'hc-3',
    name: 'Posta Médica Yarinacocha',
    type: 'posta',
    address: 'Av. La Marina s/n, Yarinacocha',
    phone: '(061) 578901',
    hours: 'Lun-Vie 8:00-16:00',
    services: ['Medicina General', 'Vacunación', 'Atención infantil'],
    district: 'Yarinacocha',
    community: 'Yarinacocha',
  },
  {
    id: 'hc-4',
    name: 'Farmacia Universal',
    type: 'farmacia',
    address: 'Jr. Libertad 230, Pucallpa',
    phone: '(061) 572345',
    hours: 'Lun-Sáb 8:00-22:00',
    services: ['Venta de medicamentos', 'Toma de presión', 'Inyectables'],
    district: 'Callería',
    community: 'Pucallpa',
  },
  {
    id: 'hc-5',
    name: 'Centro de Salud Manantay',
    type: 'posta',
    address: 'Av. Bellavista s/n, Manantay',
    phone: '(061) 573456',
    hours: 'Lun-Vie 8:00-17:00',
    services: ['Medicina General', 'Vacunación', 'Control de tuberculosis'],
    district: 'Manantay',
    community: 'Manantay',
  },
  {
    id: 'hc-6',
    name: 'Farmacia Salud Total',
    type: 'farmacia',
    address: 'Jr. Progreso 120, Yarinacocha',
    phone: '(061) 579012',
    hours: 'Lun-Dom 8:00-21:00',
    services: ['Venta de medicamentos', 'Consejería farmacéutica'],
    district: 'Yarinacocha',
    community: 'Yarinacocha',
  },
  {
    id: 'hc-7',
    name: 'Puesto de Salud Nueva Requena',
    type: 'posta',
    address: 'Plaza Principal s/n, Nueva Requena',
    phone: '(061) 574567',
    hours: 'Lun-Vie 8:00-14:00',
    services: ['Medicina General', 'Vacunación', 'Atención materno-infantil'],
    district: 'Nueva Requena',
    community: 'Nueva Requena',
  },
  {
    id: 'hc-8',
    name: 'Hospital Amazónico de Emergencias',
    type: 'hospital',
    address: 'Carretera Federico Basadre Km 5, Pucallpa',
    phone: '(061) 570000',
    hours: '24 horas',
    services: ['Emergencia', 'UCI', 'Cirugía', 'Traumatología', 'Medicina Interna'],
    district: 'Callería',
    community: 'Pucallpa',
  },
];

export const HealthCenterService = {
  async getAll(): Promise<HealthCenter[]> {
    return MOCK_CENTERS;
  },

  async getById(id: string): Promise<HealthCenter | undefined> {
    return MOCK_CENTERS.find((c) => c.id === id);
  },

  async getByType(type: HealthCenterType): Promise<HealthCenter[]> {
    return MOCK_CENTERS.filter((c) => c.type === type);
  },

  async getByDistrict(district: string): Promise<HealthCenter[]> {
    return MOCK_CENTERS.filter((c) => c.district === district);
  },

  async search(query: string): Promise<HealthCenter[]> {
    const q = query.toLowerCase();
    return MOCK_CENTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.services.some((s) => s.toLowerCase().includes(q))
    );
  },
};
