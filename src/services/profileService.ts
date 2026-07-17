import type { UserProfile } from '../models/profile';
import { StorageService } from './storage';

const KEY = 'user_profile';

export const ProfileService = {
  async get(): Promise<UserProfile | null> {
    return StorageService.get<UserProfile>(KEY);
  },

  async save(profile: UserProfile): Promise<void> {
    const now = new Date().toISOString();
    const existing = await this.get();
    const updated = { ...profile, updatedAt: now, createdAt: existing?.createdAt ?? now };
    await StorageService.set(KEY, updated);
  },

  async delete(): Promise<void> {
    await StorageService.remove(KEY);
  },
};
