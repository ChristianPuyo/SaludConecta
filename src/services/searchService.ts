import type { SymptomReport } from '../models/report';
import type { HealthCenter } from '../models/healthCenter';
import type { EducationalArticle } from '../models/education';
import type { AppNotification } from '../models/notification';
import { ReportService } from './reportService';
import { EducationService } from './educationService';
import { HealthCenterService } from './healthCenterService';
import { NotificationService } from './notificationService';

export interface SearchResults {
  reports: SymptomReport[];
  articles: EducationalArticle[];
  centers: HealthCenter[];
  notifications: AppNotification[];
  total: number;
}

export const SearchService = {
  async search(query: string): Promise<SearchResults> {
    if (!query.trim()) {
      return { reports: [], articles: [], centers: [], notifications: [], total: 0 };
    }
    const q = query.toLowerCase().trim();

    const [allReports, allArticles, allCenters, allNotifications] = await Promise.all([
      ReportService.getAll(),
      EducationService.getAll(),
      HealthCenterService.getAll(),
      NotificationService.getAll(),
    ]);

    const reports = allReports.filter(
      (r) =>
        r.district.toLowerCase().includes(q) ||
        r.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        r.diagnosis.toLowerCase().includes(q)
    );

    const articles = allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    const centers = allCenters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.services.some((s) => s.toLowerCase().includes(q))
    );

    const notifications = allNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
    );

    const total = reports.length + articles.length + centers.length + notifications.length;

    return { reports, articles, centers, notifications, total };
  },
};
