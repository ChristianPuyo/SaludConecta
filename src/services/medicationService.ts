import type { Medication } from '../models/medication';
import { StorageService } from './storage';

const KEY = 'medications';

export const MedicationService = {
  async getAll(): Promise<Medication[]> {
    return (await StorageService.get<Medication[]>(KEY)) ?? [];
  },

  async save(medications: Medication[]): Promise<void> {
    await StorageService.set(KEY, medications);
  },

  async add(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<Medication> {
    const all = await this.getAll();
    const newMed: Medication = {
      ...medication,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    all.unshift(newMed);
    await this.save(all);
    return newMed;
  },

  async update(medication: Medication): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((m) => m.id === medication.id);
    if (idx !== -1) {
      all[idx] = medication;
      await this.save(all);
    }
  },

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await this.save(all.filter((m) => m.id !== id));
  },

  async getActive(): Promise<Medication[]> {
    const all = await this.getAll();
    return all.filter((m) => m.active);
  },

  async getBySchedule(hour: string): Promise<Medication[]> {
    const all = await this.getActive();
    return all.filter((m) => m.schedule.includes(hour));
  },
};
