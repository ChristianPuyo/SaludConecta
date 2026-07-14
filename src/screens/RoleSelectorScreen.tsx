import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { CommunityEmblem } from '../components/CommunityEmblem';
import { FeatureItem } from '../components/FeatureItem';
import { RoleCard } from '../components/RoleCard';
import { ConnectivityStatus } from '../components/ConnectivityStatus';
import { HelpModal } from '../components/HelpModal';
import { PrivacyNotice } from '../components/PrivacyNotice';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <View style={styles.root}>
      <BackgroundDecorations />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <CommunityEmblem />

          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>
              La salud más cerca de tu comunidad
            </Text>
            <Text style={styles.mainDescription}>
              Recibe orientación, registra síntomas y mantente informado,
              incluso cuando estés lejos de un centro de salud.
            </Text>
            <Text style={styles.tagline}>
              Atención y orientación de salud, estés donde estés.
            </Text>
          </View>

          <View style={styles.benefitsSection}>
            <FeatureItem
              icon="chatbubbles-outline"
              text="Orientación de salud"
            />
            <FeatureItem
              icon="notifications-outline"
              text="Alertas de tu comunidad"
            />
            <FeatureItem
              icon="wifi-outline"
              text="Funciona con conexión limitada"
            />
          </View>

          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>
              ¿Cómo deseas ingresar?
            </Text>
            <Text style={styles.selectionSubtitle}>
              Selecciona el perfil que mejor te representa.
            </Text>

            <View style={styles.cardsList}>
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.id}
                  option={option}
                  onSelect={(id) => selectRole(id as any)}
                />
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.helpLink,
                pressed && styles.helpLinkPressed,
              ]}
              onPress={() => setHelpVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="¿No sabes qué opción elegir? Abrir ayuda"
            >
              <Text style={styles.helpLinkText}>
                ¿No sabes qué opción elegir?
              </Text>
            </Pressable>
          </View>

          <ConnectivityStatus isOnline={true} />
          <PrivacyNotice isOnline={true} />
        </View>
      </ScrollView>

      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
    position: 'relative',
    zIndex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
    letterSpacing: -0.5,
    maxWidth: 700,
  },
  mainDescription: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 620,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primaryLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  benefitsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  selectionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  selectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  selectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardsList: {
    width: '100%',
    maxWidth: 820,
    gap: 16,
  },
  helpLink: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
  },
  helpLinkPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  helpLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
    textDecorationLine: 'underline',
  },
});
