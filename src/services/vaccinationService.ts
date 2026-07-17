import type { Vaccination } from '../models/vaccination';
import { StorageService } from './storage';

const KEY = 'vaccinations';

const DEFAULT_VACCINES: Vaccination[] = [
  {
    id: 'v-default-1',
    name: 'BCG (Tuberculosis)',
    date: '',
    nextDose: 'Al nacer',
    status: 'pendiente',
    reminder: true,
    notes: 'Vacuna para recién nacidos',
  },
  {
    id: 'v-default-2',
    name: 'Hepatitis B',
    date: '',
    nextDose: 'Al nacer',
    status: 'pendiente',
    reminder: true,
    notes: 'Primera dosis al nacer',
  },
  {
    id: 'v-default-3',
    name: 'Pentavalente',
    date: '',
    nextDose: '2 meses',
    status: 'pendiente',
    reminder: true,
    notes: 'Protege contra 5 enfermedades',
  },
  {
    id: 'v-default-4',
    name: 'Polio',
    date: '',
    nextDose: '2 meses',
    status: 'pendiente',
    reminder: true,
    notes: 'Vacuna oral contra la poliomielitis',
  },
  {
    id: 'v-default-5',
    name: 'SRP (Sarampión, Rubéola, Paperas)',
    date: '',
    nextDose: '12 meses',
    status: 'pendiente',
    reminder: true,
    notes: 'Primera dosis al año',
  },
  {
    id: 'v-default-6',
    name: 'Influenza',
    date: '',
    nextDose: 'Anual',
    status: 'pendiente',
    reminder: true,
    notes: 'Vacuna contra la gripe',
  },
  {
    id: 'v-default-7',
    name: 'COVID-19',
    date: '',
    nextDose: 'Refuerzo anual',
    status: 'pendiente',
    reminder: true,
    notes: 'Esquema completo + refuerzos',
  },
  {
    id: 'v-default-8',
    name: 'Tétanos',
    date: '',
    nextDose: 'Cada 10 años',
    status: 'pendiente',
    reminder: true,
    notes: 'Refuerzo decenal',
  },
];

export const VaccinationService = {
  async getAll(): Promise<Vaccination[]> {
    const stored = await StorageService.get<Vaccination[]>(KEY);
    return stored ?? DEFAULT_VACCINES;
  },

  async save(vaccinations: Vaccination[]): Promise<void> {
    await StorageService.set(KEY, vaccinations);
  },

  async update(vaccination: Vaccination): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((v) => v.id === vaccination.id);
    if (idx !== -1) {
      all[idx] = vaccination;
    } else {
      all.push(vaccination);
    }
    await this.save(all);
  },

  async getPending(): Promise<Vaccination[]> {
    const all = await this.getAll();
    return all.filter((v) => v.status === 'pendiente');
  },
};
