import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors, spacing, borderRadius, shadows, typography } from '../../theme/index';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: SelectOption) => void;
  searchable?: boolean;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onSelect,
  searchable = false,
  label,
  error,
  containerStyle,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getSelectStyle = (): ViewStyle => ({
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[50],
    borderWidth: 0,
    minHeight: 48,
    justifyContent: 'center',
    ...shadows.sm,
    opacity: disabled ? 0.6 : 1,
  });

  const getModalStyle = (): ViewStyle => ({
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  });

  const getDropdownStyle = (): ViewStyle => ({
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    maxHeight: 300,
    ...shadows.lg,
  });

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={{
          fontSize: typography.sizes.sm,
          color: colors.gray[700],
          marginBottom: spacing.xs,
          fontWeight: '500',
        }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={getSelectStyle()}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={{
          fontSize: typography.sizes.base,
          color: selectedOption ? colors.gray[900] : colors.gray[400],
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      {error && (
        <Text style={{
          fontSize: typography.sizes.sm,
          color: colors.error,
          marginTop: spacing.xs,
        }}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={getModalStyle()}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={getDropdownStyle()}
          >
            <TouchableOpacity activeOpacity={1}>
              {searchable && (
                <View style={{
                  padding: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray[200],
                }}>
                  <TextInput
                    style={{
                      fontSize: typography.sizes.base,
                      color: colors.gray[900],
                      paddingVertical: spacing.sm,
                    }}
                    placeholder="Search options..."
                    placeholderTextColor={colors.gray[400]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                </View>
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.md,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.gray[100],
                    }}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={{
                      fontSize: typography.sizes.base,
                      color: item.value === value ? colors.primary[500] : colors.gray[900],
                      fontWeight: item.value === value ? '600' : '400',
                    }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};