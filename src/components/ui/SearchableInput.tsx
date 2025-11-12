import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { Location } from '../../types';

interface SearchableInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: Location) => void;
  locations: Location[];
  label?: string;
}

export const SearchableInput: React.FC<SearchableInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onSelectLocation,
  locations,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const inputRef = useRef<TextInput>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery(value);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    onChangeText(location.name || location.address);
    handleClose();
  };

  const handleManualInput = () => {
    onChangeText(searchQuery);
    handleClose();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.inputContainer, { backgroundColor: colors.surface }]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={18} color={colors.gray[500]} style={styles.icon} />
        <Text
          style={[
            styles.inputText,
            { color: value ? colors.text.primary : colors.gray[400] },
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.gray[500]} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border.light }]}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                {label || 'Select Destination'}
              </Text>
              <View style={styles.placeholder} />
            </View>

            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
              <Ionicons name="search" size={20} color={colors.gray[500]} style={styles.searchIcon} />
              <TextInput
                ref={inputRef}
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder="Search or type destination..."
                placeholderTextColor={colors.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleManualInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>

            {/* Results List */}
            <FlatList
              data={filteredLocations}
              keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.locationItem, { borderBottomColor: colors.border.light }]}
                  onPress={() => handleSelectLocation(item)}
                >
                  <View style={[styles.locationIconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.locationInfo}>
                    {item.name && (
                      <Text style={[styles.locationName, { color: colors.text.primary }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                    )}
                    <Text style={[styles.locationAddress, { color: colors.text.secondary }]} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={colors.gray[300]} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    No locations found
                  </Text>
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      style={[styles.useInputButton, { backgroundColor: colors.primary }]}
                      onPress={handleManualInput}
                    >
                      <Text style={[styles.useInputButtonText, { color: colors.white }]}>
                        Use "{searchQuery}"
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />

            {/* Use Custom Input Button */}
            {searchQuery.length > 0 && filteredLocations.length > 0 && (
              <View style={[styles.bottomAction, { backgroundColor: colors.surface, borderTopColor: colors.border.light }]}>
                <TouchableOpacity
                  style={[styles.customInputButton, { backgroundColor: colors.background }]}
                  onPress={handleManualInput}
                >
                  <Ionicons name="create-outline" size={20} color={colors.text.primary} />
                  <Text style={[styles.customInputText, { color: colors.text.primary }]}>
                    Use custom: "{searchQuery}"
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    paddingVertical: 0,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 12,
  },
  useInputButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  useInputButtonText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  bottomAction: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  customInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  customInputText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginLeft: 8,
  },
});
