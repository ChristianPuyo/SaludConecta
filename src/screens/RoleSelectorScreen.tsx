import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import { RoleCard } from '../components/RoleCard';
import { SecurityBanner } from '../components/SecurityBanner';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const handleHelpPress = () => {
    Alert.alert(
      'Ayuda',
      'Selecciona el rol que mejor se ajuste a tu función:\n\n• Ciudadano: Reporta síntomas y recibe información preventiva\n• Agente Comunitario: Registra datos de salud en campo\n• Autoridad/Analista: Monitorea y analiza datos epidemiológicos',
      [{ text: 'Entendido', onPress: () => {} }]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      'Sobre Guardian Salud AI',
      'Sistema inteligente de vigilancia epidemiológica y prevención temprana para la Amazonía Peruana.',
      [{ text: 'Cerrar', onPress: () => {} }]
    );
  };

  const roleConfigs = {
    citizen: {
      color: colors.primary,
      buttonColor: colors.primary,
      badge: undefined,
    },
    agent: {
      color: colors.blue,
      buttonColor: colors.blue,
      badge: 'Offline',
    },
    authority: {
      color: colors.purple,
      buttonColor: colors.purple,
      badge: 'Institucional',
    },
  };

  return (
    <View style={styles.wrapper}>
      <Header onHelpPress={handleHelpPress} onAboutPress={handleAboutPress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de presentación */}
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Guardian Salud AI</Text>
          <View style={styles.decorativeLine} />
          <Text style={styles.subtitle}>
            Sistema inteligente de vigilancia epidemiológica y prevención temprana para la Amazonía Peruana
          </Text>
          <Text style={styles.description}>
            Una plataforma que conecta comunidad, territorio e inteligencia artificial para actuar antes de que
            un brote avance.
          </Text>
        </View>

        {/* Pregunta de selección */}
        <Text style={[styles.selectionQuestion, isMobile && styles.selectionQuestionMobile]}>
          ¿Con qué rol vas a ingresar?
        </Text>

        {/* Tarjetas de roles */}
        <View style={[styles.cardsContainer, isMobile && styles.cardsContainerMobile]}>
          {ROLE_OPTIONS.map((option) => (
            <RoleCard
              key={option.id}
              option={option}
              onPress={() => selectRole(option.id)}
              color={roleConfigs[option.id as keyof typeof roleConfigs].color}
              buttonColor={roleConfigs[option.id as keyof typeof roleConfigs].buttonColor}
              badge={roleConfigs[option.id as keyof typeof roleConfigs].badge}
            />
          ))}
        </View>
      </ScrollView>

      <SecurityBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 50,
    gap: 12,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  decorativeLine: {
    width: 48,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 600,
    marginTop: 12,
  },
  selectionQuestion: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
    marginLeft: 0,
  },
  selectionQuestionMobile: {
    textAlign: 'center',
    fontSize: 18,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  cardsContainerMobile: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
});
