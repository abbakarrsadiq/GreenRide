export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    '2xl': 22,
    '3xl': 26,
    '4xl': 32,
    '5xl': 42,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;