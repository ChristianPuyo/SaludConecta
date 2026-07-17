import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useVisits } from '../../context/VisitsContext';
import { AnimatedButton } from '../../components/AnimatedButton';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'RegisterVisit'>;

export function RegisterVisitScreen() {
  const navigation = useNavigation<Nav>();
  const { addVisit } = useVisits();
  const [patientName, setPatientName] = useState('');
  const [community, setCommunity] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleSave = () => {
    if (!patientName || !community) {
      Alert.alert('Completa al menos el nombre y la comunidad');
      return;
    }
    addVisit({ patientName, community, bloodPressure, glucose, temperature, weight, height });
    Alert.alert('Guardado localmente', 'La visita se sincronizará cuando haya conexión.');
    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    navigation.navigate('Sync');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Registrar visita</Text>
      </Animated.View>

      {[
        { label: 'Nombre del paciente', value: patientName, onChange: setPatientName },
        { label: 'Comunidad', value: community, onChange: setCommunity },
        { label: 'Presión arterial', value: bloodPressure, onChange: setBloodPressure },
        { label: 'Glucosa', value: glucose, onChange: setGlucose },
        { label: 'Temperatura', value: temperature, onChange: setTemperature },
        { label: 'Peso (kg)', value: weight, onChange: setWeight },
        { label: 'Talla (cm)', value: height, onChange: setHeight },
      ].map((field, index) => (
        <Animated.View
          key={field.label}
          entering={FadeInDown.duration(300).delay(100 + index * 60)}
          style={styles.fieldGroup}
        >
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholderTextColor={colors.textSecondary}
          />
        </Animated.View>
      ))}

      <Animated.View entering={FadeInDown.duration(400).delay(600)}>
        <AnimatedButton title="Guardar visita" onPress={handleSave} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
});
