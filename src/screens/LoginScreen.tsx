import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import type { RegisterCredentials, LoginCredentials } from '../types/auth';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, register, isLoading } = useAuth();

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }
    
    setError(null);
    try {
      if (isRegistering) {
        await register({ username, password, role: 'citizen' });
      } else {
        await login({ username, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isRegistering ? 'Error al registrar usuario' : 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Ionicons name="medical" size={48} color={colors.primary} />
            <Text style={styles.appTitle}>SaludConecta</Text>
            <Text style={styles.tagline}>Sistema de Vigilancia Epidemiológica</Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Usuario</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </Pressable>
              </View>
            </View>

            <Pressable 
              style={[styles.authButton, (isLoading || !username.trim() || !password.trim()) && styles.authButtonDisabled]} 
              onPress={handleAuth}
              disabled={isLoading || !username.trim() || !password.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</Text>
              )}
            </Pressable>
          </View>

          <Pressable 
            style={styles.switchModeButton}
            onPress={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            disabled={isLoading}
          >
            <Text style={styles.switchModeText}>
              {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
            </Text>
          </Pressable>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>SaludConecta · Iniciando sesión segura</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  formContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  authButton: { 
    backgroundColor: colors.primary, 
    borderRadius: 12, 
    paddingVertical: 16, 
    alignItems: 'center',
    marginTop: 8
  },
  authButtonDisabled: { backgroundColor: colors.textSecondary, opacity: 0.7 },
  authButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchModeButton: { marginTop: 16, alignItems: 'center' },
  switchModeText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  footerContainer: { alignItems: 'center', marginTop: 32 },
  footerText: { fontSize: 12, color: colors.textSecondary },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  appTitle: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginTop: 16, marginBottom: 8 },
  tagline: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: 20 },
  errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 8 },
  errorText: { color: colors.danger, fontSize: 14, textAlign: 'center' },
  inputContainer: { gap: 8 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: colors.textPrimary },
  eyeIcon: { padding: 8 },
});
