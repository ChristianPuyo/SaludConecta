import React, { createContext, useContext, useMemo, useState } from 'react';
import type { User, LoginCredentials, RegisterCredentials, AuthContextValue } from '../types/auth';
import { ROLE_OPTIONS, type UserRole } from '../types/role';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'authority' as UserRole,
  },
  {
    id: '2',
    username: 'agente01',
    password: 'agente123',
    role: 'agent' as UserRole,
  },
  {
    id: '3',
    username: 'citizen01',
    password: 'citizen123',
    role: 'citizen' as UserRole,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const foundUser = MOCK_USERS.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!foundUser) {
        throw new Error('Credenciales inválidas');
      }
      
      const { password, ...userData } = foundUser;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const existingUser = MOCK_USERS.find((u) => u.username === credentials.username);
      if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        username: credentials.username,
        password: credentials.password,
        role: credentials.role || ROLE_OPTIONS[0].id,
      };
      
      MOCK_USERS.push(newUser);
      const { password, ...userData } = newUser;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, isAuthenticated, isLoading, login, register, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function assignDefaultRole(user: User): UserRole {
  return user.role || ROLE_OPTIONS[0].id;
}

export function getUserRole(user: User): UserRole {
  return user.role || ROLE_OPTIONS[0].id;
}
