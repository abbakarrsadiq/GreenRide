import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Button, Input, Select } from '../components/ui';
import { DestinationSearchInput } from '../components/common/DestinationSearchInput';
import { colors, spacing, typography, borderRadius, shadows } from '../constants';
import ridesData from '../data/rides.json';
import { Location } from '../types';

interface Ride {
  id: number;
  vehicleType: string;
  eta: string;
  price: number;
  co2Saved: number;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedRideType, setSelectedRideType] = useState('');

  const rideTypeOptions = [
    { label: 'All Rides', value: '' },
    { label: 'Electric Car', value: 'Electric' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Electric Scooter', value: 'Electric Scooter' },
  ];

  const filteredRides = selectedRideType
    ? ridesData.filter(ride => ride.vehicleType === selectedRideType)
    : ridesData;

  const handleBookRide = (rideId: number) => {
    if (!pickup || !destination) {
      alert('Please enter pickup and destination locations');
      return;
    }
    
    (navigation as any).navigate('RideConfirmation', {
      rideId,
      pickup,
      destination,
    });
  };

  const RideCard = ({ ride }: { ride: Ride }) => (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: typography.sizes.lg,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.xs,
          }}>
            {ride.vehicleType}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.sizes.sm,
              color: colors.gray[600],
            }}>
              {ride.eta} away
            </Text>
          </View>
          
          <View style={{
            backgroundColor: colors.primary[50],
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.sm,
            alignSelf: 'flex-start',
          }}>
            <Text style={{
              fontSize: typography.sizes.sm,
              color: colors.primary[700],
              fontWeight: '500',
            }}>
              🌱 {ride.co2Saved} CO₂ saved
            </Text>
          </View>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: 'bold',
            color: colors.gray[900],
            marginBottom: spacing.sm,
          }}>
            ₦{ride.price.toLocaleString()}
          </Text>
          
          <Button
            title="Book"
            onPress={() => handleBookRide(ride.id)}
            size="sm"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gray[50]} />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
        }}>
          <Text style={{
            fontSize: typography.sizes['3xl'],
            fontWeight: 'bold',
            color: colors.gray[900],
            marginBottom: spacing.xs,
          }}>
            Find Your Ride
          </Text>
          
          <Text style={{
            fontSize: typography.sizes.base,
            color: colors.gray[600],
          }}>
            Choose eco-friendly transportation
          </Text>
        </View>

        {/* Location Inputs */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <Input
            label="Pickup Location"
            placeholder="e.g. Maitama District, Area 1"
            value={pickup}
            onChangeText={setPickup}
            leftIcon="location-sharp"
            containerStyle={{ marginBottom: spacing.md }}
          />
          
          <DestinationSearchInput
            placeholder="e.g. Jabi Lake Mall, Gwarinpa"
            value={destinationQuery}
            onChangeText={setDestinationQuery}
            onSelectLocation={(location: Location) => {
              setDestination(location.name);
              setDestinationQuery(location.name);
            }}
          />
          
          <Select
            label="Ride Type"
            options={rideTypeOptions}
            value={selectedRideType}
            onSelect={(option) => setSelectedRideType(option.value)}
            placeholder="Filter by ride type"
          />
        </View>

        {/* Available Rides */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '600',
            color: colors.gray[900],
            marginBottom: spacing.md,
          }}>
            Available Rides
          </Text>
          
          <FlatList
            data={filteredRides}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RideCard ride={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
        
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;