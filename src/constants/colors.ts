const lightColors = {
  // Primary Teal/Green Theme
  primary: '#14B8A6',
  primaryLight: '#5EEAD4',
  primaryDark: '#0F766E',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

const darkColors = {
  // Primary Teal/Green Theme
  primary: '#14B8A6',
  primaryLight: '#5EEAD4',
  primaryDark: '#0F766E',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: '#0F1419',
  surface: '#1A1F2E',
  
  // Text Colors
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    inverse: '#111827',
  },
  
  // Border Colors
  border: {
    light: '#374151',
    medium: '#4B5563',
    dark: '#6B7280',
  },
} as const;

export const COLORS = lightColors;
export const DARK_COLORS = darkColors;

export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;