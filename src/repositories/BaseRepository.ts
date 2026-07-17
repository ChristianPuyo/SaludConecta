import type { IStorage } from '../storage/IStorage';
import type { IRepository } from './IRepository';
import { success, failure, type Result } from '../errors/AppError';

export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  constructor(
    protected readonly storage: IStorage,
    protected readonly storageKey: string
  ) {}

  async getAll(): Promise<Result<T[]>> {
    const result = await this.storage.get<T[]>(this.storageKey);
    if (result.success) {
      return success(result.data ?? []);
    }
    return result;
  }

  async getById(id: string): Promise<Result<T | null>> {
    const result = await this.getAll();
    if (result.success) {
      return success(result.data.find((item) => item.id === id) ?? null);
    }
    return result;
  }

  async save(items: T[]): Promise<Result<void>> {
    return this.storage.set(this.storageKey, items);
  }

  protected async addItem(item: T): Promise<Result<T>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const items = result.data;
    items.unshift(item);
    const saveResult = await this.save(items);
    if (!saveResult.success) return saveResult;
    return success(item);
  }

  protected async updateItem(id: string, updater: (item: T) => T): Promise<Result<T>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const items = result.data;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return failure(new (require('../errors/AppError').NotFoundError)(this.storageKey, id));
    items[idx] = updater(items[idx]);
    const saveResult = await this.save(items);
    if (!saveResult.success) return saveResult;
    return success(items[idx]);
  }

  protected async removeItem(id: string): Promise<Result<void>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const items = result.data.filter((i) => i.id !== id);
    return this.save(items);
  }
}
