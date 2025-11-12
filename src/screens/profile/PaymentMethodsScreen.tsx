import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { ToastService } from '../../services/toast';

interface PaymentMethodsScreenProps {
  navigation: any;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa Card',
    details: '**** **** **** 1234',
    isDefault: true,
    icon: 'card',
  },
  {
    id: '2',
    type: 'bank',
    name: 'GTBank',
    details: 'Account ending in 5678',
    isDefault: false,
    icon: 'business',
  },
  {
    id: '3',
    type: 'wallet',
    name: 'Paystack Wallet',
    details: 'Balance: ₦15,000',
    isDefault: false,
    icon: 'wallet',
  },
];

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    ToastService.success('Default payment method updated');
  };

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    ToastService.success('Payment method removed');
  };

  const handleAddPaymentMethod = () => {
    ToastService.info('Add payment method coming soon!');
  };

  const PaymentMethodCard = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentCardHeader}>
        <View style={styles.paymentInfo}>
          <View style={styles.paymentIconContainer}>
            <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentName}>{item.name}</Text>
            <Text style={styles.paymentDetailsText}>{item.details}</Text>
          </View>
        </View>
        
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.paymentActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveMethod(item.id)}
        >
          <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add Payment Method */}
        <View style={styles.addSection}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Payment Methods List */}
        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PaymentMethodCard item={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <View style={styles.securityCard}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
            <Text style={styles.securityTitle}>Secure Payments</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  addSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  addButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  methodsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  paymentDetailsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.white,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: COLORS.error + '20',
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
  },
  removeButtonText: {
    color: COLORS.error,
  },
  securitySection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  securityCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  securityTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.primary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  securityText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.sm,
  },
});