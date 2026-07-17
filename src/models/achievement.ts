export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  points: number;
  level: number;
}
