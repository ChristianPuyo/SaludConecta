import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
}

export function FadeInView({ children, delay = 0 }: FadeInViewProps) {
  return (
    <Animated.View entering={FadeIn.duration(500).delay(delay)}>
      {children}
    </Animated.View>
  );
}
