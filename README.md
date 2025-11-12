# GreenRide

Eco-friendly ride booking app for Abuja. Book electric and hybrid vehicles, track your carbon savings, earn rewards.

## Setup

```bash
npm install
npm start
```

Scan QR with Expo Go app (iOS/Android) or press `i` for iOS simulator, `a` for Android emulator.

## What's Inside

- **Home**: Pick destination, choose ride type (GreenGo/GreenEV/GreenXL), see CO2 savings
- **Booking**: Confirm ride details, select payment, view fare breakdown
- **History**: Past rides with stats and filters
- **Profile**: Total rides, CO2 saved, EcoPoints, level system

## Tech

- React Native + Expo + TypeScript
- Navigation: React Navigation
- State: Zustand
- Tests: Jest (21 tests passing)

## Assumptions

- Mock data for rides and locations (no real API)
- Map view shows placeholder (react-native-maps needs custom build)
- Location defaults to Area 1, Abuja if permissions denied
- Payment processing is simulated
- Dark mode persists via AsyncStorage

## Run Tests

```bash
npm test
```

## Build APK

1. Create Expo account at https://expo.dev
2. Login to EAS:
```bash
eas login
```

3. Build APK:
```bash
eas build -p android --profile preview
```

The APK will be available for download from your Expo dashboard once the build completes (usually 10-15 minutes).