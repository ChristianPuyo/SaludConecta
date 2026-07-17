import type { SymptomReport } from '../../models/report';
import type { DistrictPrediction } from '../predictions/PredictiveEngine';

export interface DistrictStats {
  district: string;
  totalCases: number;
  riskDistribution: { bajo: number; medio: number; alto: number };
  mostCommonSymptoms: Array<{ symptom: string; count: number }>;
  ageGroups: { '0-12': number; '13-25': number; '26-50': number; '50+': number };
  weeklyGrowth: number;
  prediction?: DistrictPrediction;
}

export class AnalyticsService {
  static computeDistrictStats(reports: SymptomReport[]): DistrictStats[] {
    const grouped = new Map<string, SymptomReport[]>();
    for (const r of reports) {
      const existing = grouped.get(r.district) ?? [];
      existing.push(r);
      grouped.set(r.district, existing);
    }

    return Array.from(grouped.entries()).map(([district, districtReports]) => {
      const riskDist = { bajo: 0, medio: 0, alto: 0 };
      for (const r of districtReports) {
        riskDist[r.risk]++;
      }

      const symptomCount = new Map<string, number>();
      for (const r of districtReports) {
        for (const s of r.symptoms) {
          symptomCount.set(s, (symptomCount.get(s) ?? 0) + 1);
        }
      }
      const mostCommonSymptoms = Array.from(symptomCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count }));

      const ageGroups = { '0-12': 0, '13-25': 0, '26-50': 0, '50+': 0 };
      for (const r of districtReports) {
        if (r.age !== undefined) {
          if (r.age <= 12) ageGroups['0-12']++;
          else if (r.age <= 25) ageGroups['13-25']++;
          else if (r.age <= 50) ageGroups['26-50']++;
          else ageGroups['50+']++;
        }
      }

      const now = Date.now();
      const last7 = districtReports.filter((r) => r.timestamp >= now - 7 * 86400000).length;
      const prev7 = districtReports.filter(
        (r) => r.timestamp >= now - 14 * 86400000 && r.timestamp < now - 7 * 86400000
      ).length;
      const weeklyGrowth = prev7 > 0 ? ((last7 - prev7) / prev7) * 100 : last7 > 0 ? 100 : 0;

      const totalCases = districtReports.length;
      const dominantRisk = riskDist.alto > riskDist.medio && riskDist.alto > riskDist.bajo ? 'alto' as const
        : riskDist.medio > riskDist.bajo ? 'medio' as const : 'bajo' as const;

      return {
        district,
        totalCases,
        riskDistribution: riskDist,
        mostCommonSymptoms,
        ageGroups,
        weeklyGrowth: Math.round(weeklyGrowth),
      };
    });
  }

  static getOverallStats(reports: SymptomReport[]) {
    const total = reports.length;
    const riskDist = { bajo: 0, medio: 0, alto: 0 };
    const districts = new Set<string>();
    for (const r of reports) {
      riskDist[r.risk]++;
      districts.add(r.district);
    }
    return {
      total,
      riskDistribution: riskDist,
      districtsCount: districts.size,
      districts: Array.from(districts),
    };
  }
}
