import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { Button } from '../components/ui';
import { colors, spacing, typography, borderRadius, shadows } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import { UserStatsService } from '../services/userStats';
import { User } from '../types';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await UserStatsService.getConsistentUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray[50] }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load user data.</Text>
      </SafeAreaView>
    );
  }

  const { level, title: levelTitle, nextLevelPoints } = UserStatsService.getUserLevel(user.ecoPoints);
  const achievements = UserStatsService.getAchievements(user);
  const formattedStats = UserStatsService.formatStats(user);

  const StatCard = ({ title, value, subtitle, icon }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
  }) => (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flex: 1,
        alignItems: 'center',
        ...shadows.md,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: spacing.xs }}>{icon}</Text>
      <Text style={{
        fontSize: typography.sizes.xl,
        fontWeight: 'bold',
        color: colors.primary[500],
        marginBottom: spacing.xs,
      }}>
        {value}
      </Text>
      <Text style={{
        fontSize: typography.sizes.sm,
        color: colors.gray[600],
        textAlign: 'center',
        flexWrap: 'nowrap',
      }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: typography.sizes.xs,
          color: colors.gray[500],
          textAlign: 'center',
          marginTop: spacing.xs,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.sm,
        opacity: achievement.earned ? 1 : 0.6,
      }}
    >
      <Text style={{
        fontSize: 32,
        marginRight: spacing.md,
      }}>
        {achievement.icon || '🏆'}
      </Text>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.sizes.base,
          fontWeight: '600',
          color: colors.gray[900],
          marginBottom: spacing.xs,
        }}>
          {achievement.title}
        </Text>
        <Text style={{
          fontSize: typography.sizes.sm,
          color: colors.gray[600],
        }}>
          {achievement.description}
        </Text>
      </View>
      
      {achievement.earned && (
        <Text style={{
          fontSize: 20,
          color: colors.primary[500],
        }}>
          ✓
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gray[50]} />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
        }}>
          <Text style={{
            fontSize: typography.sizes['3xl'],
            fontWeight: 'bold',
            color: colors.gray[900],
            marginBottom: spacing.xs,
          }}>
            {user.name}
          </Text>
          
          <Text style={{
            fontSize: typography.sizes.base,
            color: colors.gray[600],
          }}>
            Track your eco-friendly impact
          </Text>
        </View>

        {/* Level Progress */}
        <View
          style={{
            backgroundColor: colors.primary[500],
            marginHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...shadows.md,
          }}
        >
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: 'bold',
            color: colors.white,
            marginBottom: spacing.sm,
          }}>
            {levelTitle}
          </Text>
          
          <Text style={{
            fontSize: typography.sizes.base,
            color: colors.primary[100],
            marginBottom: spacing.md,
          }}>
            {user.ecoPoints.toLocaleString()} / {nextLevelPoints.toLocaleString()} points
          </Text>
          
          <View style={{
            backgroundColor: colors.primary[400],
            height: 8,
            borderRadius: borderRadius.sm,
            overflow: 'hidden',
          }}>
            <View style={{
              backgroundColor: colors.white,
              height: '100%',
              width: `${(user.ecoPoints / nextLevelPoints) * 100}%`,
              borderRadius: borderRadius.sm,
            }} />
          </View>
        </View>

        {/* Stats */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Your Impact
          </Text>
          
          <View style={{
            flexDirection: 'row',
            gap: spacing.md,
            marginBottom: spacing.md,
          }}>
            <StatCard
              title="CO₂ Saved"
              value={formattedStats.co2Saved}
              icon="🌍"
            />
            <StatCard
              title="Total Rides"
              value={formattedStats.totalRides}
              icon="🚗"
            />
          </View>
          
          <StatCard
            title="Reward Points"
            value={formattedStats.ecoPoints}
            subtitle="Use for discounts & rewards"
            icon="⭐"
          />
        </View>

        {/* Achievements */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Achievements
          </Text>
          
          <FlatList
            data={achievements}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => <AchievementCard achievement={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Settings */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginTop: spacing.lg,
          marginBottom: spacing.xl,
        }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Settings
          </Text>
          
          <Button
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            onPress={toggleTheme}
            variant="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;