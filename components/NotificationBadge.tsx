import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '../contexts/NotificationContext';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  showZero?: boolean;
  maxCount?: number;
  style?: any;
}

export default function NotificationBadge({
  size = 'medium',
  color = '#ef4444',
  textColor = '#fff',
  showZero = false,
  maxCount = 99,
  style,
}: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  if (!showZero && unreadCount === 0) {
    return null;
  }

  const displayCount =
    unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  const sizeStyles = {
    small: {
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      fontSize: 10,
      paddingHorizontal: 4,
    },
    medium: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      fontSize: 12,
      paddingHorizontal: 6,
    },
    large: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      fontSize: 14,
      paddingHorizontal: 8,
    },
  };

  const currentSizeStyles = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          minWidth: currentSizeStyles.minWidth,
          height: currentSizeStyles.height,
          borderRadius: currentSizeStyles.borderRadius,
          backgroundColor: color,
          paddingHorizontal: currentSizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            fontSize: currentSizeStyles.fontSize,
            color: textColor,
          },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 1,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    lineHeight: undefined, // Let the system handle line height
  },
});
