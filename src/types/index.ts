export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalRides: number;
  co2Saved: number;
  ecoPoints: number;
}

export interface RideOption {
  id: string;
  type: 'GreenGo' | 'GreenEV' | 'GreenXL' | 'GreenLuxe';
  name: string;
  description: string;
  price: number;
  eta: string;
  co2Saved: number;
  passengers: number;
  icon: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  phone: string;
  vehicleModel: string;
  plateNumber: string;
  photo?: string;
  location: Location;
}

export interface Ride {
  id: string;
  type: RideOption['type'];
  driver: Driver;
  pickup: Location;
  destination: Location;
  price: number;
  eta: string;
  co2Saved: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  distance?: string;
  paymentMethod?: 'card' | 'cash' | 'wallet';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  name: string;
  last4?: string;
  isDefault: boolean;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RideConfirmation: {
    rideOption: RideOption;
    pickup: Location;
    destination: Location;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};