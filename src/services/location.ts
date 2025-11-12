import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationType | null> {
    try {
      // Always return a valid location to ensure the app works
      const defaultLocation = {
        latitude: 9.0765,
        longitude: 7.3986,
        address: 'Area 1 Shopping Center, Garki, Abuja',
        name: 'Area 1 Shopping Center',
      };

      try {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
          console.log('Location permission denied, using default location');
          return defaultLocation;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const address = await this.reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );

        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address || `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
        };
      } catch (locationError) {
        console.log('Failed to get current location, using default:', locationError);
        return defaultLocation;
      }
    } catch (error) {
      console.error('Error in getCurrentLocation:', error);
      // Always return a fallback location
      return {
        latitude: 9.0765,
        longitude: 7.3986,
        address: 'Area 1 Shopping Center, Garki, Abuja (Default)',
        name: 'Area 1 Shopping Center',
      };
    }
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const location = result[0];
        const parts = [
          location.name,
          location.street,
          location.district,
          location.city,
        ].filter(Boolean);
        
        return parts.join(', ');
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  static async searchLocations(query: string): Promise<LocationType[]> {
    try {
      // For demo purposes, return mock Abuja locations
      const mockLocations: LocationType[] = [
        {
          latitude: 9.0765,
          longitude: 7.3986,
          address: 'Wuse II, Abuja',
          name: 'Wuse II',
        },
        {
          latitude: 9.0579,
          longitude: 7.4951,
          address: 'Maitama District, Abuja',
          name: 'Maitama',
        },
        {
          latitude: 9.0643,
          longitude: 7.4892,
          address: 'Asokoro District, Abuja',
          name: 'Asokoro',
        },
        {
          latitude: 9.1108,
          longitude: 7.4165,
          address: 'Gwarinpa Estate, Abuja',
          name: 'Gwarinpa',
        },
        {
          latitude: 8.9806,
          longitude: 7.4004,
          address: 'Lugbe Airport Road, Abuja',
          name: 'Lugbe',
        },
      ];

      return mockLocations.filter(location =>
        location.address.toLowerCase().includes(query.toLowerCase()) ||
        location.name?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }
}