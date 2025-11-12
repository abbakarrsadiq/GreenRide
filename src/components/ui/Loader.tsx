import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface LoaderProps {
  size?: 'small' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'large' }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.loaderBox, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size={size} color={colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});
