export interface SOSAlert {
  id: string;
  userId: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
  message: string;
  contactedEmergency: boolean;
  contactedFamily: boolean;
  resolved: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  notifyOnSOS: boolean;
}
