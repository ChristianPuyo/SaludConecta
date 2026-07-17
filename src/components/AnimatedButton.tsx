import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Pressable, Animated, ActivityIndicator, View } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme/colors';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: object;
}

export function AnimatedButton({
  title, onPress, variant = 'primary', size = 'md', loading = false, disabled = false, icon, style
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (disabled || loading) {
      Animated.timing(opacityAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [disabled, loading]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, friction: 8 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  const variantStyles = {
    primary: { backgroundColor: colors.primary, ...colors.shadowPrimary },
    secondary: { backgroundColor: colors.secondary, shadowColor: colors.secondary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    danger: { backgroundColor: colors.danger, shadowColor: colors.danger, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    ghost: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.border, shadowOpacity: 0 },
  };

  const textVariantStyles = {
    primary: { color: '#fff' },
    secondary: { color: '#fff' },
    danger: { color: '#fff' },
    ghost: { color: colors.primary },
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 24 },
    lg: { paddingVertical: 18, paddingHorizontal: 32 },
  };

  const textSizeStyles = {
    sm: { fontSize: typography.sm },
    md: { fontSize: typography.base },
    lg: { fontSize: typography.lg },
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          variantStyles[variant],
          sizeStyles[size],
          disabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textVariantStyles[variant].color} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.text, textSizeStyles[size], textVariantStyles[variant]]}>{title}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '700',
  },
  icon: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
