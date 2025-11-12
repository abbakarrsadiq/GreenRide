import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';

interface StatusModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  primaryButtonText?: string;
  onPrimaryPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  primaryButtonText = 'OK',
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      onClose();
    }
  };

  const iconName = type === 'success' ? 'checkmark-circle' : 'close-circle';
  const iconColor = type === 'success' ? colors.success : colors.error;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, transform: [{ scale: scaleValue }] },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={iconName} size={64} color={iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.text.secondary }]}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {secondaryButtonText && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { backgroundColor: colors.background }]}
                onPress={onSecondaryPress || onClose}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.text.primary }]}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: type === 'success' ? colors.success : colors.error },
                !secondaryButtonText && styles.fullWidthButton,
              ]}
              onPress={handlePrimaryPress}
            >
              <Text style={[styles.primaryButtonText, { color: colors.white }]}>
                {primaryButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButton: {
    ...SHADOWS.sm,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
});
