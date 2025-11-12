import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Modal } from '../components/ui';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/index';
import ridesData from '../data/rides.json';

const RideConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rideId, pickup, destination } = route.params as any;
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const ride = ridesData.availableRides.find(r => r.id === rideId);

  if (!ride) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
        <Text>Ride not found</Text>
      </SafeAreaView>
    );
  }

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false);
      setShowConfirmModal(true);
    }, 2000);
  };

  const handleModalClose = () => {
    setShowConfirmModal(false);
    (navigation as any).navigate('Main');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gray[50]} />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Button
            title="← Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="sm"
          />
          
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '600',
            color: colors.gray[900],
            marginLeft: spacing.md,
          }}>
            Confirm Your Ride
          </Text>
        </View>

        {/* Trip Details */}
        <View
          style={{
            backgroundColor: colors.white,
            marginHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...shadows.md,
          }}
        >
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Trip Details
          </Text>
          
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{
              fontSize: typography.sizes.sm,
              color: colors.gray[600],
              marginBottom: spacing.xs,
            }}>
              From
            </Text>
            <Text style={{
              fontSize: typography.sizes.base,
              color: colors.gray[900],
            }}>
              📍 {pickup}
            </Text>
          </View>
          
          <View>
            <Text style={{
              fontSize: typography.sizes.sm,
              color: colors.gray[600],
              marginBottom: spacing.xs,
            }}>
              To
            </Text>
            <Text style={{
              fontSize: typography.sizes.base,
              color: colors.gray[900],
            }}>
              🎯 {destination}
            </Text>
          </View>
        </View>

        {/* Ride Details */}
        <View
          style={{
            backgroundColor: colors.white,
            marginHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...shadows.md,
          }}
        >
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Your {ride.type}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <View>
              <Text style={{
                fontSize: typography.sizes.base,
                color: colors.gray[900],
                fontWeight: '500',
              }}>
                {ride.vehicleModel}
              </Text>
              <Text style={{
                fontSize: typography.sizes.sm,
                color: colors.gray[600],
              }}>
                Driver: {ride.driver}
              </Text>
              <Text style={{
                fontSize: typography.sizes.sm,
                color: colors.gray[600],
              }}>
                ⭐ {ride.rating} • Arrives in {ride.estimatedTime}
              </Text>
            </View>
            
            <Text style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: 'bold',
              color: colors.gray[900],
            }}>
              ₦{ride.price.toLocaleString()}
            </Text>
          </View>
          
          <View style={{
            backgroundColor: colors.primary[50],
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
          }}>
            <Text style={{
              fontSize: typography.sizes.base,
              color: colors.primary[700],
              fontWeight: '500',
              textAlign: 'center',
            }}>
              🌱 You'll save {ride.co2Saved} of CO₂ emissions
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Button
            title={isBooking ? "Booking..." : "Confirm Booking"}
            onPress={handleConfirmBooking}
            loading={isBooking}
            disabled={isBooking}
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showConfirmModal}
        onClose={handleModalClose}
        title="Booking Confirmed! 🎉"
      >
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
          <Text style={{
            fontSize: 48,
            marginBottom: spacing.md,
          }}>
            ✅
          </Text>
          
          <Text style={{
            fontSize: typography.sizes.lg,
            color: colors.gray[900],
            textAlign: 'center',
            marginBottom: spacing.md,
          }}>
            Your {ride.type} is on the way!
          </Text>
          
          <Text style={{
            fontSize: typography.sizes.base,
            color: colors.gray[600],
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}>
            {ride.driver} will arrive in {ride.estimatedTime}
          </Text>
          
          <Button
            title="Track Ride"
            onPress={handleModalClose}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RideConfirmationScreen;