/**
 * ============================================
 * Archivo creado en la iteración:
 * Toast reutilizable + Calculadora de IMC
 * ============================================
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type ToastType = 'success' | 'error' | 'info';

interface ToastConfig {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION = 2800;
const ANIMATION_DURATION = 300;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; icon: IoniconName; iconColor: string; borderColor: string }
> = {
  success: { bg: colors.successLight, icon: 'checkmark-circle', iconColor: colors.success, borderColor: colors.successBorder },
  error: { bg: colors.dangerLight, icon: 'alert-circle', iconColor: colors.danger, borderColor: colors.dangerBorder },
  info: { bg: colors.primaryLight, icon: 'information-circle', iconColor: colors.primary, borderColor: colors.primaryBorder },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateOut = useCallback(
    (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -24,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
        callback?.();
      });
    },
    [opacity, translateY]
  );

  const showToast = useCallback(
    (config: ToastConfig) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Reset animation values before showing new toast
      opacity.setValue(0);
      translateY.setValue(-24);

      setToast(config);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        animateOut();
      }, TOAST_DURATION);
    },
    [opacity, translateY, animateOut]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity,
              transform: [{ translateY }],
              backgroundColor: TOAST_STYLES[toast.type].bg,
              borderColor: TOAST_STYLES[toast.type].borderColor,
            },
          ]}
          pointerEvents="none"
        >
          <Ionicons
            name={TOAST_STYLES[toast.type].icon}
            size={20}
            color={TOAST_STYLES[toast.type].iconColor}
          />
          <Text style={styles.message}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    zIndex: 9999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 10,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
