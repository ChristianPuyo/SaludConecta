import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors as lightColors } from '../theme/colors';

const darkColors = {
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  secondary: '#60A5FA',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
  background: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
};

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: typeof lightColors;
  isDark: boolean;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');

  const isDark = theme === 'system'
    ? systemScheme === 'dark'
    : theme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { ThemeType };
