import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { SPACING, TYPOGRAPHY } from '../constants';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';
import { AuthService } from '../services/auth';
import { useTheme } from '../hooks/useTheme';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

// Main Screens
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { RideConfirmationScreen } from '../screens/main/RideConfirmationScreen';
import { HistoryScreen } from '../screens/main/HistoryScreen';

// Profile Screens
import { PaymentMethodsScreen } from '../screens/profile/PaymentMethodsScreen';

// Placeholder screens
import { PlaceholderScreen } from '../screens/common/PlaceholderScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={PlaceholderScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  const { colors } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: focused ? colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={20} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <MainTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: focused ? colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name={focused ? "time" : "time-outline"} 
                size={20} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: focused ? colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={20} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

export function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{
          marginTop: SPACING.md,
          fontSize: TYPOGRAPHY.fontSize.base,
          fontFamily: TYPOGRAPHY.fontFamily.medium,
          color: colors.text.secondary,
        }}>
          Loading GreenRide...
        </Text>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName={isAuthenticated ? "Main" : "Auth"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="Auth" component={AuthNavigator} />
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen name="RideConfirmation" component={RideConfirmationScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}