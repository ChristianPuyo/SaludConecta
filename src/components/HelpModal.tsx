import React from 'react';
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
import { ROLE_OPTIONS, ROLE_HELP, type UserRole } from '../types/role';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          accessibilityLabel="Ayuda para elegir perfil"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>¿No sabes qué opción elegir?</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              accessibilityLabel="Cerrar ayuda"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {ROLE_OPTIONS.map((option) => (
              <View key={option.id} style={styles.helpItem}>
                <View style={styles.helpIconWrap}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.helpTextWrap}>
                  <Text style={styles.helpTitle}>{option.title}</Text>
                  <Text style={styles.helpDescription}>
                    {ROLE_HELP[option.id as UserRole]}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [
              styles.understandBtn,
              pressed && styles.understandBtnPressed,
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Entendido"
          >
            <Text style={styles.understandText}>Entendido</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    width: '100%',
    maxWidth: 440,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    paddingHorizontal: 20,
  },
  helpItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  helpIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTextWrap: {
    flex: 1,
    gap: 3,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  understandBtn: {
    margin: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  understandBtnPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.85,
  },
  understandText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});
