import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRole } from '../types/role';

const ROLE_STORAGE_KEY = '@saludconecta/active-role';

interface RoleContextValue {
  role: UserRole | null;
  isLoading: boolean;
  selectRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
        if (storedRole === 'citizen' || storedRole === 'agent' || storedRole === 'authority') {
          setRole(storedRole);
        }
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

  const value = useMemo(() => ({ role, isLoading, selectRole, clearRole }), [role, isLoading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
