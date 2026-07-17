export type FamilyRelationship = 'titular' | 'pareja' | 'hijo' | 'padre' | 'madre' | 'abuelo' | 'otro';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  sex: 'masculino' | 'femenino' | 'otro';
  relationship: FamilyRelationship;
  bloodType: string;
  chronicDiseases: string[];
  allergies: string[];
  medications: string[];
  notes: string;
  createdAt: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}
