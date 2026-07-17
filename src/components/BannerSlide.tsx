import React from 'react';
import { View, Text, StyleSheet, Image, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BannerSlideProps {
  imageSource?: ImageSourcePropType;
  gradient?: string[];
  icon: string;
  iconSize?: number;
  tag: string;
  title: string;
  subtitle: string;
}

export function BannerSlide({ imageSource, gradient, icon, iconSize = 28, tag, title, subtitle }: BannerSlideProps) {
  const hasImage = !!imageSource;

  return (
    <View style={styles.container}>
      {hasImage ? (
        <Image source={imageSource} style={styles.bgImage} resizeMode="cover" />
      ) : (
        <View style={[styles.gradientBg, { backgroundColor: gradient?.[0] ?? '#0D9488' }]}>
          {gradient && <View style={[styles.gradientCircle, { backgroundColor: gradient[1] }]} />}
          {gradient && <View style={[styles.gradientCircle2, { backgroundColor: gradient[2] }]} />}
        </View>
      )}

      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.tagRow}>
          <View style={styles.tagDot} />
          <Text style={styles.tag}>{tag}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.iconWrap}>
        <Ionicons name={icon as any} size={iconSize} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.3,
  },
  gradientCircle2: {
    position: 'absolute',
    right: 50,
    bottom: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.25,
  },
  content: {
    padding: 22,
    paddingBottom: 28,
    zIndex: 1,
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginTop: 2,
  },
  iconWrap: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
});
