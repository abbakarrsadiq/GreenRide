import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Map is disabled for now - requires custom dev build
// Will show placeholder image instead
import { Button } from '../../components/ui/Button';
import { SearchableInput } from '../../components/ui/SearchableInput';
import { Loader } from '../../components/ui/Loader';
import { StatusModal } from '../../components/ui/StatusModal';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { LocationService } from '../../services/location';
import { Location, RideOption, MainTabParamList } from '../../types';
import { formatCurrency } from '../../utils';
import { LocationUtils } from '../../utils/locationUtils';
import { useTheme } from '../../hooks/useTheme';
import { ABUJA_LOCATIONS } from '../../data/locations';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const { height } = Dimensions.get('window');

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const RIDE_OPTIONS: RideOption[] = [
  {
    id: '1',
    type: 'GreenGo',
    name: 'GreenGo',
    description: 'Affordable eco-friendly rides',
    price: 2500,
    eta: '3 min',
    co2Saved: 0.5,
    passengers: 4,
    icon: '🚗',
  },
  {
    id: '2',
    type: 'GreenEV',
    name: 'GreenEV',
    description: 'Electric vehicles only',
    price: 3200,
    eta: '5 min',
    co2Saved: 0.8,
    passengers: 4,
    icon: '⚡',
  },
  {
    id: '3',
    type: 'GreenXL',
    name: 'GreenXL',
    description: 'Larger eco-friendly vehicles',
    price: 4500,
    eta: '4 min',
    co2Saved: 0.6,
    passengers: 6,
    icon: '🚐',
  },
];

