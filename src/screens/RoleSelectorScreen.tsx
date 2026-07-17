import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import { LandingHeader } from '../components/LandingHeader';
import { HeroSection } from '../components/HeroSection';
import { FeatureStrip } from '../components/FeatureStrip';
import { RoleCard } from '../components/RoleCard';
import { SecurityBanner } from '../components/SecurityBanner';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const rolesSectionRef = useRef<View>(null);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const handleHelpPress = () => {
    Alert.alert(
      'Contacto',
      'Selecciona el rol que mejor se ajuste a tu función:\n\n• Ciudadano: Reporta síntomas y recibe información preventiva\n• Agente Comunitario: Registra datos de salud en campo\n• Autoridad/Analista: Monitorea y analiza datos epidemiológicos',
      [{ text: 'Entendido' }]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      'Sobre Guardian Salud AI',
      'Sistema inteligente de vigilancia epidemiológica y prevención temprana para la Amazonía Peruana.',
      [{ text: 'Cerrar' }]
    );
  };

  const handleExplorePress = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleHowItWorksPress = () => {
    scrollRef.current?.scrollTo({ y: 500, animated: true });
  };

  const roleConfigs = {
    citizen: {
      color: colors.primaryLight,
      buttonColor: colors.primaryLight,
      badge: undefined as string | undefined,
    },
    agent: {
      color: colors.blue,
      buttonColor: colors.blue,
      badge: 'Modo offline',
    },
    authority: {
      color: colors.purple,
      buttonColor: colors.purple,
      badge: 'Análisis inteligente',
    },
  };

  return (
    <View style={styles.wrapper}>
      <LandingHeader onHelpPress={handleHelpPress} onAboutPress={handleAboutPress} />

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <HeroSection
          onExplorePress={handleExplorePress}
          onHowItWorksPress={handleHowItWorksPress}
        />

        {/* Feature Strip */}
        <View style={styles.sectionSpacer}>
          <FeatureStrip />
        </View>

        {/* Role Selection */}
        <View ref={rolesSectionRef} style={styles.rolesSection}>
          {/* Title with decorative lines */}
          <View style={[styles.roleTitleRow, isMobile && styles.roleTitleRowMobile]}>
            {!isMobile && <View style={styles.decorativeLine} />}
            <Text style={[styles.roleTitle, isMobile && styles.roleTitleMobile]}>
              ¿Con qué rol vas a ingresar?
            </Text>
            {!isMobile && <View style={styles.decorativeLine} />}
          </View>

          {/* Role Cards */}
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
    paddingVertical: 32,
    gap: 32,
  },
  sectionSpacer: {
    marginTop: 8,
  },
  rolesSection: {
    gap: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roleTitleRowMobile: {
    justifyContent: 'center',
  },
  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  roleTitleMobile: {
    fontSize: 18,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  cardsContainerMobile: {
    flexDirection: 'column',
    gap: 16,
  },
});
