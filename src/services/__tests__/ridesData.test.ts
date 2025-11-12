import { RidesDataService } from '../ridesData';

describe('RidesDataService', () => {
  describe('getRides', () => {
    it('should return all rides', async () => {
      const rides = await RidesDataService.getRides();
      expect(rides.length).toBeGreaterThan(0);
      expect(rides[0]).toHaveProperty('vehicleType');
    });

    it('should return rides with correct structure', async () => {
      const rides = await RidesDataService.getRides();
      rides.forEach(ride => {
        expect(ride).toHaveProperty('id');
        expect(ride).toHaveProperty('vehicleType');
        expect(ride).toHaveProperty('eta');
        expect(ride).toHaveProperty('price');
        expect(ride).toHaveProperty('co2Saved');
      });
    });
  });

  describe('getRideById', () => {
    it('should return correct ride by id', async () => {
      const ride = await RidesDataService.getRideById(1);
      expect(ride).not.toBeNull();
      expect(ride?.id).toBe(1);
      expect(ride?.vehicleType).toBe('Electric');
    });

    it('should return null for non-existent id', async () => {
      const ride = await RidesDataService.getRideById(999);
      expect(ride).toBeNull();
    });
  });

  describe('getRidesByType', () => {
    it('should return only Electric rides', async () => {
      const electricRides = await RidesDataService.getRidesByType('Electric');
      expect(electricRides.every(ride => ride.vehicleType === 'Electric')).toBe(true);
    });

    it('should return only Hybrid rides', async () => {
      const hybridRides = await RidesDataService.getRidesByType('Hybrid');
      expect(hybridRides.every(ride => ride.vehicleType === 'Hybrid')).toBe(true);
    });
  });

  describe('getElectricRides', () => {
    it('should return electric rides', async () => {
      const rides = await RidesDataService.getElectricRides();
      expect(rides.every(ride => ride.vehicleType === 'Electric')).toBe(true);
    });
  });

  describe('getHybridRides', () => {
    it('should return hybrid rides', async () => {
      const rides = await RidesDataService.getHybridRides();
      expect(rides.every(ride => ride.vehicleType === 'Hybrid')).toBe(true);
    });
  });
});