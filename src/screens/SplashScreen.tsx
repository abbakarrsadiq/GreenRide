import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme/index';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      (navigation as any).navigate('Main');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[500]} />
      
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 48,
          marginBottom: spacing.md,
        }}>
          🌱
        </Text>
        
        <Text style={{
          fontSize: typography.sizes['3xl'],
          fontWeight: 'bold',
          color: colors.white,
          marginBottom: spacing.sm,
        }}>
          GreenRide
        </Text>
        
        <Text style={{
          fontSize: typography.sizes.lg,
          color: colors.primary[100],
          textAlign: 'center',
          paddingHorizontal: spacing.xl,
        }}>
          Eco-friendly rides for a sustainable future
        </Text>
      </View>
      
      <View
        style={{
          position: 'absolute',
          bottom: spacing['3xl'],
        }}
      >
        <Text style={{
          fontSize: typography.sizes.sm,
          color: colors.primary[200],
        }}>
          Connecting you to green transportation
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;