const RIDE_TYPES: RideOption['type'][] = ['GreenGo', 'GreenEV', 'GreenXL'];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [selectedRideType, setSelectedRideType] = useState<RideOption['type']>('GreenGo');
  const { colors, isDarkMode } = useTheme();
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      } else {
        // Fallback to Area 1 Shopping Center
        setCurrentLocation(LocationUtils.getCurrentLocation());
      }
    } catch (error) {
      // Fallback to Area 1 Shopping Center
      setCurrentLocation(LocationUtils.getCurrentLocation());
    }
  }, []);

  const handleSelectDestination = useCallback((location: Location) => {
    setDestinationLocation(location);
    setDestination(location.name || location.address);
  }, []);

  const handleDestinationTextChange = useCallback((text: string) => {
    setDestination(text);
    if (text === '') {
      setDestinationLocation(null);
    }
  }, []);

  const handleConfirmRide = useCallback(() => {
    if (!destination.trim() || !destinationLocation) {
      setErrorMessage('Please select your destination to continue.');
      setShowErrorModal(true);
      return;
    }

    if (!currentLocation) {
      setErrorMessage('Unable to determine your location. Please enable location services.');
      setShowErrorModal(true);
      return;
    }

    if (
      currentLocation.latitude === destinationLocation.latitude &&
      currentLocation.longitude === destinationLocation.longitude
    ) {
      setErrorMessage('Pickup and destination cannot be the same location.');
      setShowErrorModal(true);
      return;
    }

    const selectedOption = RIDE_OPTIONS.find(option => option.type === selectedRideType);
    if (!selectedOption) return;

    navigation.navigate('RideConfirmation', {
      rideOption: selectedOption,
      pickup: currentLocation,
      destination: destinationLocation,
    });
  }, [destination, destinationLocation, currentLocation, selectedRideType, navigation]);

  const selectedRideOption = useMemo(() => {
    return RIDE_OPTIONS.find(option => option.type === selectedRideType);
  }, [selectedRideType]);

  const RideOptionCard: React.FC<{ option: RideOption; isSelected: boolean }> = React.memo(({
    option,
    isSelected,
  }) => (
    <TouchableOpacity
      style={[
        styles.rideCard,
        { backgroundColor: colors.background },
        isSelected && styles.selectedRideCard,
      ]}
      onPress={() => setSelectedRideType(option.type)}
    >
      <View style={styles.rideCardContent}>
        <View style={[styles.rideIcon, { backgroundColor: colors.gray[800] }]}>
          <Text style={styles.rideIconText}>{option.icon}</Text>
        </View>
        <View style={styles.rideInfo}>
          <Text style={[styles.rideName, { color: colors.text.primary }]}>{option.name}</Text>
          <Text style={[styles.rideEta, { color: colors.text.secondary }]}>ETA: {option.eta}</Text>
        </View>
        <View style={styles.ridePrice}>
          <Text style={[styles.ridePriceText, { color: colors.text.primary }]}>{formatCurrency(option.price)}</Text>
          <Text style={[styles.rideCo2, { color: colors.primary }]}>-{option.co2Saved}kg CO₂</Text>
        </View>
      </View>
    </TouchableOpacity>
  ));

  const renderMap = useCallback(() => {
    // Show map placeholder - react-native-maps requires custom dev build
    if (isDarkMode) {
      // Dark mode - show solid color with overlay
      return (
        <View style={[styles.map, styles.webMapPlaceholder, { backgroundColor: colors.surface }]}>
          <View style={[styles.mapOverlay, { backgroundColor: colors.background + 'F0' }]}>
            <Ionicons name="map" size={48} color={colors.primary} />
            <Text style={[styles.mapOverlayText, { color: colors.text.primary }]}>Map View</Text>
            <Text style={[styles.mapOverlaySubtext, { color: colors.text.secondary }]}>
              {currentLocation.name || currentLocation.address}
            </Text>
          </View>
        </View>
      );
    }

    // Light mode - show map image
    return (
      <ImageBackground
        source={{
          uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC76qC-3KmRN1EbsralCA1vo4J3OtMIUr5nc9y9GA0fcWscPew2dfy9Dd6OEbFZLHzJriAkVJ-ZjUovzChhaFzLDDHUHaFxrEc25UzPW2JnRMraFjCQJvODMxHBsz7kenQ6CXzl-ABRR5iS_SbN0z6NK9lhRlea2jGrZ5G7XD5HVKDGD2-I6ckyWFapnec6zwipw9BAQL3Ktw5eN0QvIkjQ8YjZBrjtX5Znbvyv5nj1NOh6wV-eL5p22CN6nuNUZVXP9NS4Agn05g"
        }}
        style={[styles.map, styles.webMapPlaceholder]}
        resizeMode="cover"
      >
      </ImageBackground>
    );
  }, [isDarkMode, colors, currentLocation]);

  if (!currentLocation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {renderMap()}

        {/* Menu Button */}
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="menu" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Location Button */}
        <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: colors.surface }]}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.gray[300] }]} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Location */}
          <View style={styles.locationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Current Location</Text>
            <View style={styles.locationItem}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.text.secondary }]}>{currentLocation.address}</Text>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.destinationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Destination</Text>
            <SearchableInput
              placeholder="Where to?"
              value={destination}
              onChangeText={handleDestinationTextChange}
              onSelectLocation={handleSelectDestination}
              locations={ABUJA_LOCATIONS}
              label="Select Destination"
            />
          </View>

          {/* Ride Type Selector */}
          <View style={styles.rideTypeSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rideTypeScroll}
            >
              {RIDE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.rideTypeButton,
                    { backgroundColor: selectedRideType === type ? colors.primary : colors.surface },
                    selectedRideType === type && styles.selectedRideTypeButton,
                  ]}
                  onPress={() => setSelectedRideType(type)}
                >
                  <Text
                    style={[
                      styles.rideTypeText,
                      { color: selectedRideType === type ? colors.white : colors.text.primary },
                      selectedRideType === type && styles.selectedRideTypeText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Available Rides */}
          <View style={styles.ridesSection}>
            {selectedRideOption && (
              <RideOptionCard
                key={selectedRideOption.id}
                option={selectedRideOption}
                isSelected={true}
              />
            )}
          </View>

          {/* Selected Destination Preview */}
          {destinationLocation && (
            <View style={[styles.selectedDestinationContainer, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
              <View style={styles.selectedDestinationHeader}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.selectedDestinationTitle, { color: colors.success }]}>Destination Selected</Text>
              </View>
              <Text style={[styles.selectedDestinationText, { color: colors.text.primary }]}>
                {destinationLocation.name || destinationLocation.address}
              </Text>
            </View>
          )}

          {/* Confirm Button */}
          <Button
            title={destinationLocation ? `Book ${selectedRideType}` : `Select Destination First`}
            onPress={handleConfirmRide}
            fullWidth
            disabled={!destinationLocation}
            style={styles.confirmButton}
          />
        </ScrollView>
      </View>

      {/* Error Modal */}
      <StatusModal
        visible={showErrorModal}
        type="error"
        title="Cannot Continue"
        message={errorMessage}
        primaryButtonText="OK"
        onClose={() => setShowErrorModal(false)}
      />
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  locationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: height * 0.6,
    ...SHADOWS.xl,
    zIndex: 1,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'center',
    marginBottom: 14,
  },
  locationSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: 6,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  locationText: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginLeft: 8,
  },
  destinationSection: {
    marginBottom: SPACING.xl,
  },
  rideTypeSection: {
    marginBottom: SPACING.lg,
    zIndex: 1,
  },
  rideTypeScroll: {
    paddingHorizontal: SPACING.xs,
  },
  rideTypeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRideTypeButton: {
    ...SHADOWS.sm,
  },
  rideTypeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  selectedRideTypeText: {
  },
  ridesSection: {
    marginBottom: SPACING.lg,
    zIndex: 1,
  },
  rideCard: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  selectedRideCard: {
    ...SHADOWS.lg,
  },
  rideCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  rideIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rideIconText: {
    fontSize: 20,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: 3,
  },
  rideEta: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  ridePrice: {
    alignItems: 'flex-end',
  },
  ridePriceText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 3,
  },
  rideCo2: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  selectedDestinationContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  selectedDestinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  selectedDestinationTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginLeft: SPACING.xs,
  },
  selectedDestinationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  confirmButton: {
    marginTop: 16,
    minHeight: 50,
  },
  webMapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    margin: SPACING.xl,
  },
  mapOverlayText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginTop: SPACING.md,
  },
  mapOverlaySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});