import type { Medication } from '../models/medication';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class MedicationRepository extends BaseRepository<Medication> {
  constructor(storage: IStorage) {
    super(storage, 'medications');
  }

  async add(medication: Medication): Promise<Result<Medication>> {
    return this.addItem(medication);
  }

  async update(medication: Medication): Promise<Result<Medication>> {
    return this.updateItem(medication.id, () => medication);
  }

  async remove(id: string): Promise<Result<void>> {
    return this.removeItem(id);
  }

  async getActive(): Promise<Result<Medication[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((m) => m.active));
  }
}
