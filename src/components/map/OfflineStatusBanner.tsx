import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { MapCacheStatus } from '../../services/mapCacheService';
import { useLanguage } from '../../context/LanguageContext';

interface OfflineStatusBannerProps {
  cacheStatus: MapCacheStatus;
}

export function OfflineStatusBanner({ cacheStatus }: OfflineStatusBannerProps) {
  const { t } = useLanguage();

  if (cacheStatus.isDownloaded) {
    return (
      <View style={[styles.banner, styles.bannerOffline]}>
        <Ionicons name="cloud-done-outline" size={13} color="#fff" />
        <Text style={styles.bannerText}>
          {t.offline_banner_ready(cacheStatus.downloadedAt || '')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.banner, styles.bannerOnline]}>
      <Ionicons name="wifi-outline" size={13} color="#fff" />
      <Text style={styles.bannerText}>{t.offline_banner_none}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerOffline: {
    backgroundColor: colors.primary,
  },
  bannerOnline: {
    backgroundColor: colors.secondary,
  },
  bannerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
});
