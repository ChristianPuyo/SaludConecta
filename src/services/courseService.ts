/**
 * CourseService - Servicio que gestiona cursos, inscripciones y cuestionarios.
 * Proporciona métodos CRUD, consultas por categoría, control de progreso y evaluaciones.
 * Utiliza AsyncStorage para persistencia local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Course, Enrollment, Quiz } from '../models/course';

const COURSES_KEY = '@saludconecta/courses';
const ENROLLMENTS_KEY = '@saludconecta/enrollments';
const QUIZZES_KEY = '@saludconecta/quizzes';

export const CourseService = {
  async getAll(): Promise<Course[]> {
    const raw = await AsyncStorage.getItem(COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async getById(id: string): Promise<Course | undefined> {
    const list = await this.getAll();
    return list.find(c => c.id === id);
  },

  async save(course: Course): Promise<void> {
    const list = await this.getAll();
    const idx = list.findIndex(c => c.id === course.id);
    if (idx >= 0) list[idx] = course;
    else list.push(course);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(list));
  },

  async getPublished(): Promise<Course[]> {
    const list = await this.getAll();
    return list.filter(c => c.status === 'published');
  },

  async getByCategory(category: string): Promise<Course[]> {
    const list = await this.getPublished();
    return list.filter(c => c.category === category);
  },

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const enrollment: Enrollment = {
      id: `${userId}_${courseId}`,
      courseId,
      userId,
      progress: 0,
      currentLesson: 0,
      completedLessons: [],
      startedAt: new Date().toISOString(),
    };
    const enrollments = await this.getEnrollments(userId);
    enrollments.push(enrollment);
    await AsyncStorage.setItem(`${ENROLLMENTS_KEY}/${userId}`, JSON.stringify(enrollments));
    return enrollment;
  },

  async getEnrollments(userId: string): Promise<Enrollment[]> {
    const raw = await AsyncStorage.getItem(`${ENROLLMENTS_KEY}/${userId}`);
    return raw ? JSON.parse(raw) : [];
  },

  async updateProgress(userId: string, courseId: string, lessonId: string): Promise<void> {
    const enrollments = await this.getEnrollments(userId);
    const idx = enrollments.findIndex(e => e.courseId === courseId);
    if (idx < 0) return;
    const e = enrollments[idx];
    if (!e.completedLessons.includes(lessonId)) e.completedLessons.push(lessonId);
    const course = await this.getById(courseId);
    const total = course?.lessons.length ?? 1;
    e.progress = Math.min(100, Math.round((e.completedLessons.length / total) * 100));
    enrollments[idx] = e;
    await AsyncStorage.setItem(`${ENROLLMENTS_KEY}/${userId}`, JSON.stringify(enrollments));
  },
};

export const QuizService = {
  async getByLesson(lessonId: string): Promise<Quiz | undefined> {
    const raw = await AsyncStorage.getItem(`${QUIZZES_KEY}/${lessonId}`);
    return raw ? JSON.parse(raw) : undefined;
  },

  async save(quiz: Quiz): Promise<void> {
    await AsyncStorage.setItem(`${QUIZZES_KEY}/${quiz.lessonId}`, JSON.stringify(quiz));
  },
};
