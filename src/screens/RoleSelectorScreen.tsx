import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors, spacing, typography } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 440;

// ── ORGANIC BLOB ──────────────────────────────────────
function OrganicBlob({ x, y, size, color, dur, delay }: {
  x: number; y: number; size: number; color: string; dur: number; delay: number;
}) {
  const dx = useRef(new Animated.Value(0)).current;
  const dy = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const go = () => {
      const rx = (Math.random() - 0.5) * 60;
      const ry = (Math.random() - 0.5) * 50;
      const s = 0.9 + Math.random() * 0.3;
      Animated.parallel([
        Animated.timing(dx, { toValue: rx, duration: dur, useNativeDriver: true }),
        Animated.timing(dy, { toValue: ry, duration: dur * 1.1, useNativeDriver: true }),
        Animated.timing(sc, { toValue: s, duration: dur * 0.9, useNativeDriver: true }),
      ]).start(() => go());
    };
    setTimeout(go, delay);
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: size, backgroundColor: color,
      transform: [{ translateX: dx }, { translateY: dy }, { scale: sc }],
    }} />
  );
}

// ── WAVE LAYER ────────────────────────────────────────
function WaveLayer({ color, height, speed, delay, yOffset }: {
  color: string; height: number; speed: number; delay: number; yOffset: number;
}) {
  const yAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(yAnim, { toValue: yOffset, duration: speed, useNativeDriver: true }),
        Animated.timing(yAnim, { toValue: -yOffset, duration: speed, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', bottom: -height / 2, left: -30, right: -30,
      height, borderRadius: height, backgroundColor: color,
      transform: [{ translateY: yAnim }],
    }} />
  );
}

// ── FLOATING DOT ──────────────────────────────────────
function FloatingDot({ x, y, size, delay, dur }: {
  x: number; y: number; size: number; delay: number; dur: number;
}) {
  const my = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rise = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(my, { toValue: -100, duration: dur, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(op, { toValue: 0.7, duration: dur * 0.3, useNativeDriver: true }),
            Animated.timing(op, { toValue: 0, duration: dur * 0.5, useNativeDriver: true }),
          ]),
        ]),
      ]).start(() => {
        my.setValue(0);
        rise();
      });
    };
    rise();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: size / 2, backgroundColor: '#fff',
      opacity: op, transform: [{ translateY: my }],
    }} />
  );
}

