import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface PlaceholderScreenProps {
  navigation?: any;
  route?: any;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ 
  navigation,
  route 
}) => {
  const screenName = route?.name || 'Feature';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        {navigation?.canGoBack() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        )}

        {/* Icon */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.iconContainer}
        >
          <Ionicons name="construct" size={48} color={COLORS.white} />
        </LinearGradient>

        {/* Title */}
        <Text style={styles.title}>
          {screenName} In Progress
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          We're working hard to bring you this feature. 
          {'\n'}Check back soon for updates!
        </Text>

        {/* Coming Soon Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
    marginBottom: SPACING.xl,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
    marginLeft: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.white,
  },
});