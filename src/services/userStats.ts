import { User } from '../types';
import { mockRideHistory } from '../data/rideHistory';

export class UserStatsService {
  // Calculate user statistics from ride history
  static calculateUserStats(rides: any[]) {
    const completedRides = rides.filter(ride => ride.status === 'completed');
    
    const totalRides = completedRides.length;
    const co2Saved = completedRides.reduce((sum, ride) => sum + ride.co2Saved, 0);
    const totalSpent = completedRides.reduce((sum, ride) => sum + ride.price, 0);
    
    // Calculate EcoPoints: 100 points per ride + 50 points per kg CO2 saved + bonus for spending
    const ridePoints = totalRides * 100;
    const co2Points = Math.round(co2Saved * 50);
    const spendingBonus = Math.round(totalSpent * 0.1);
    const ecoPoints = ridePoints + co2Points + spendingBonus;
    
    return {
      totalRides,
      co2Saved: Math.round(co2Saved * 10) / 10,
      ecoPoints,
    };
  }

  // Get consistent user data
  static async getConsistentUserData(): Promise<User> {
    // Use mock data directly to avoid circular dependency
    const stats = this.calculateUserStats(mockRideHistory);
    const baseUser = {
      id: 'admin-001',
      name: 'Abbakar Sadiq',
      email: 'abbakarrsadiq@gmail.com',
      phone: '07066773487',
    };
    return {
      ...baseUser,
      ...stats,
    } as User;
  }

  // Format statistics for display
  static formatStats(user: User) {
    return {
      totalRides: user.totalRides.toString(),
      co2Saved: `${user.co2Saved}kg`,
      ecoPoints: user.ecoPoints.toLocaleString(),
      averageCO2PerRide: user.totalRides > 0 ? 
        `${(user.co2Saved / user.totalRides).toFixed(1)}kg` : '0kg',
    };
  }

  // Calculate level based on EcoPoints
  static getUserLevel(ecoPoints: number): { level: number; title: string; nextLevelPoints: number } {
    const levels = [
      { level: 1, title: 'Eco Starter', minPoints: 0 },
      { level: 2, title: 'Green Commuter', minPoints: 1000 },
      { level: 3, title: 'Eco Warrior', minPoints: 5000 },
      { level: 4, title: 'Green Champion', minPoints: 10000 },
      { level: 5, title: 'Eco Master', minPoints: 20000 },
      { level: 6, title: 'Green Legend', minPoints: 50000 },
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length; i++) {
      if (ecoPoints >= levels[i].minPoints) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || levels[i]; // Stay at max level
      } else {
        break;
      }
    }

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      nextLevelPoints: nextLevel ? nextLevel.minPoints - ecoPoints : 0,
    };
  }

  // Get achievement badges
  static getAchievements(user: User): Array<{ title: string; description: string; earned: boolean }> {
    return [
      {
        title: 'First Ride',
        description: 'Complete your first eco-friendly ride',
        earned: user.totalRides >= 1,
      },
      {
        title: 'Green Starter',
        description: 'Complete 10 rides',
        earned: user.totalRides >= 10,
      },
      {
        title: 'Eco Enthusiast',
        description: 'Complete 25 rides',
        earned: user.totalRides >= 25,
      },
      {
        title: 'Green Champion',
        description: 'Complete 50 rides',
        earned: user.totalRides >= 50,
      },
      {
        title: 'CO2 Saver',
        description: 'Save 10kg of CO2',
        earned: user.co2Saved >= 10,
      },
      {
        title: 'Climate Hero',
        description: 'Save 25kg of CO2',
        earned: user.co2Saved >= 25,
      },
      {
        title: 'Point Collector',
        description: 'Earn 5,000 EcoPoints',
        earned: user.ecoPoints >= 5000,
      },
      {
        title: 'Eco Master',
        description: 'Earn 10,000 EcoPoints',
        earned: user.ecoPoints >= 10000,
      },
    ];
  }
}