// ══════════════════════════════════════════════════════
// MAIN SCREEN
// ══════════════════════════════════════════════════════
export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 30, useNativeDriver: true }).start();
    }, 500);

    Animated.loop(Animated.timing(logoRotate, { toValue: 1, duration: 25000, useNativeDriver: true })).start();
  }, []);

  const rotateInterp = logoRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const ROLE_CONFIG: Record<string, {
    icon: string; borderColor: string; tagBg: string; tagColor: string;
    bg1: string; bg2: string; bg3: string; shadow: string;
  }> = {
    citizen: {
      icon: 'person-outline', borderColor: '#10B981', tagBg: '#059669', tagColor: '#fff',
      bg1: '#ECFDF5', bg2: '#D1FAE5', bg3: '#6EE7B7', shadow: '#10B981',
    },
    agent: {
      icon: 'medkit-outline', borderColor: '#3B82F6', tagBg: '#2563EB', tagColor: '#fff',
      bg1: '#EFF6FF', bg2: '#DBEAFE', bg3: '#93C5FD', shadow: '#3B82F6',
    },
    authority: {
      icon: 'stats-chart-outline', borderColor: '#8B5CF6', tagBg: '#7C3AED', tagColor: '#fff',
      bg1: '#F5F3FF', bg2: '#EDE9FE', bg3: '#C4B5FD', shadow: '#8B5CF6',
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>

        {/* ══════ HERO ══════ */}
        <Animated.View style={[styles.hero, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
          {/* Base */}
          <View style={styles.bgBase} />

          {/* Organic blobs - fewer for performance */}
          <OrganicBlob x={-40} y={-20} size={180} color="rgba(20,184,166,0.25)" dur={6000} delay={0} />
          <OrganicBlob x={SCREEN_W - 120} y={40} size={140} color="rgba(16,185,129,0.18)" dur={7000} delay={400} />
          <OrganicBlob x={40} y={200} size={110} color="rgba(45,212,191,0.15)" dur={5500} delay={800} />
          <OrganicBlob x={SCREEN_W / 2 - 60} y={280} size={100} color="rgba(110,231,183,0.1)" dur={6500} delay={300} />

          {/* Floating dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <FloatingDot
              key={i}
              x={30 + (i * SCREEN_W) / 8}
              y={100 + Math.random() * 250}
              size={2 + Math.random() * 2}
              delay={i * 350}
              dur={3000 + Math.random() * 1500}
            />
          ))}

          {/* Waves at bottom */}
          <WaveLayer color="rgba(153,246,228,0.12)" height={100} speed={3500} delay={0} yOffset={12} />
          <WaveLayer color="rgba(20,184,166,0.10)" height={80} speed={4000} delay={600} yOffset={10} />
          <WaveLayer color="rgba(240,244,248,0.9)" height={60} speed={3000} delay={1200} yOffset={8} />

          {/* ── CONTENT ── */}
          <View style={styles.heroContent}>
            {/* Logo */}
            <View style={styles.logoSection}>
              <Animated.View style={[styles.logoRingOuter, { transform: [{ rotate: rotateInterp }] }]} />
              <View style={styles.logoGlow} />
              <Animated.View style={[styles.logoCircle, { transform: [{ scale: logoScale }] }]}>
                <Ionicons name="shield-checkmark" size={48} color="#fff" />
              </Animated.View>
            </View>

            <Text style={styles.title}>Guardian</Text>
            <Text style={styles.titleAccent}>Salud AI</Text>
            <Text style={styles.subtitle}>Sistema Inteligente de{'\n'}Vigilancia Epidemiológica</Text>

            {/* Feature bar */}
            <View style={styles.featureBar}>
              {[
                { icon: 'shield-checkmark', label: 'Protección' },
                { icon: 'hardware-chip', label: 'IA Avanzada' },
                { icon: 'wifi-outline', label: 'Offline' },
              ].map((f, i) => (
                <React.Fragment key={f.label}>
                  {i > 0 && <View style={styles.featureSep} />}
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name={f.icon as any} size={12} color="#fff" />
                    </View>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ══════ ROLE SELECTION ══════ */}
        <View style={styles.section}>
          <Animated.View style={[styles.sectionHead, { opacity: heroFade }]}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>¿Con qué rol vas a ingresar?</Text>
            </View>
            <Text style={styles.sectionSub}>Selecciona tu rol para continuar</Text>
          </Animated.View>

          <View style={styles.roleList}>
            {ROLE_OPTIONS.map((option, index) => {
              const cfg = ROLE_CONFIG[option.id] || ROLE_CONFIG.citizen;
              const a = useRef(new Animated.Value(0)).current;
              const sl = useRef(new Animated.Value(50)).current;
              const sc = useRef(new Animated.Value(0.92)).current;
              const ps = useRef(new Animated.Value(1)).current;
              const gw = useRef(new Animated.Value(0)).current;
              const shadowAnim = useRef(new Animated.Value(0)).current;
              const borderAnim = useRef(new Animated.Value(0)).current;

              useEffect(() => {
                Animated.parallel([
                  Animated.timing(a, { toValue: 1, duration: 600, delay: 600 + index * 150, useNativeDriver: true }),
                  Animated.spring(sl, { toValue: 0, friction: 7, tension: 50, delay: 600 + index * 150, useNativeDriver: true }),
                  Animated.spring(sc, { toValue: 1, friction: 7, tension: 50, delay: 600 + index * 150, useNativeDriver: true }),
                ]).start();
              }, []);

              const pIn = () => {
                Animated.parallel([
                  Animated.spring(ps, { toValue: 0.96, friction: 4, tension: 60, useNativeDriver: true }),
                  Animated.timing(gw, { toValue: 1, duration: 250, useNativeDriver: true }),
                  Animated.timing(shadowAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                  Animated.timing(borderAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                ]).start();
              };
              const pOut = () => {
                Animated.parallel([
                  Animated.spring(ps, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
                  Animated.timing(gw, { toValue: 0, duration: 350, useNativeDriver: true }),
                  Animated.timing(shadowAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
                  Animated.timing(borderAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
                ]).start();
              };

              const glowOp = gw.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] });
              const glowSc = gw.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
              const shadowOp = shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.06, 0.18] });
              const shadowR = shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 24] });
              const liftY = shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });

              return (
                <Animated.View key={option.id} style={{ opacity: a, transform: [{ translateY: sl }, { scale: sc }] }}>
                  {/* Glow behind card */}
                  <Animated.View style={[styles.cardGlow, {
                    backgroundColor: cfg.shadow,
                    opacity: glowOp,
                    transform: [{ scale: glowSc }],
                  }]} />

                  <Animated.View style={{
                    transform: [{ scale: ps }, { translateY: liftY }],
                    shadowColor: cfg.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: shadowOp,
                    shadowRadius: shadowR,
                    elevation: shadowAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 12] }),
                  }}>
                    <Pressable
                      style={[styles.card, { borderColor: cfg.shadow }]}
                      onPress={() => selectRole(option.id)}
                      onPressIn={pIn}
                      onPressOut={pOut}
                    >
                      {/* Background layers */}
                      <View style={[styles.cardBg1, { backgroundColor: cfg.bg1 }]} />
                      <View style={[styles.cardBg2, { backgroundColor: cfg.bg2 }]} />
                      <View style={[styles.cardBg3, { backgroundColor: cfg.bg3 }]} />

                      {/* White overlay for readability */}
                      <View style={styles.cardWhiteOverlay} />

                      <View style={styles.cardInner}>
                        {/* Icon */}
                        <View style={[styles.cardIcon, { backgroundColor: cfg.bg3, borderColor: cfg.shadow }]}>
                          <Ionicons name={cfg.icon as any} size={28} color={cfg.shadow} />
                        </View>

                        {/* Text */}
                        <View style={styles.cardText}>
                          <Text style={styles.cardTitle}>{option.title}</Text>
                          <Text style={styles.cardDesc}>{option.description}</Text>
                        </View>

                        {/* CTA button */}
                        <View style={[styles.cardCta, { backgroundColor: cfg.tagBg }]}>
                          <Text style={[styles.cardCtaText, { color: cfg.tagColor }]}>Entrar</Text>
                          <Ionicons name="arrow-forward" size={14} color={cfg.tagColor} />
                        </View>
                      </View>
                    </Pressable>
                  </Animated.View>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <View style={styles.footerRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.textMuted} />
            <Text style={styles.footerText}>Guardian Salud AI v1.0</Text>
          </View>
          <Text style={styles.footerSub}>Vigilancia epidemiológica para la Amazonía Peruana</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scrollContent: { paddingBottom: 40 },

  // ─── HERO ──────────────────────────────────────
  hero: {
    height: HERO_H,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0B5E53' },
  heroContent: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', zIndex: 10, paddingHorizontal: 24,
  },

  // Logo
  logoSection: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoRingOuter: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.25)',
  },
  logoGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.05)' },
  logoCircle: {
    width: 108, height: 108, borderRadius: 54,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },

  // Text
  title: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -0.5, textAlign: 'center', lineHeight: 38 },
  titleAccent: { fontSize: 34, fontWeight: '900', color: '#99F6E4', letterSpacing: -0.5, textAlign: 'center', lineHeight: 40, marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 20, marginBottom: 22 },

  // Feature bar
  featureBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 6 },
  featureIcon: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: { fontSize: 11, fontWeight: '700', color: '#fff' },
  featureSep: { width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 2 },

  // ─── SECTION ───────────────────────────────────
  section: { padding: 24 },
  sectionHead: { marginBottom: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDot: { width: 4, height: 20, borderRadius: 2, backgroundColor: '#0D6E66' },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  sectionSub: { fontSize: 13, color: '#64748B', marginTop: 6, marginLeft: 12 },

  // ─── CARDS ─────────────────────────────────────
  roleList: { gap: 16 },
  cardGlow: {
    position: 'absolute', top: -6, left: -6, right: -6, bottom: -6,
    borderRadius: 28, zIndex: 0,
  },
  card: {
    borderRadius: 22, overflow: 'hidden', borderWidth: 2,
    position: 'relative', zIndex: 1,
  },
  cardBg1: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
  cardBg2: { position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', borderBottomLeftRadius: 60, opacity: 0.4 },
  cardBg3: { position: 'absolute', bottom: 0, left: 0, width: '35%', height: '60%', borderTopRightRadius: 50, opacity: 0.35 },
  cardWhiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  cardInner: {
    flexDirection: 'row', alignItems: 'center', padding: 20, paddingLeft: 16, gap: 14,
    position: 'relative', zIndex: 2,
  },
  cardIcon: {
    width: 56, height: 56, borderRadius: 16, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardTitle: {
    fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 13, color: '#475569', lineHeight: 18,
  },
  cardCta: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
  },
  cardCtaText: { fontSize: 13, fontWeight: '700' },

  // ─── FOOTER ────────────────────────────────────
  footer: { alignItems: 'center', marginTop: 24, paddingHorizontal: 24 },
  footerLine: { width: 32, height: 3, borderRadius: 1.5, backgroundColor: '#CBD5E1', marginBottom: 18 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  footerSub: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
});
