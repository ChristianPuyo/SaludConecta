export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  schedule: string[];
  active: boolean;
  notes: string;
  createdAt: string;
}
