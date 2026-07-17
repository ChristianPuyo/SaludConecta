export type RecommendationPriority = 'baja' | 'media' | 'alta';

export interface Recommendation {
  id: string;
  reportId: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  createdAt: string;
}
