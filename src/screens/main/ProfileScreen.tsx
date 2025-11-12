import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { UserStatsService } from '../../services/userStats';
import { User } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const loadUserData = useCallback(async () => {
    const currentUser = await UserStatsService.getConsistentUserData();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      ToastService.success('Logged out successfully');
      navigation.navigate('Auth');
    } catch (error) {
      ToastService.error('Failed to logout');
    }
  }, [navigation]);

  const handleMenuPress = useCallback((item: string) => {
    switch (item) {
      case 'Payment Methods':
        navigation.navigate('PaymentMethods');
        break;
      case 'Ride History':
        navigation.navigate('History');
        break;
      default:
        ToastService.info(`${item} coming soon!`);
    }
  }, [navigation]);

  const userLevel = useMemo(() => {
    if (!user) return null;
    return UserStatsService.getUserLevel(user.ecoPoints);
  }, [user]);

  const StatCard = useCallback(({ icon, title, value, subtitle }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Ionicons name={icon} size={24} color={colors.text.primary} />
      <Text style={[styles.statTitle, { color: colors.text.secondary }]}>{title}</Text>
      <Text style={[styles.statValue, { color: colors.text.primary }]} numberOfLines={1}>{value}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>}
    </View>
  ), [colors]);

  const MenuItem = useCallback(({ icon, title, onPress, showArrow = true }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.menuTitle, { color: colors.text.primary }]}>{title}</Text>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      )}
    </TouchableOpacity>
  ), [colors]);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profile & Rewards</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
          <Avatar name={user.name} size="xl" />
          <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.text.secondary }]}>{user.email}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              icon="car-outline"
              title="Total Rides"
              value={user.totalRides.toString()}
            />
            <StatCard
              icon="leaf-outline"
              title="CO2 Saved"
              value={`${user.co2Saved} kg`}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard
              icon="trophy-outline"
              title="EcoPoints"
              value={user.ecoPoints.toLocaleString()}
            />
            <StatCard
              icon="star-outline"
              title="Level"
              value={userLevel?.title || ''}
              subtitle={`Level ${userLevel?.level || 0}`}
            />
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            onPress={() => handleMenuPress('Payment Methods')}
          />
          
          <MenuItem
            icon="time-outline"
            title="Ride History"
            onPress={() => handleMenuPress('Ride History')}
          />
          
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => handleMenuPress('Help & Support')}
          />
          
          <MenuItem
            icon="people-outline"
            title="Invite Friends"
            onPress={() => handleMenuPress('Invite Friends')}
          />
          
          {/* Dark Mode Toggle */}
          <View style={[styles.menuItem, { backgroundColor: colors.background }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
              <Ionicons name={isDarkMode ? "moon" : "moon-outline"} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuTitle, { color: colors.text.primary }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="primary"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: SPACING.lg,
  },

  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  statSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: SPACING.xs,
  },
  menuSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  logoutSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});