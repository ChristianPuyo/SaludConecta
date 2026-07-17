import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'offline_map_cache_v1';
const CACHE_REGION = 'ucayali_coronel_portillo';

export interface MapCacheStatus {
  isDownloaded: boolean;
  downloadedAt: string | null;
  regionName: string;
  estimatedSizeMB: number;
  tileCount: number;
}

const DEFAULT_STATUS: MapCacheStatus = {
  isDownloaded: false,
  downloadedAt: null,
  regionName: 'Coronel Portillo, Ucayali',
  estimatedSizeMB: 42,
  tileCount: 8400,
};

export const MapCacheService = {
  async getStatus(): Promise<MapCacheStatus> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return DEFAULT_STATUS;
      return JSON.parse(raw) as MapCacheStatus;
    } catch {
      return DEFAULT_STATUS;
    }
  },

  async markAsDownloaded(): Promise<void> {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const status: MapCacheStatus = {
      ...DEFAULT_STATUS,
      isDownloaded: true,
      downloadedAt: dateStr,
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(status));
  },

  async clearCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
  },

  /**
   * Simulates a progressive download with a callback for progress updates.
   * In a real implementation this would use expo-file-system to download map tiles.
   */
  async simulateDownload(
    onProgress: (progress: number) => void,
    onComplete: () => void,
    onError: (err: string) => void
  ): Promise<void> {
    try {
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        await new Promise<void>((resolve) => setTimeout(resolve, 180));
        onProgress(Math.round((i / steps) * 100));
      }
      await MapCacheService.markAsDownloaded();
      onComplete();
    } catch (e) {
      onError('Error al descargar los tiles del mapa. Verifique su conexión.');
    }
  },
};
