import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button, Input, Select, Modal } from '../components/ui';
import { colors, spacing, typography } from '../theme/index';

// This is a showcase screen to demonstrate all UI components
// You can navigate to this screen for testing purposes

const ComponentShowcase = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [showModal, setShowModal] = useState(false);

  const selectOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <ScrollView style={{ flex: 1, padding: spacing.lg }}>
        <Text style={{
          fontSize: typography.sizes['2xl'],
          fontWeight: 'bold',
          color: colors.gray[900],
          marginBottom: spacing.lg,
        }}>
          UI Components Showcase
        </Text>

        {/* Buttons */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Buttons
          </Text>
          
          <View style={{ gap: spacing.md }}>
            <Button title="Primary Button" onPress={() => {}} />
            <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
            <Button title="Outline Button" onPress={() => {}} variant="outline" />
            <Button title="Loading Button" onPress={() => {}} loading />
            <Button title="Disabled Button" onPress={() => {}} disabled />
          </View>
        </View>

        {/* Inputs */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Inputs
          </Text>
          
          <View style={{ gap: spacing.md }}>
            <Input
              label="Text Input"
              placeholder="Enter some text"
              value={inputValue}
              onChangeText={setInputValue}
            />
            
            <Input
              label="Input with Icon"
              placeholder="Search..."
              leftIcon={<Text>🔍</Text>}
            />
            
            <Input
              label="Number Input"
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Select */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Select Dropdown
          </Text>
          
          <Select
            label="Choose Option"
            options={selectOptions}
            value={selectedValue}
            onSelect={(option) => setSelectedValue(option.value)}
            searchable
          />
        </View>

        {/* Modal */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Modal
          </Text>
          
          <Button
            title="Show Modal"
            onPress={() => setShowModal(true)}
            variant="outline"
          />
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Sample Modal"
      >
        <Text style={{
          fontSize: typography.sizes.base,
          color: colors.gray[700],
          marginBottom: spacing.lg,
        }}>
          This is a sample modal with smooth animations and elegant design.
        </Text>
        
        <Button
          title="Close Modal"
          onPress={() => setShowModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default ComponentShowcase;