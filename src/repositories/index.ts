import { storage } from '../storage/AsyncStorageAdapter';
import { ReportRepository } from './ReportRepository';
import { VisitRepository } from './VisitRepository';
import { MedicationRepository } from './MedicationRepository';
import { VaccinationRepository } from './VaccinationRepository';
import { HealthIndicatorRepository } from './HealthIndicatorRepository';
import { ProfileRepository } from './ProfileRepository';
import { FamilyRepository } from './FamilyRepository';
import { CommunityReportRepository } from './CommunityReportRepository';

export const reportRepo = new ReportRepository(storage);
export const visitRepo = new VisitRepository(storage);
export const medicationRepo = new MedicationRepository(storage);
export const vaccinationRepo = new VaccinationRepository(storage);
export const healthIndicatorRepo = new HealthIndicatorRepository(storage);
export const profileRepo = new ProfileRepository(storage);
export const familyRepo = new FamilyRepository(storage);
export const communityReportRepo = new CommunityReportRepository(storage);
