import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { formatCurrency } from '../../utils';
import { RideHistoryService } from '../../services/rideHistory';
import { RideHistoryItem } from '../../data/rideHistory';
import { useTheme } from '../../hooks/useTheme';
import { Loader } from '../../components/ui/Loader';

interface HistoryScreenProps {
  navigation: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<RideHistoryItem[]>([]);
  const [totalRides, setTotalRides] = useState(0);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const loadHistory = useCallback(async () => {
    try {
      const history = await RideHistoryService.getRideHistory();
      const stats = await RideHistoryService.getRideStats();
      setRideHistory(history);
      setFilteredHistory(history);
      setTotalRides(stats.totalRides);
      setTotalCO2Saved(stats.co2Saved);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredHistory(rideHistory);
    } else {
      setFilteredHistory(rideHistory.filter(ride => ride.status === selectedFilter));
    }
  }, [selectedFilter, rideHistory]);

  const getVehicleIcon = useCallback((type: string) => {
    switch (type) {
      case 'GreenEV':
        return '⚡';
      case 'GreenLuxe':
        return '🚙';
      case 'GreenXL':
        return '🚐';
      default:
        return '🚗';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }, []);

  const FilterButton = useCallback(({ filter, title }: { filter: typeof selectedFilter; title: string }) => {
    const isActive = selectedFilter === filter;
    const gradientColors: [string, string] = isActive ? [colors.primary, colors.primaryDark] : [colors.gray[100], colors.gray[100]];

    return (
      <TouchableOpacity
        onPress={() => setSelectedFilter(filter)}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.filterButton}
        >
          <Text style={[styles.filterButtonText, { color: isActive ? colors.white : colors.text.secondary }, isActive && styles.activeFilterButtonText]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [selectedFilter, colors]);

  const RideHistoryCard = useCallback(({ item }: { item: RideHistoryItem }) => (
    <TouchableOpacity style={[styles.rideCard, { backgroundColor: colors.surface }]}>
      <View style={styles.rideCardHeader}>
        <View style={styles.rideTypeContainer}>
          <Text style={styles.vehicleIcon}>{getVehicleIcon(item.type)}</Text>
          <View>
            <Text style={[styles.rideType, { color: colors.text.primary }]}>{item.type}</Text>
            <Text style={[styles.rideDate, { color: colors.text.secondary }]}>{formatDate(item.date)} • {item.time}</Text>
          </View>
        </View>
        
        <View style={styles.rideStatus}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'completed' ? colors.success + '20' : colors.error + '20' },
            item.status === 'completed' ? styles.completedBadge : styles.cancelledBadge
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'completed' ? colors.success : colors.error },
              item.status === 'completed' ? styles.completedText : styles.cancelledText
            ]}>
              {item.status === 'completed' ? 'Completed' : 'Cancelled'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeItem}>
          <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.routeText, { color: colors.text.primary }]} numberOfLines={1}>{item.from}</Text>
        </View>
        
        <View style={[styles.routeLine, { backgroundColor: colors.gray[300] }]} />
        
        <View style={styles.routeItem}>
          <View style={[styles.routeDot, styles.destinationDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.routeText, { color: colors.text.primary }]} numberOfLines={1}>{item.to}</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.rideDetails}>
          <Text style={[styles.ridePrice, { color: colors.text.primary }]}>{formatCurrency(item.price)}</Text>
          <Text style={[styles.co2Saved, { color: colors.primary }]}>🌱 {item.co2Saved}kg CO₂ saved</Text>
        </View>
        
        {item.status === 'completed' && item.rating && (
          <View style={[styles.ratingContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.text.primary }]}>{item.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ), [colors, formatDate, getVehicleIcon]);

  const totalSpent = useMemo(() => rideHistory
    .filter(ride => ride.status === 'completed')
    .reduce((sum, ride) => sum + ride.price, 0), [rideHistory]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Ride History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.statsCard}
          >
            <Text style={[styles.statsTitle, { color: colors.white }]}>Your Impact</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.white }]}>{totalRides}</Text>
                <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>Rides</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.white }]}>{formatCurrency(totalSpent)}</Text>
                <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.white }]}>{totalCO2Saved.toFixed(1)}kg</Text>
                <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>CO₂ Saved</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterContainer}>
              <FilterButton filter="all" title="All Rides" />
              <FilterButton filter="completed" title="Completed" />
              <FilterButton filter="cancelled" title="Cancelled" />
            </View>
          </ScrollView>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'Ride' : 'Rides'}
          </Text>
          
          {filteredHistory.length > 0 ? (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RideHistoryCard item={item} />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <Ionicons name="car-sport-outline" size={48} color={colors.gray[300]} />
              <Text style={[styles.emptyListTitle, { color: colors.text.secondary }]}>No rides found</Text>
              <Text style={[styles.emptyListSubtitle, { color: colors.text.tertiary }]}>
                There are no {selectedFilter} rides to show.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  placeholder: {
    width: 40,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  filterSection: {
    marginBottom: SPACING.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  inactiveFilterButton: {
  },
  filterButtonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  activeFilterButtonText: {
  },
  historySection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.md,
  },
  rideCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  rideType: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.xs,
  },
  rideDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  rideStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  completedBadge: {
  },
  cancelledBadge: {
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  completedText: {
  },
  cancelledText: {
  },
  routeContainer: {
    marginBottom: SPACING.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  destinationDot: {
  },
  routeLine: {
    width: 2,
    height: 16,
    marginLeft: 3,
    marginVertical: SPACING.xs,
  },
  routeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideDetails: {
    flex: 1,
  },
  ridePrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.xs,
  },
  co2Saved: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginLeft: SPACING.xs,
  },
  emptyListContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    minHeight: 200,
    justifyContent: 'center',
  },
  emptyListTitle: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  emptyListSubtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});