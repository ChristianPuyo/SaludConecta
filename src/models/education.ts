export interface EducationalArticle {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  readTime: number;
  content: string;
  featured: boolean;
  createdAt: string;
}

export type ArticleCategory =
  | 'dengue'
  | 'covid'
  | 'vacunas'
  | 'alimentacion'
  | 'salud_infantil'
  | 'primeros_auxilios'
  | 'prevencion'
  | 'general';
