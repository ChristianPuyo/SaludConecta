/**
 * Course - Define las interfaces y tipos para los cursos educativos.
 * Incluye las entidades de curso, lecciones, inscripciones y cuestionarios.
 */
export type CourseLevel = 'basic' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: 'disease_prevention' | 'first_aid' | 'nutrition' | 'mental_health' | 'maternal_health' | 'child_health' | 'epidemiology' | 'public_health';
  level: CourseLevel;
  status: CourseStatus;
  imageUrl?: string;
  duration: number;
  lessons: Lesson[];
  enrolledCount: number;
  completedCount: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz' | 'interactive';
  duration: number;
  order: number;
  completed: boolean;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  currentLesson: number;
  completedLessons: string[];
  startedAt: string;
  completedAt?: string;
  certificateUrl?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
  passingScore: number;
  attempts: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
