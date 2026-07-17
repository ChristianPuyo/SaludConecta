import type { Achievement, UserAchievements } from '../../models/achievement';
import { ACHIEVEMENTS } from '../../constants';

export class GamificationEngine {
  static initialize(userId: string): UserAchievements {
    return {
      userId,
      achievements: ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: false,
        progress: 0,
        target: a.id === 'first_report' ? 1
          : a.id === 'active_citizen' ? 10
          : a.id === 'vaccination_complete' ? 8
          : a.id === 'healthy_community' ? 5
          : a.id === 'prevention_expert' ? 10
          : a.id === 'health_tracker' ? 30
          : a.id === 'family_care' ? 3
          : 1,
      })),
      points: 0,
      level: 1,
    };
  }

  static evaluateProgress(
    current: UserAchievements,
    metrics: {
      reportCount: number;
      vaccinationCount: number;
      communityReportCount: number;
      articlesRead: number;
      healthDays: number;
      familyMembers: number;
    }
  ): UserAchievements {
    const updated = { ...current, achievements: [...current.achievements] };
    let newPoints = current.points;
    const now = new Date().toISOString();

    const checks: Array<{ id: string; value: number }> = [
      { id: 'first_report', value: metrics.reportCount },
      { id: 'active_citizen', value: metrics.reportCount },
      { id: 'vaccination_complete', value: metrics.vaccinationCount },
      { id: 'healthy_community', value: metrics.communityReportCount },
      { id: 'prevention_expert', value: metrics.articlesRead },
      { id: 'health_tracker', value: metrics.healthDays },
      { id: 'family_care', value: metrics.familyMembers },
    ];

    for (const check of checks) {
      const ach = updated.achievements.find((a) => a.id === check.id);
      if (!ach || ach.unlocked) continue;
      ach.progress = Math.min(check.value, ach.target);
      if (ach.progress >= ach.target && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = now;
        newPoints += 50;
      }
    }

    updated.points = newPoints;
    updated.level = Math.floor(newPoints / 200) + 1;

    return updated;
  }
}
