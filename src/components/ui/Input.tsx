import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: 'default' | 'borderless';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  variant = 'borderless',
  keyboardType,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Handle number input specifics
  const processedProps = { ...props };
  
  // Remove default value of "0" for number inputs
  if (keyboardType === 'numeric' || keyboardType === 'number-pad' || keyboardType === 'decimal-pad') {
    if (processedProps.defaultValue === '0' || processedProps.value === '0') {
      processedProps.defaultValue = '';
      if ('value' in processedProps) {
        processedProps.value = '';
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.({} as any);
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: SPACING.md,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 42,
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: COLORS.surface,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };

    return {
      ...baseStyle,
      backgroundColor: isFocused ? COLORS.white : COLORS.surface,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      // Remove all possible borders and outlines on all platforms
      ...(Platform.OS === 'web' && {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      } as any),
    };
  };

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.primary,
    paddingHorizontal: leftIcon || rightIcon ? SPACING.xs : 0,
    borderWidth: 0,
    borderColor: 'transparent',
    outline: 'none',
    // Remove all possible borders and outlines on all platforms
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      backgroundColor: 'transparent',
      border: 'none',
      borderWidth: 0,
      boxShadow: 'none',
      outline: 'none',
    } as any),
  });

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={COLORS.gray[500]}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          ref={inputRef}
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={COLORS.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoComplete="off"
          selectionColor={COLORS.gray[400]}
          underlineColorAndroid="transparent"
          {...processedProps}
          {...(Platform.OS === 'web' && {
            // Web-specific props to prevent autofill and borders
            autoComplete: 'new-password',
            'data-form-type': 'other',
          } as any)}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={rightIcon}
              size={18}
              color={COLORS.gray[500]}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  error: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});