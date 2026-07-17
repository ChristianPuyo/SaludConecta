import type { Vaccination } from '../models/vaccination';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';
import { VACCINES_DEFAULT } from '../constants';

export class VaccinationRepository extends BaseRepository<Vaccination> {
  constructor(storage: IStorage) {
    super(storage, 'vaccinations');
  }

  async getAll(): Promise<Result<Vaccination[]>> {
    const result = await super.getAll();
    if (result.success && result.data.length === 0) {
      const defaults: Vaccination[] = VACCINES_DEFAULT.map((v, i) => ({
        id: `v-default-${i}`,
        name: v.name,
        date: '',
        nextDose: v.nextDose,
        status: 'pendiente' as const,
        reminder: true,
        notes: '',
      }));
      await this.save(defaults);
      return success(defaults);
    }
    return result;
  }

  async update(vaccination: Vaccination): Promise<Result<Vaccination>> {
    return this.updateItem(vaccination.id, () => vaccination);
  }

  async getPending(): Promise<Result<Vaccination[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((v) => v.status === 'pendiente'));
  }
}
