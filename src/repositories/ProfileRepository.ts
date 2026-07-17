import type { UserProfile } from '../models/profile';
import type { IStorage } from '../storage/IStorage';
import { success, type Result } from '../errors/AppError';

export class ProfileRepository {
  constructor(private readonly storage: IStorage) {}

  async get(): Promise<Result<UserProfile | null>> {
    return this.storage.get<UserProfile>('user_profile');
  }

  async save(profile: UserProfile): Promise<Result<void>> {
    const now = new Date().toISOString();
    const existing = await this.get();
    const updated = {
      ...profile,
      updatedAt: now,
      createdAt: existing.success && existing.data ? existing.data.createdAt : now,
    };
    return this.storage.set('user_profile', updated);
  }

  async delete(): Promise<Result<void>> {
    return this.storage.remove('user_profile');
  }
}
