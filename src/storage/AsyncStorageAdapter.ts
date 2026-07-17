import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IStorage } from './IStorage';
import { StorageError, success, failure, type Result } from '../errors/AppError';

const PREFIX = '@saludconecta/';

export class AsyncStorageAdapter implements IStorage {
  private key(k: string): string {
    return `${PREFIX}${k}`;
  }

  async get<T>(key: string): Promise<Result<T | null>> {
    try {
      const raw = await AsyncStorage.getItem(this.key(key));
      return success(raw ? (JSON.parse(raw) as T) : null);
    } catch (e) {
      return failure(new StorageError(`Failed to get "${key}"`, { error: e }));
    }
  }

  async set<T>(key: string, value: T): Promise<Result<void>> {
    try {
      await AsyncStorage.setItem(this.key(key), JSON.stringify(value));
      return success(undefined);
    } catch (e) {
      return failure(new StorageError(`Failed to set "${key}"`, { error: e }));
    }
  }

  async remove(key: string): Promise<Result<void>> {
    try {
      await AsyncStorage.removeItem(this.key(key));
      return success(undefined);
    } catch (e) {
      return failure(new StorageError(`Failed to remove "${key}"`, { error: e }));
    }
  }

  async clear(): Promise<Result<void>> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter((k) => k.startsWith(PREFIX));
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
      }
      return success(undefined);
    } catch (e) {
      return failure(new StorageError('Failed to clear storage', { error: e }));
    }
  }

  async getAllKeys(): Promise<Result<string[]>> {
    try {
      const all = await AsyncStorage.getAllKeys();
      const appKeys = all.filter((k) => k.startsWith(PREFIX));
      return success(appKeys.map((k) => k.replace(PREFIX, '')));
    } catch (e) {
      return failure(new StorageError('Failed to get all keys', { error: e }));
    }
  }
}

export const storage = new AsyncStorageAdapter();
