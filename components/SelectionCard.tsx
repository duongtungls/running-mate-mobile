import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
  showIcon?: boolean;
}

export default function SelectionCard({
  title,
  description,
  icon: IconComponent,
  isSelected,
  onPress,
  color = '#22c55e',
  showIcon = false,
}: SelectionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && {
          backgroundColor: color + '20',
          borderColor: color,
        },
      ]}
      onPress={onPress}
    >
      {showIcon && IconComponent && (
        <View style={[styles.icon, { backgroundColor: color + '20' }]}>
          <IconComponent
            size={20}
            color={isSelected ? color : 'rgba(255,255,255,0.8)'}
          />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, isSelected && { color: color }]}>
          {title}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <View style={[styles.selectedDot, { backgroundColor: color }]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
