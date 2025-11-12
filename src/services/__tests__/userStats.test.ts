import { UserStatsService } from '../userStats';

describe('UserStatsService', () => {
  describe('getUserLevel', () => {
    it('should return Eco Starter level for low EcoPoints', () => {
      const level = UserStatsService.getUserLevel(50);
      expect(level.level).toBe(1);
      expect(level.title).toBe('Eco Starter');
    });

    it('should return Green Commuter level for medium EcoPoints', () => {
      const level = UserStatsService.getUserLevel(1500);
      expect(level.level).toBe(2);
      expect(level.title).toBe('Green Commuter');
    });

    it('should return Eco Warrior level for high EcoPoints', () => {
      const level = UserStatsService.getUserLevel(6000);
      expect(level.level).toBe(3);
      expect(level.title).toBe('Eco Warrior');
    });

    it('should return Green Champion level for very high EcoPoints', () => {
      const level = UserStatsService.getUserLevel(12000);
      expect(level.level).toBe(4);
      expect(level.title).toBe('Green Champion');
    });

    it('should return Eco Master level for maximum EcoPoints', () => {
      const level = UserStatsService.getUserLevel(25000);
      expect(level.level).toBe(5);
      expect(level.title).toBe('Eco Master');
    });

    it('should handle edge cases', () => {
      expect(UserStatsService.getUserLevel(0).title).toBe('Eco Starter');
      expect(UserStatsService.getUserLevel(999).title).toBe('Eco Starter');
      expect(UserStatsService.getUserLevel(1000).title).toBe('Green Commuter');
      expect(UserStatsService.getUserLevel(5000).title).toBe('Eco Warrior');
      expect(UserStatsService.getUserLevel(10000).title).toBe('Green Champion');
      expect(UserStatsService.getUserLevel(50000).title).toBe('Green Legend');
    });
  });

  describe('getConsistentUserData', () => {
    it('should return consistent user data', async () => {
      const user = await UserStatsService.getConsistentUserData();
      expect(user.name).toBe('Abbakar Sadiq');
      expect(user.email).toBe('abbakarrsadiq@gmail.com');
      expect(user.totalRides).toBe(47);
      expect(user.co2Saved).toBeGreaterThan(0);
      expect(user.ecoPoints).toBeGreaterThan(0);
    });
  });

  describe('formatStats', () => {
    it('should format user statistics correctly', async () => {
      const user = await UserStatsService.getConsistentUserData();
      const stats = UserStatsService.formatStats(user);
      
      expect(stats.totalRides).toBe('47');
      expect(stats.co2Saved).toContain('kg');
      expect(stats.ecoPoints).toContain(',');
      expect(stats.averageCO2PerRide).toContain('kg');
    });
  });
});