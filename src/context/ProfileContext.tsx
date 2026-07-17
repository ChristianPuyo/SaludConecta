import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../models/profile';
import { ProfileService } from '../services/profileService';

interface ProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await ProfileService.get();
      setProfile(stored);
      setIsLoading(false);
    })();
  }, []);

  const saveProfile = async (p: UserProfile) => {
    await ProfileService.save(p);
    setProfile(p);
  };

  const clearProfile = async () => {
    await ProfileService.delete();
    setProfile(null);
  };

  const value = useMemo(
    () => ({ profile, isLoading, saveProfile, clearProfile, hasProfile: profile !== null }),
    [profile, isLoading]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
}
