import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
  arrowDirection?: 'right' | 'left';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function OnboardingButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  showArrow = false,
  arrowDirection = 'right',
  style,
  textStyle,
}: OnboardingButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, style];

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          styles.primaryButton,
          disabled && styles.disabledButton,
        ];
      case 'secondary':
        return [
          ...baseStyle,
          styles.secondaryButton,
          disabled && styles.disabledButton,
        ];
      case 'outline':
        return [
          ...baseStyle,
          styles.outlineButton,
          disabled && styles.disabledButton,
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.buttonText, textStyle];

    switch (variant) {
      case 'primary':
        return [
          ...baseTextStyle,
          styles.primaryText,
          disabled && styles.disabledText,
        ];
      case 'secondary':
        return [
          ...baseTextStyle,
          styles.secondaryText,
          disabled && styles.disabledText,
        ];
      case 'outline':
        return [
          ...baseTextStyle,
          styles.outlineText,
          disabled && styles.disabledText,
        ];
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
    >
      {showArrow && arrowDirection === 'left' && (
        <ArrowLeft
          size={20}
          color={disabled ? 'rgba(255,255,255,0.5)' : '#fff'}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
      {showArrow && arrowDirection === 'right' && (
        <ArrowRight
          size={20}
          color={disabled ? 'rgba(255,255,255,0.5)' : '#fff'}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
    borderWidth: 1,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#fff',
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
