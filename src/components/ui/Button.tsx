import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyle = getButtonStyle(variant, size, fullWidth, disabled);
  const textStyleComputed = getTextStyle(variant, size);

  const handlePress = () => {
    if (!loading && !disabled) {
      onPress();
    }
  };

  const ButtonContent = () => (
    <TouchableOpacity
      style={[buttonStyle.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <Text style={[textStyleComputed, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={[buttonStyle.container, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.gradientButton}
          onPress={handlePress}
          activeOpacity={0.8}
          disabled={disabled || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={[textStyleComputed, textStyle]}>{title}</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return <ButtonContent />;
};

const getButtonStyle = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  fullWidth: boolean,
  disabled: boolean
): { container: ViewStyle } => {
  const baseStyle: ViewStyle = {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const sizeStyles = {
    sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, minHeight: 36 },
    md: { paddingHorizontal: SPACING.lg, paddingVertical: 10, minHeight: 44 },
    lg: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, minHeight: 50 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? COLORS.gray[300] : COLORS.primary,
      ...SHADOWS.sm,
    },
    secondary: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.primary,
      ...SHADOWS.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? COLORS.gray[300] : COLORS.gray[400],
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return {
    container: {
      ...baseStyle,
      ...sizeStyles[size!],
      ...variantStyles[variant!],
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
    },
  };
};

const getTextStyle = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size']
): TextStyle => {
  const baseStyle: TextStyle = {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    textAlign: 'center',
  };

  const sizeStyles = {
    sm: { fontSize: TYPOGRAPHY.fontSize.sm },
    md: { fontSize: TYPOGRAPHY.fontSize.base },
    lg: { fontSize: TYPOGRAPHY.fontSize.lg },
  };

  const variantTextStyles = {
    primary: { color: COLORS.white },
    secondary: { color: COLORS.primary },
    outline: { color: COLORS.text.primary },
    ghost: { color: COLORS.primary },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size!],
    ...variantTextStyles[variant!],
  };
};

const styles = StyleSheet.create({
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});