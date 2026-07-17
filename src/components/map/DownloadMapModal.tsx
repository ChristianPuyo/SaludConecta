import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { MapCacheService } from '../../services/mapCacheService';
import type { MapCacheStatus } from '../../services/mapCacheService';
import { useLanguage } from '../../context/LanguageContext';

interface DownloadMapModalProps {
  visible: boolean;
  cacheStatus: MapCacheStatus;
  onClose: () => void;
  onDownloadComplete: () => void;
}

type DownloadState = 'idle' | 'downloading' | 'done' | 'error';

export function DownloadMapModal({
  visible,
  cacheStatus,
  onClose,
  onDownloadComplete,
}: DownloadMapModalProps) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { t } = useLanguage();

  useEffect(() => {
    if (!visible) {
      setDownloadState('idle');
      setProgress(0);
      progressAnim.setValue(0);
    }
  }, [visible, progressAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const handleDownload = async () => {
    setDownloadState('downloading');
    setProgress(0);
    await MapCacheService.simulateDownload(
      (pct) => setProgress(pct),
      () => {
        setDownloadState('done');
        onDownloadComplete();
      },
      (err) => {
        setDownloadState('error');
        setErrorMsg(err);
      }
    );
  };

  const handleClearCache = async () => {
    await MapCacheService.clearCache();
    onDownloadComplete(); // triggers parent refresh
    onClose();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Ionicons name="cloud-download-outline" size={28} color={colors.primary} />
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.title}>{t.dl_modal_title}</Text>
          <Text style={styles.subtitle}>{t.dl_modal_subtitle}</Text>

          {/* Info chips */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Ionicons name="map-outline" size={14} color={colors.primary} />
              <Text style={styles.infoChipText}>{cacheStatus.regionName}</Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons name="layers-outline" size={14} color={colors.primary} />
              <Text style={styles.infoChipText}>~{cacheStatus.estimatedSizeMB} MB</Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons name="grid-outline" size={14} color={colors.primary} />
              <Text style={styles.infoChipText}>{cacheStatus.tileCount.toLocaleString()} tiles</Text>
            </View>
          </View>

          {/* Status */}
          {cacheStatus.isDownloaded && downloadState === 'idle' && (
            <View style={styles.alreadyCached}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.alreadyCachedText}>
                {t.dl_modal_downloaded_on(cacheStatus.downloadedAt || '')}
              </Text>
            </View>
          )}

          {/* Progress bar */}
          {downloadState === 'downloading' && (
            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.progressLabel}>{t.dl_modal_progress(progress)}</Text>
            </View>
          )}

          {downloadState === 'done' && (
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.successText}>{t.dl_modal_success}</Text>
            </View>
          )}

          {downloadState === 'error' && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {cacheStatus.isDownloaded && downloadState === 'idle' && (
              <Pressable style={styles.clearBtn} onPress={handleClearCache}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
                <Text style={styles.clearBtnText}>{t.dl_modal_btn_clear}</Text>
              </Pressable>
            )}

            {downloadState !== 'done' && (
              <Pressable
                style={[
                  styles.downloadBtn,
                  downloadState === 'downloading' && styles.downloadBtnDisabled,
                ]}
                onPress={handleDownload}
                disabled={downloadState === 'downloading'}
              >
                {downloadState === 'downloading' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="cloud-download-outline" size={18} color="#fff" />
                )}
                <Text style={styles.downloadBtnText}>
                  {downloadState === 'downloading'
                    ? t.dl_modal_btn_downloading
                    : cacheStatus.isDownloaded
                    ? t.dl_modal_btn_update
                    : t.dl_modal_btn_download}
                </Text>
              </Pressable>
            )}

            {downloadState === 'done' && (
              <Pressable style={styles.downloadBtn} onPress={onClose}>
                <Ionicons name="checkmark-outline" size={18} color="#fff" />
                <Text style={styles.downloadBtnText}>{t.dl_modal_btn_close}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0FDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  infoRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  infoChipText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  alreadyCached: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
  },
  alreadyCachedText: { fontSize: 13, color: colors.success, fontWeight: '600' },
  progressSection: { gap: 8 },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
  },
  successText: { fontSize: 13, color: colors.success, fontWeight: '700' },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
  },
  errorText: { fontSize: 13, color: colors.danger, fontWeight: '600', flex: 1 },
  actions: { gap: 10, marginTop: 4 },
  downloadBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadBtnDisabled: { opacity: 0.7 },
  downloadBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  clearBtn: {
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  clearBtnText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
