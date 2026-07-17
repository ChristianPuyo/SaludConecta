import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 4000;

interface AutoCarouselProps {
  items: React.ReactNode[];
  height?: number;
  style?: ViewStyle;
  onIndexChange?: (index: number) => void;
}

export function AutoCarousel({ items, height = 170, style, onIndexChange }: AutoCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      indexRef.current = next;
      setActiveIndex(next);
      onIndexChange?.(next);
    }, AUTO_SCROLL_INTERVAL);
  }, [items.length, onIndexChange]);

  useEffect(() => {
    if (items.length > 1) startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length, startAutoScroll]);

  const handleScrollBegin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleScrollEnd = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    indexRef.current = idx;
    setActiveIndex(idx);
    onIndexChange?.(idx);
    if (items.length > 1) startAutoScroll();
  };

  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { height }, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
      >
        {items.map((item, i) => (
          <View key={i} style={[styles.slide, { width: SCREEN_WIDTH, height }]}>
            {item}
          </View>
        ))}
      </ScrollView>

      {items.length > 1 && (
        <View style={styles.dotsRow}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  slide: {
    overflow: 'hidden',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 18,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
