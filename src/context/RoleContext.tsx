import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRole } from '../types/role';

const ROLE_STORAGE_KEY = '@saludconecta/active-role';
const PROFILE_STORAGE_KEY = '@saludconecta/citizen-profile';

export interface CitizenProfile {
  fullName: string;
  dni: string;
  age: string;
  gender: string;
  district: string;
  community: string;
}


interface RoleContextValue {
  role: UserRole | null;
  isLoading: boolean;
  selectRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
  citizenProfile: CitizenProfile | null;
  saveCitizenProfile: (profile: CitizenProfile) => Promise<void>;
  clearCitizenProfile: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedRole, storedProfile] = await Promise.all([
          AsyncStorage.getItem(ROLE_STORAGE_KEY),
          AsyncStorage.getItem(PROFILE_STORAGE_KEY)
        ]);
        
        if (storedRole === 'citizen' || storedRole === 'agent' || storedRole === 'authority') {
          setRole(storedRole);
        }
        
        if (storedProfile) {
          setCitizenProfile(JSON.parse(storedProfile));
        }
      } catch (e) {
        console.error('Error loading initial data', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const selectRole = async (newRole: UserRole) => {
    await AsyncStorage.setItem(ROLE_STORAGE_KEY, newRole);
    setRole(newRole);
  };

  const clearRole = async () => {
    await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
    setRole(null);
  };

  const saveCitizenProfile = async (profile: CitizenProfile) => {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setCitizenProfile(profile);
  };

  const clearCitizenProfile = async () => {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    setCitizenProfile(null);
  };

  const value = useMemo(() => ({ 
    role, 
    isLoading, 
    selectRole, 
    clearRole,
    citizenProfile,
    saveCitizenProfile,
    clearCitizenProfile
  }), [role, isLoading, citizenProfile]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

