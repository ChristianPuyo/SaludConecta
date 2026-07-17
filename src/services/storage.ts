import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = '@saludconecta/';

export class StorageService {
  private static buildKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(this.buildKey(key));
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(this.buildKey(key), JSON.stringify(value));
    } catch (e) {
      console.error(`StorageService.set(${key}) failed:`, e);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.buildKey(key));
    } catch (e) {
      console.error(`StorageService.remove(${key}) failed:`, e);
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      const all = await AsyncStorage.getAllKeys();
      return all.filter((k) => k.startsWith(STORAGE_PREFIX));
    } catch {
      return [];
    }
  }

  static async clearAll(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
      }
    } catch (e) {
      console.error('StorageService.clearAll failed:', e);
    }
  }
}
