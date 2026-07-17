export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  age: number;
  sex: 'masculino' | 'femenino' | 'otro';
  weight: number;
  height: number;
  bloodType: string;
  chronicDiseases: string[];
  allergies: string[];
  medications: string[];
  emergencyContact: EmergencyContact;
  address: string;
  community: string;
  district: string;
  createdAt: string;
  updatedAt: string;
}
