import ridesData from '../data/rides.json';

export interface RideData {
  id: number;
  vehicleType: 'Electric' | 'Hybrid';
  eta: string;
  price: number;
  co2Saved: number;
}

export class RidesDataService {
  static async getRides(): Promise<RideData[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return ridesData as RideData[];
  }

  static async getRideById(id: number): Promise<RideData | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return (ridesData as RideData[]).find(ride => ride.id === id) || null;
  }

  static async getRidesByType(vehicleType: 'Electric' | 'Hybrid'): Promise<RideData[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return (ridesData as RideData[]).filter(ride => ride.vehicleType === vehicleType);
  }

  static async getElectricRides(): Promise<RideData[]> {
    return this.getRidesByType('Electric');
  }

  static async getHybridRides(): Promise<RideData[]> {
    return this.getRidesByType('Hybrid');
  }
}