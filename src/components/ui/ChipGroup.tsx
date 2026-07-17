import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ChipOption<T extends string = string> {
  id: T;
  label: string;
}

interface ChipGroupProps<T extends string = string> {
  options: ChipOption<T>[];
  selected: T | T[] | null;
  onSelect: (id: T) => void;
  multi?: boolean;
  color?: string;
}

export function ChipGroup<T extends string = string>({
  options,
  selected,
  onSelect,
  multi = false,
  color = colors.primary,
}: ChipGroupProps<T>) {
  const isSelected = (id: T): boolean => {
    if (multi && Array.isArray(selected)) return selected.includes(id);
    return selected === id;
  };

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = isSelected(opt.id);
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
          >
            <Text style={[styles.text, active && { color: '#fff' }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
});
