import { mockRideHistory, RideHistoryItem } from '../data/rideHistory';
import { UserStatsService } from './userStats';

export class RideHistoryService {
  static async getRideHistory(): Promise<RideHistoryItem[]> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockRideHistory);
      }, 500);
    });
  }

  static async getRideStats() {
    const rideHistory = await this.getRideHistory();
    return UserStatsService.calculateUserStats(rideHistory);
  }
}
