import type { Result } from '../errors/AppError';

export interface IStorage {
  get<T>(key: string): Promise<Result<T | null>>;
  set<T>(key: string, value: T): Promise<Result<void>>;
  remove(key: string): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
  getAllKeys(): Promise<Result<string[]>>;
}
