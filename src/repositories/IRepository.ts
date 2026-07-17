import type { Result } from '../errors/AppError';

export interface IRepository<T> {
  getAll(): Promise<Result<T[]>>;
  getById(id: string): Promise<Result<T | null>>;
  save(items: T[]): Promise<Result<void>>;
}
