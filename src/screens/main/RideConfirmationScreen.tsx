import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { StatusModal } from '../../components/ui/StatusModal';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { RideOption, Location, Driver } from '../../types';
import { formatCurrency } from '../../utils';
import { RideService, PaymentService } from '../../services';
import { useTheme } from '../../hooks/useTheme';



interface RideConfirmationScreenProps {
  navigation: any;
  route: {
    params: {
      rideOption: RideOption;
      pickup: Location;
      destination: Location;
    };
  };
}

const MOCK_DRIVER: Driver = {
  id: '1',
  name: 'Musa Ibrahim',
  rating: 4.8,
  totalRides: 1247,
  phone: '+234 803 456 7890',
  vehicleModel: 'Toyota Camry Hybrid',
  plateNumber: 'ABJ 123 XY',
  photo: null,
  location: {
    latitude: 9.0765,
    longitude: 7.3986,
    address: 'Wuse II, Abuja',
  },
};

export const RideConfirmationScreen: React.FC<RideConfirmationScreenProps> = ({
  navigation,
  route,
}) => {
  const { rideOption, pickup, destination } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'wallet'>('card');
  const [estimatedTime] = useState('12-15 min');
  const [distance] = useState('8.5 km');
  const { colors } = useTheme();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fareBreakdown = useMemo(() => ({
    base: rideOption.price * 0.7,
    distance: rideOption.price * 0.2,
    service: rideOption.price * 0.1,
  }), [rideOption.price]);

  const handleConfirmBooking = useCallback(async () => {
    setLoading(true);
    try {
      // Create ride booking
      const rideData = {
        rideOption,
        pickup,
        destination,
        paymentMethod,
        driver: MOCK_DRIVER,
        estimatedTime,
        distance,
        fare: rideOption.price,
      };

      const ride = await RideService.createRide(rideData);
      
      if (paymentMethod !== 'cash') {
        // Process payment
        const paymentResult = await PaymentService.processPayment({
          amount: rideOption.price,
          method: paymentMethod,
          rideId: ride.id,
        });

        if (!paymentResult.success) {
          setErrorMessage('Payment failed. Please try again or choose a different payment method.');
          setShowErrorModal(true);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to book ride. Please check your connection and try again.');
      setShowErrorModal(true);
    }
  }, [rideOption, pickup, destination, paymentMethod, estimatedTime, distance, navigation]);

  const handleSuccessClose = useCallback(() => {
    setShowSuccessModal(false);
    navigation.navigate('Main', { screen: 'Home' });
  }, [navigation]);

  const handleErrorClose = useCallback(() => {
    setShowErrorModal(false);
  }, []);

  const PaymentMethodCard: React.FC<{
    method: 'card' | 'cash' | 'wallet';
    title: string;
    subtitle: string;
    icon: string;
  }> = useCallback(({ method, title, subtitle, icon }) => (
    <TouchableOpacity
      style={[
        styles.paymentCard,
        { backgroundColor: colors.surface, borderColor: paymentMethod === method ? colors.primary : colors.border.light },
        paymentMethod === method && styles.selectedPaymentCard,
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View style={styles.paymentCardContent}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <View style={styles.paymentInfo}>
          <Text style={[styles.paymentTitle, { color: colors.text.primary }]}>{title}</Text>
          <Text style={[styles.paymentSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
        </View>
        {paymentMethod === method && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  ), [paymentMethod, colors]) as React.FC<{
    method: 'card' | 'cash' | 'wallet';
    title: string;
    subtitle: string;
    icon: string;
  }>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border.light }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Confirm Ride</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Route Summary */}
        <View style={[styles.routeCard, { backgroundColor: colors.surface }]}>
          <View style={styles.routeHeader}>
            <Text style={[styles.routeTitle, { color: colors.text.primary }]}>Route Summary</Text>
            <View style={styles.routeStats}>
              <Text style={[styles.routeDistance, { color: colors.text.primary }]}>{distance}</Text>
              <Text style={[styles.routeTime, { color: colors.text.secondary }]}>{estimatedTime}</Text>
            </View>
          </View>
          
          <View style={styles.routeDetails}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.pickupDot, { backgroundColor: colors.primary }]} />
              <View style={styles.routeInfo}>
                <Text style={[styles.routeLabel, { color: colors.text.secondary }]}>Pickup</Text>
                <Text style={[styles.routeAddress, { color: colors.text.primary }]}>
                  {pickup.name || pickup.address}
                </Text>
              </View>
            </View>
            
            <View style={[styles.routeLine, { backgroundColor: colors.border.light }]} />
            
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.destinationDot, { backgroundColor: colors.error }]} />
              <View style={styles.routeInfo}>
                <Text style={[styles.routeLabel, { color: colors.text.secondary }]}>Destination</Text>
                <Text style={[styles.routeAddress, { color: colors.text.primary }]}>
                  {destination.name || destination.address}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ride Details */}
        <View style={[styles.rideCard, { backgroundColor: colors.surface }]}>
          <View style={styles.rideHeader}>
            <View style={[styles.rideIcon, { backgroundColor: colors.gray[800] }]}>
              <Text style={styles.rideIconText}>{rideOption.icon}</Text>
            </View>
            <View style={styles.rideInfo}>
              <Text style={[styles.rideName, { color: colors.text.primary }]}>{rideOption.name}</Text>
              <Text style={[styles.rideDescription, { color: colors.text.secondary }]}>{rideOption.description}</Text>
            </View>
            <View style={styles.ridePrice}>
              <Text style={[styles.ridePriceText, { color: colors.text.primary }]}>{formatCurrency(rideOption.price)}</Text>
            </View>
          </View>
          
          <View style={styles.rideFeatures}>
            <View style={styles.feature}>
              <Ionicons name="people" size={16} color={colors.text.secondary} />
              <Text style={[styles.featureText, { color: colors.text.secondary }]}>{rideOption.passengers} passengers</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="leaf" size={16} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text.secondary }]}>-{rideOption.co2Saved}kg CO₂</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="time" size={16} color={colors.text.secondary} />
              <Text style={[styles.featureText, { color: colors.text.secondary }]}>ETA: {rideOption.eta}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Payment Method</Text>
          
          <PaymentMethodCard
            method="card"
            title="Credit/Debit Card"
            subtitle="**** **** **** 1234"
            icon="card"
          />
          
          <PaymentMethodCard
            method="wallet"
            title="GreenWallet"
            subtitle="Balance: ₦15,000"
            icon="wallet"
          />
          
          <PaymentMethodCard
            method="cash"
            title="Cash Payment"
            subtitle="Pay driver directly"
            icon="cash"
          />
        </View>

        {/* Fare Breakdown */}
        <View style={[styles.fareCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Fare Breakdown</Text>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.text.secondary }]}>Base fare</Text>
            <Text style={[styles.fareValue, { color: colors.text.primary }]}>{formatCurrency(fareBreakdown.base)}</Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.text.secondary }]}>Distance ({distance})</Text>
            <Text style={[styles.fareValue, { color: colors.text.primary }]}>{formatCurrency(fareBreakdown.distance)}</Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.text.secondary }]}>Service fee</Text>
            <Text style={[styles.fareValue, { color: colors.text.primary }]}>{formatCurrency(fareBreakdown.service)}</Text>
          </View>
          
          <View style={[styles.fareDivider, { backgroundColor: colors.border.light }]} />
          
          <View style={styles.fareRow}>
            <Text style={[styles.fareTotalLabel, { color: colors.text.primary }]}>Total</Text>
            <Text style={[styles.fareTotalValue, { color: colors.text.primary }]}>{formatCurrency(rideOption.price)}</Text>
          </View>
        </View>

        {/* Eco Impact */}
        <View style={[styles.ecoCard, { backgroundColor: colors.primary + '10' }]}>
          <View style={styles.ecoHeader}>
            <Ionicons name="leaf" size={24} color={colors.primary} />
            <Text style={[styles.ecoTitle, { color: colors.primary }]}>Environmental Impact</Text>
          </View>
          <Text style={[styles.ecoDescription, { color: colors.text.secondary }]}>
            By choosing {rideOption.name}, you'll save {rideOption.co2Saved}kg of CO₂ 
            compared to traditional vehicles. Thank you for choosing green!
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: colors.surface, borderTopColor: colors.border.light }]}>
        <Button
          title={`Confirm Booking - ${formatCurrency(rideOption.price)}`}
          onPress={handleConfirmBooking}
          loading={loading}
          fullWidth
        />
      </View>

      {/* Success Modal */}
      <StatusModal
        visible={showSuccessModal}
        type="success"
        title="Booking Confirmed!"
        message={`Your ${rideOption.name} ride has been booked successfully. Your driver will arrive in ${rideOption.eta}.`}
        primaryButtonText="Go to Home"
        onPrimaryPress={handleSuccessClose}
        onClose={handleSuccessClose}
      />

      {/* Error Modal */}
      <StatusModal
        visible={showErrorModal}
        type="error"
        title="Booking Failed"
        message={errorMessage}
        primaryButtonText="Try Again"
        onPrimaryPress={handleErrorClose}
        secondaryButtonText="Cancel"
        onSecondaryPress={() => {
          handleErrorClose();
          navigation.goBack();
        }}
        onClose={handleErrorClose}
      />
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
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  routeCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  routeTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  routeStats: {
    alignItems: 'flex-end',
  },
  routeDistance: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  routeTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  routeDetails: {
    position: 'relative',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
  },
  pickupDot: {
  },
  destinationDot: {
  },
  routeInfo: {
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  routeLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginBottom: SPACING.xs,
  },
  routeAddress: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
    marginVertical: SPACING.xs,
  },
  rideCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.xs,
  },
  rideDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  ridePrice: {
    alignItems: 'flex-end',
  },
  ridePriceText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  rideFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginLeft: SPACING.xs,
  },
  paymentSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.md,
  },
  paymentCard: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  selectedPaymentCard: {
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  paymentTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginBottom: SPACING.xs,
  },
  paymentSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  fareCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  fareLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  fareValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  fareDivider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  fareTotalLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  fareTotalValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  ecoCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  ecoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ecoTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    marginLeft: SPACING.sm,
  },
  ecoDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: 20,
  },
  bottomActions: {
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
});