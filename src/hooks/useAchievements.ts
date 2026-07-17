import { useCallback, useEffect, useState } from 'react';
import type { UserAchievements } from '../models/achievement';
import { GamificationEngine } from '../domain/analysis/GamificationEngine';
import { storage } from '../storage/AsyncStorageAdapter';

const KEY = 'user_achievements';

export function useAchievements(userId: string) {
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await storage.get<UserAchievements>(KEY);
      if (result.success && result.data) {
        setAchievements(result.data);
      } else {
        const initial = GamificationEngine.initialize(userId);
        setAchievements(initial);
        await storage.set(KEY, initial);
      }
      setIsLoading(false);
    })();
  }, [userId]);

  const updateMetrics = useCallback(
    async (metrics: Parameters<typeof GamificationEngine.evaluateProgress>[1]) => {
      if (!achievements) return;
      const updated = GamificationEngine.evaluateProgress(achievements, metrics);
      setAchievements(updated);
      await storage.set(KEY, updated);
    },
    [achievements]
  );

  const recentlyUnlocked = (achievements?.achievements ?? []).filter(
    (a) => a.unlocked && a.unlockedAt
  );

  return { achievements, isLoading, updateMetrics, recentlyUnlocked };
}
