import type { FamilyMember } from '../models/family';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class FamilyRepository extends BaseRepository<FamilyMember> {
  constructor(storage: IStorage) {
    super(storage, 'family_members');
  }

  async add(member: FamilyMember): Promise<Result<FamilyMember>> {
    return this.addItem(member);
  }

  async update(member: FamilyMember): Promise<Result<FamilyMember>> {
    return this.updateItem(member.id, () => member);
  }

  async remove(id: string): Promise<Result<void>> {
    return this.removeItem(id);
  }

  async getByRelationship(relationship: string): Promise<Result<FamilyMember[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((m) => m.relationship === relationship));
  }
}
