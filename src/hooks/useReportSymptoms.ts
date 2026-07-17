import { useCallback, useState } from 'react';
import { RiskAnalyzer } from '../domain/risk/RiskAnalyzer';
import { DiagnosisEngine } from '../domain/risk/DiagnosisEngine';
import { RecommendationEngine } from '../domain/recommendations/RecommendationEngine';
import { reportRepo } from '../repositories';
import type { SymptomReport } from '../models/report';
import type { RiskLevel } from '../types/health';
import { SYMPTOMS_LIST } from '../constants';

interface UseReportSymptomsReturn {
  selectedSymptoms: string[];
  district: string;
  community: string;
  riskPreview: RiskLevel | null;
  isSubmitting: boolean;
  toggleSymptom: (symptom: string) => void;
  setDistrict: (d: string) => void;
  setCommunity: (c: string) => void;
  submit: (age?: number, sex?: string) => Promise<SymptomReport | null>;
  reset: () => void;
}

export function useReportSymptoms(
  defaultDistrict: string = '',
  defaultCommunity: string = ''
): UseReportSymptomsReturn {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [district, setDistrictState] = useState(defaultDistrict);
  const [community, setCommunityState] = useState(defaultCommunity);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = useCallback((symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }, []);

  const setDistrict = useCallback((d: string) => setDistrictState(d), []);
  const setCommunity = useCallback((c: string) => setCommunityState(c), []);

  const riskPreview: RiskLevel | null =
    selectedSymptoms.length > 0
      ? RiskAnalyzer.analyze({
          symptomCount: selectedSymptoms.length,
          hasFever: selectedSymptoms.includes('Fiebre'),
          symptoms: selectedSymptoms,
        }).level
      : null;

  const submit = useCallback(
    async (age?: number, sex?: string): Promise<SymptomReport | null> => {
      if (selectedSymptoms.length === 0) return null;
      setIsSubmitting(true);

      const analysis = RiskAnalyzer.analyze({
        symptomCount: selectedSymptoms.length,
        hasFever: selectedSymptoms.includes('Fiebre'),
        symptoms: selectedSymptoms,
        age,
      });

      const report: SymptomReport = {
        id: Date.now().toString(),
        date: 'Hoy',
        timestamp: Date.now(),
        district: district || 'Callería',
        community,
        symptoms: [...selectedSymptoms],
        risk: analysis.level,
        diagnosis: DiagnosisEngine.suggest(selectedSymptoms, analysis.level),
        status: 'pendiente',
        age,
        sex,
      };

      const result = await reportRepo.add(report);
      setIsSubmitting(false);

      if (!result.success) return null;
      return result.data;
    },
    [selectedSymptoms, district, community]
  );

  const reset = useCallback(() => {
    setSelectedSymptoms([]);
    setDistrictState(defaultDistrict);
    setCommunityState(defaultCommunity);
  }, [defaultDistrict, defaultCommunity]);

  return {
    selectedSymptoms,
    district,
    community,
    riskPreview,
    isSubmitting,
    toggleSymptom,
    setDistrict,
    setCommunity,
    submit,
    reset,
  };
}
