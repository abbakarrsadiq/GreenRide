import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { Location } from '../../types';
import { LocationUtils } from '../../utils/locationUtils';

interface DestinationSearchInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: Location) => void;
  currentLocation?: Location;
}

export const DestinationSearchInput: React.FC<DestinationSearchInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onSelectLocation,
  currentLocation,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredLocations([]);
      setShowSuggestions(false);
    } else {
      const filtered = LocationUtils.searchLocations(value).slice(0, 5); // Limit to 5 results
      setFilteredLocations(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  }, [value]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showSuggestions ? Math.min(filteredLocations.length * 70, 350) : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showSuggestions, filteredLocations.length]);

  const handleFocus = () => {
    setIsFocused(true);
    if (value.trim() !== '' && filteredLocations.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSelectLocation = (location: Location) => {
    // First notify parent component with the location
    onSelectLocation(location);
    onChangeText(location.name || location.address);
    
    // Hide suggestions and blur input
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      handleSelectLocation(currentLocation);
    }
  };

  const LocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectLocation(item)}
      activeOpacity={0.7}
      delayPressIn={0}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons name="location" size={16} color={COLORS.primary} />
      </View>
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.suggestionAddress} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Input Field */}
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Ionicons name="search" size={20} color={COLORS.text.secondary} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.secondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={false}
          autoCapitalize="words"
          selectionColor={COLORS.gray[400]}
          underlineColorAndroid="transparent"
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onChangeText('');
              setShowSuggestions(false);
            }}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions Dropdown */}
      <Animated.View style={[styles.suggestionsContainer, { height: animatedHeight }]}>
        <FlatList
          data={filteredLocations}
          keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
          renderItem={({ item }) => <LocationItem item={item} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          ListHeaderComponent={
            currentLocation && value.trim() !== '' ? (
              <>
                <TouchableOpacity
                  style={[styles.suggestionItem, styles.currentLocationItem]}
                  onPress={handleUseCurrentLocation}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <View style={[styles.suggestionIcon, styles.currentLocationIcon]}>
                    <Ionicons name="locate" size={16} color={COLORS.white} />
                  </View>
                  <View style={styles.suggestionInfo}>
                    <Text style={[styles.suggestionName, styles.currentLocationText]}>
                      Use Current Location
                    </Text>
                    <Text style={styles.suggestionAddress} numberOfLines={1}>
                      {currentLocation.address}
                    </Text>
                  </View>
                </TouchableOpacity>
                {filteredLocations.length > 0 && (
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsHeaderText}>
                      {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
                    </Text>
                  </View>
                )}
              </>
            ) : filteredLocations.length > 0 ? (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsHeaderText}>
                  {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
                </Text>
              </View>
            ) : null
          }
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 9998,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inputContainerFocused: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
    paddingVertical: 0,
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
  },
  clearButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.xs,
    overflow: 'hidden',
    ...SHADOWS.lg,
    zIndex: 9999,
    elevation: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    backgroundColor: COLORS.white,
  },
  currentLocationItem: {
    backgroundColor: COLORS.surface,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  currentLocationIcon: {
    backgroundColor: COLORS.gray[500],
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  currentLocationText: {
    color: COLORS.text.primary,
  },
  suggestionAddress: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  resultsHeaderText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
});