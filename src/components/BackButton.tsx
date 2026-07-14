import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export function BackButton() {
  const navigation = useNavigation();
  const { clearRole } = useRole();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Si no hay pantalla previa en la pila (ej. estamos en la raíz del tab navigator),
      // regresamos al Selector de Roles limpiando el rol activo.
      clearRole();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.button} hitSlop={8}>
      <Ionicons name="arrow-back" size={24} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { marginLeft: 16, padding: 4 },
});
