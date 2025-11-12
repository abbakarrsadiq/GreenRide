import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../ui/Input';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { Location } from '../../types';
import { LocationUtils } from '../../utils/locationUtils';

interface LocationSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  title: string;
  placeholder: string;
  currentLocation?: Location;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  visible,
  onClose,
  onSelectLocation,
  title,
  placeholder,
  currentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(() => 
    LocationUtils.getPopularLocations()
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Show popular locations when no search query
      setFilteredLocations(LocationUtils.getPopularLocations());
    } else {
      // Use enhanced search functionality
      const filtered = LocationUtils.searchLocations(searchQuery);
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery('');
    onClose();
  };

  const LocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
    >
      <View style={styles.locationIcon}>
        <Ionicons name="location" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            variant="default"
            autoFocus
          />
        </View>

        {/* Current Location Option */}
        {currentLocation && (
          <View style={styles.currentLocationSection}>
            <TouchableOpacity
              style={styles.currentLocationItem}
              onPress={() => handleSelectLocation(currentLocation)}
            >
              <View style={styles.currentLocationIcon}>
                <Ionicons name="locate" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.currentLocationText}>Use Current Location</Text>
                <Text style={styles.locationAddress}>{currentLocation.address}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {searchQuery.trim() === '' 
              ? 'Popular locations' 
              : `${filteredLocations.length} location${filteredLocations.length !== 1 ? 's' : ''} found`
            }
          </Text>
          
          <FlatList
            data={filteredLocations}
            keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
            renderItem={({ item }) => <LocationItem item={item} />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  currentLocationSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  currentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  currentLocationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  resultsTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginVertical: SPACING.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
  },
});