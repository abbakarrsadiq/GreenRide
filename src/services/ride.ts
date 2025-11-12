import { Ride, RideOption, Location, Driver } from '../types';

interface CreateRideData {
  rideOption: RideOption;
  pickup: Location;
  destination: Location;
  paymentMethod: 'card' | 'cash' | 'wallet';
  driver: Driver;
  estimatedTime: string;
  distance: string;
  fare: number;
}

class RideServiceClass {
  private rides: Ride[] = [];

  async createRide(data: CreateRideData): Promise<Ride> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ride: Ride = {
      id: `ride_${Date.now()}`,
      type: data.rideOption.type,
      driver: data.driver,
      pickup: data.pickup,
      destination: data.destination,
      price: data.fare,
      eta: data.estimatedTime,
      co2Saved: data.rideOption.co2Saved,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      distance: data.distance,
      paymentMethod: data.paymentMethod,
    };

    this.rides.push(ride);
    return ride;
  }

  async getRides(): Promise<Ride[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.rides].reverse(); // Most recent first
  }

  async getRideById(id: string): Promise<Ride | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.rides.find(ride => ride.id === id) || null;
  }

  async updateRideStatus(id: string, status: Ride['status']): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rideIndex = this.rides.findIndex(ride => ride.id === id);
    if (rideIndex !== -1) {
      this.rides[rideIndex].status = status;
      return true;
    }
    return false;
  }

  async cancelRide(id: string): Promise<boolean> {
    return this.updateRideStatus(id, 'cancelled');
  }

  // Calculate estimated fare based on distance and ride type
  calculateFare(distance: number, rideType: RideOption['type']): number {
    const baseFares = {
      GreenGo: 500,
      GreenEV: 700,
      GreenXL: 900,
      GreenLuxe: 1200,
    };

    const perKmRates = {
      GreenGo: 150,
      GreenEV: 200,
      GreenXL: 250,
      GreenLuxe: 350,
    };

    const baseFare = baseFares[rideType];
    const distanceFare = distance * perKmRates[rideType];
    const serviceFee = (baseFare + distanceFare) * 0.1;

    return Math.round(baseFare + distanceFare + serviceFee);
  }

  // Calculate distance between two locations (simplified)
  calculateDistance(pickup: Location, destination: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(destination.latitude - pickup.latitude);
    const dLon = this.toRad(destination.longitude - pickup.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(pickup.latitude)) * Math.cos(this.toRad(destination.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Estimate travel time based on distance
  estimateTime(distance: number): string {
    // Assume average speed of 30 km/h in Abuja traffic
    const timeInHours = distance / 30;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }
}

export const RideService = new RideServiceClass();