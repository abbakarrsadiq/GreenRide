import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { getInitials } from '../../utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const SIZES = {
  sm: { width: 32, height: 32, fontSize: TYPOGRAPHY.fontSize.sm },
  md: { width: 48, height: 48, fontSize: TYPOGRAPHY.fontSize.base },
  lg: { width: 64, height: 64, fontSize: TYPOGRAPHY.fontSize.lg },
  xl: { width: 80, height: 80, fontSize: TYPOGRAPHY.fontSize.xl },
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  style,
}) => {
  const sizeStyle = SIZES[size];
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyle.width,
          height: sizeStyle.height,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
            color: textColor,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    textAlign: 'center',
  },
});