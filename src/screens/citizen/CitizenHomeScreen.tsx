import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { useRole } from '../../context/RoleContext';
import { CitizenSidebar } from '../../components/CitizenSidebar';
import { CitizenHeader } from '../../components/CitizenHeader';
import { SummaryCards } from '../../components/SummaryCards';
import { ReportSymptomsCard } from '../../components/ReportSymptomsCard';
import { HealthTips } from '../../components/HealthTips';
import { colors } from '../../theme/colors';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { clearRole } = useRole();
  const { reports } = useReports();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 700;

  const lastReport = reports[0];

  const handleNavigate = (item: string) => {
    if (item === 'reports') {
      navigation.navigate('MyReports');
    }
  };

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <CitizenHeader onSwitchRole={clearRole} />

      <SummaryCards
        lastReport={lastReport ? {
          date: lastReport.date,
          symptoms: lastReport.symptoms,
          risk: lastReport.risk,
        } : undefined}
        onPressLastReport={() => navigation.navigate('MyReports')}
      />

      <ReportSymptomsCard onPress={() => navigation.navigate('ReportSymptoms')} />

      <HealthTips />
    </ScrollView>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopLayout}>
        <CitizenSidebar activeItem="home" onItemPress={handleNavigate} />
        <View style={styles.desktopContent}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F9F7',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 32,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F9F7',
  },
  desktopContent: {
    flex: 1,
    maxWidth: 800,
  },
});
