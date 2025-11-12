import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, spacing, borderRadius, shadows, typography } from '../../theme/index';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  containerStyle,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
      }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View
          style={[
            {
              backgroundColor: colors.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              ...shadows.lg,
            },
            containerStyle,
          ]}
        >
          {title && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}>
              <Text style={{
                fontSize: typography.sizes.xl,
                fontWeight: '600',
                color: colors.gray[900],
              }}>
                {title}
              </Text>
              
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    padding: spacing.sm,
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <Text style={{
                    fontSize: typography.sizes.lg,
                    color: colors.gray[500],
                  }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {children}
        </View>
        
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </RNModal>
  );
};