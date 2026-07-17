export type VaccinationStatus = 'recibida' | 'pendiente';

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDose: string;
  status: VaccinationStatus;
  reminder: boolean;
  notes: string;
}
