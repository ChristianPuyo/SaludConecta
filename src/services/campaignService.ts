/**
 * CampaignService - Servicio que gestiona campañas de salud y actividades asociadas.
 * Proporciona métodos CRUD, filtros por estado y distrito, y cálculo de progreso.
 * Utiliza AsyncStorage para persistencia local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Campaign, CampaignActivity } from '../models/campaign';

const STORAGE_KEY = '@saludconecta/campaigns';

export const CampaignService = {
  async getAll(): Promise<Campaign[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async getById(id: string): Promise<Campaign | undefined> {
    const list = await this.getAll();
    return list.find(c => c.id === id);
  },

  async save(campaign: Campaign): Promise<void> {
    const list = await this.getAll();
    const idx = list.findIndex(c => c.id === campaign.id);
    if (idx >= 0) list[idx] = campaign;
    else list.push(campaign);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  async delete(id: string): Promise<void> {
    const list = await this.getAll();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list.filter(c => c.id !== id)));
  },

  async getActive(): Promise<Campaign[]> {
    const list = await this.getAll();
    return list.filter(c => c.status === 'active');
  },

  async getByDistrict(district: string): Promise<Campaign[]> {
    const list = await this.getAll();
    return list.filter(c => c.targetCriteria?.district === district || c.target === 'general');
  },

  getProgress(campaign: Campaign): number {
    if (campaign.targetParticipants === 0) return 0;
    return Math.min(100, Math.round((campaign.participants / campaign.targetParticipants) * 100));
  },
};

export const CampaignActivityService = {
  storageKey: (id: string) => `@saludconecta/campaign_activities/${id}`,

  async getByCampaign(campaignId: string): Promise<CampaignActivity[]> {
    const raw = await AsyncStorage.getItem(this.storageKey(campaignId));
    return raw ? JSON.parse(raw) : [];
  },

  async save(activity: CampaignActivity): Promise<void> {
    const list = await this.getByCampaign(activity.campaignId);
    const idx = list.findIndex(a => a.id === activity.id);
    if (idx >= 0) list[idx] = activity;
    else list.push(activity);
    await AsyncStorage.setItem(this.storageKey(activity.campaignId), JSON.stringify(list));
  },
};
