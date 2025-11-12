import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { UserStatsService } from './userStats';

const VALID_CREDENTIALS = {
  email: 'abbakarrsadiq@gmail.com',
  phone: '07066773487',
  password: 'bamantuwa@123',
};

const STORAGE_KEYS = {
  USER: '@greenride_user',
  USERS: '@greenride_users',
};

export class AuthService {
  static async login(emailOrPhone: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // Check if it's the default admin user
      if ((emailOrPhone === VALID_CREDENTIALS.email || emailOrPhone === VALID_CREDENTIALS.phone) && 
          password === VALID_CREDENTIALS.password) {
        
        const adminUser: User = await UserStatsService.getConsistentUserData();

        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }

      // Check registered users
      const registeredUsers = await this.getRegisteredUsers();
      const user = registeredUsers.find(u => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword as User };
      }

      return { 
        success: false, 
        message: 'This user does not exist on our system, kindly sign up' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  }

  static async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const registeredUsers = await this.getRegisteredUsers();
      
      // Check if user already exists
      const existingUser = registeredUsers.find(u => 
        u.email === userData.email || u.phone === userData.phone
      );

      if (existingUser) {
        return { 
          success: false, 
          message: 'User with this email or phone already exists' 
        };
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        totalRides: 0,
        co2Saved: 0,
        ecoPoints: 0,
      };

      registeredUsers.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));

      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword as User };
    } catch (error) {
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private static async getRegisteredUsers(): Promise<any[]> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      return [];
    }
  }
}