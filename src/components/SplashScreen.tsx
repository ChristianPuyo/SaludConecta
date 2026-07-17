import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

function TypingText({ text, shouldStart, speed = 50, onDone }: { text: string; shouldStart: boolean; speed?: number; onDone?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [shouldStart]);

  return (
    <View style={styles.typingContainer}>
      {text.split('').map((char, i) => (
        <Text
          key={i}
          style={[styles.typingChar, i < visibleCount && styles.typingCharVisible]}
        >
          {char}
        </Text>
      ))}
    </View>
  );
}

function Particle({ delay, startX, startY, size }: { delay: number; startX: number; startY: number; size: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
          Animated.timing(moveAnim, { toValue: -60, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
          Animated.timing(moveAnim, { toValue: -120, duration: 1200, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: fadeAnim,
          transform: [{ translateY: moveAnim }],
        },
      ]}
    />
  );
}

function GlowRing({ delay, size }: { delay: number; size: number }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1.8, duration: 2000, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.timing(opacityAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.glowRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textDone, setTextDone] = useState(false);

  const containerFade = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.95)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const exitScale = useRef(new Animated.Value(1)).current;
  const exitFade = useRef(new Animated.Value(1)).current;
  const arcSpin1 = useRef(new Animated.Value(0)).current;
  const arcSpin2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Container fade in
    Animated.parallel([
      Animated.timing(containerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(containerScale, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start(() => setPhase('visible'));

    // Phase 2: Logo reveal (0.5s after start)
    setTimeout(() => {
      setShowLogo(true);
      Animated.sequence([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoGlow, { toValue: 1, duration: 1500, useNativeDriver: true }),
            Animated.timing(logoGlow, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ])
        ),
      ]).start();

      // Spinning arcs
      Animated.loop(
        Animated.timing(arcSpin1, { toValue: 1, duration: 3000, useNativeDriver: true })
      ).start();
      Animated.loop(
        Animated.timing(arcSpin2, { toValue: 1, duration: 4000, useNativeDriver: true })
      ).start();
    }, 500);

    // Phase 3: Typing text (1.5s after start)
    setTimeout(() => setShowText(true), 1500);

    // Phase 4: Progress bar (2s after start)
    setTimeout(() => {
      setShowProgress(true);
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => handleExit(), 200);
        }
        setProgress(current);
      }, 32);
    }, 2000);

    // Spin animation for arcs
    const spin1 = Animated.loop(
      Animated.timing(arcSpin1, { toValue: 1, duration: 3000, useNativeDriver: true })
    );
    const spin2 = Animated.loop(
      Animated.timing(arcSpin2, { toValue: 1, duration: 4000, useNativeDriver: true })
    );
    spin1.start();
    spin2.start();

    return () => {
      spin1.stop();
      spin2.stop();
    };
  }, []);

  const handleExit = () => {
    setPhase('exiting');
    Animated.parallel([
      Animated.timing(exitScale, { toValue: 1.1, duration: 400, useNativeDriver: true }),
      Animated.timing(exitFade, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onComplete());
  };

  const handleTextDone = () => {
    setTextDone(true);
  };

  const rotate1 = arcSpin1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotate2 = arcSpin2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: phase === 'exiting' ? exitFade : containerFade,
          transform: [{ scale: phase === 'exiting' ? exitScale : containerScale }],
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Background gradient effect */}
      <View style={styles.bgGradient} />

      {/* Constellation particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Particle
          key={`p-${i}`}
          delay={i * 200}
          startX={Math.random() * SCREEN_W}
          startY={SCREEN_H * 0.3 + Math.random() * SCREEN_H * 0.5}
          size={3 + Math.random() * 4}
        />
      ))}

      {/* Glow rings */}
      <View style={styles.glowContainer}>
        <GlowRing delay={0} size={200} />
        <GlowRing delay={500} size={260} />
        <GlowRing delay={1000} size={320} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo with arcs */}
        <View style={styles.logoSection}>
          {/* Spinning arc 1 */}
          {showLogo && (
            <Animated.View
              style={[
                styles.arc1,
                { transform: [{ rotate: rotate1 }] },
              ]}
            />
          )}

          {/* Spinning arc 2 */}
          {showLogo && (
            <Animated.View
              style={[
                styles.arc2,
                { transform: [{ rotate: rotate2 }] },
              ]}
            />
          )}

          {/* Logo circle */}
          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoInner}>
              <Ionicons name="shield-checkmark" size={56} color="#fff" />
            </View>
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.logoGlow,
                { opacity: logoGlow },
              ]}
            />
          </Animated.View>
        </View>

        {/* Typing text */}
        <View style={styles.textSection}>
          {showText && (
            <TypingText
              text="Guardian Salud AI"
              shouldStart={showText}
              speed={60}
              onDone={handleTextDone}
            />
          )}
          {textDone && (
            <Animated.View style={styles.subtitleFade}>
              <Text style={styles.subtitle}>Vigilancia Epidemiológica Inteligente</Text>
            </Animated.View>
          )}
        </View>

        {/* Progress bar */}
        {showProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]}>
                <View style={styles.progressShine} />
              </View>
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        {/* HUD info */}
        {textDone && (
          <Animated.View style={styles.hudContainer}>
            <Text style={styles.hudText}>SYS::ONLINE</Text>
            <Text style={styles.hudText}>v1.0.0 · Ucayali, Perú</Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryDark,
    zIndex: 9999,
    elevation: 9999,
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryDark,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(153, 246, 228, 0.6)',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  arc1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderTopColor: 'rgba(20, 184, 166, 0.8)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arc2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRightColor: 'rgba(153, 246, 228, 0.5)',
    borderBottomColor: 'rgba(153, 246, 228, 0.5)',
    borderLeftColor: 'transparent',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(153, 246, 228, 0.5)',
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 60,
  },
  typingContainer: {
    flexDirection: 'row',
  },
  typingChar: {
    fontSize: 30,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
  typingCharVisible: {
    color: '#fff',
    textShadowColor: 'rgba(20, 184, 166, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitleFade: {
    marginTop: 12,
    opacity: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(153, 246, 228, 0.8)',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 2,
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(153, 246, 228, 0.6)',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  hudContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: 4,
  },
  hudText: {
    fontSize: 10,
    color: 'rgba(153, 246, 228, 0.4)',
    fontWeight: '600',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
});
