import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface PrivacyNoticeProps {
  isOnline?: boolean;
}

export function PrivacyNotice({ isOnline = true }: PrivacyNoticeProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.shieldRow}>
        <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
        <Text style={styles.privacyText}>Tus datos de salud están protegidos.</Text>
      </View>

      <View style={styles.linksRow}>
        <Pressable
          style={({ pressed }) => [
            styles.linkBtn,
            pressed && styles.linkBtnPressed,
          ]}
          onPress={() => setShowInfoModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Privacidad"
        >
          <Text style={styles.linkText}>Privacidad</Text>
        </Pressable>

        <View style={styles.linkSeparator} />

        <Pressable
          style={({ pressed }) => [
            styles.linkBtn,
            pressed && styles.linkBtnPressed,
          ]}
          onPress={() => setShowInfoModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Uso de datos"
        >
          <Text style={styles.linkText}>Uso de datos</Text>
        </Pressable>

        <View style={styles.linkSeparator} />

        <Pressable
          style={({ pressed }) => [
            styles.linkBtn,
            pressed && styles.linkBtnPressed,
          ]}
          onPress={() => setShowInfoModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Ayuda"
        >
          <Text style={styles.linkText}>Ayuda</Text>
        </Pressable>
      </View>

      {!isOnline && (
        <Text style={styles.offlineNote}>
          Tus datos se guardarán en el dispositivo y se sincronizarán cuando
          recuperes la conexión.
        </Text>
      )}

      <Text style={styles.disclaimer}>
        SaludConecta brinda orientación y apoyo comunitario. No reemplaza la
        atención de un profesional de salud.
      </Text>

      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowInfoModal(false)}
        >
          <Pressable style={styles.infoModal} accessibilityLabel="Información de privacidad">
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Privacidad y protección</Text>
              <Pressable
                onPress={() => setShowInfoModal(false)}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.closeBtnPressed,
                ]}
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.infoContent}>
              <Text style={styles.infoBody}>
                SaludConecta protege tu información personal y de salud
                conforme a las normativas vigentes. Tus datos son utilizados
                exclusivamente para brindarte orientación y apoyo comunitario
                en salud.
              </Text>
              <Text style={styles.infoBody}>
                Esta aplicación no sustituye la consulta con un profesional
                de salud. Si presentas síntomas graves, acude a un centro de
                salud o contacta a servicios de emergencia.
              </Text>
            </ScrollView>
            <Pressable
              style={({ pressed }) => [
                styles.understandBtn,
                pressed && styles.understandBtnPressed,
              ]}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.understandText}>Entendido</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkBtnPressed: {
    backgroundColor: colors.backgroundAlt,
  },
  linkText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '500',
  },
  linkSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  offlineNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    fontStyle: 'italic',
    paddingHorizontal: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModal: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    width: '100%',
    maxWidth: 420,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: colors.backgroundAlt,
  },
  infoContent: {
    paddingHorizontal: 20,
  },
  infoBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  understandBtn: {
    margin: 20,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  understandBtnPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.85,
  },
  understandText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.surface,
  },
});
