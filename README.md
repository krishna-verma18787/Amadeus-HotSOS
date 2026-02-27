# Amadeus HotSOS Mobile App

A mobile application built with Angular + Capacitor for hotel housekeeping management. This app implements PIN-based authentication, tab navigation, and room assignment management.

## Features

- **PIN Login Flow**: Secure PIN-based authentication with numeric keypad
- **Bottom Tab Navigation**: Four main tabs (Housekeeping, Service Orders, Guests, More)
- **Bottom Sheet Menu**: Slide-up menu in the More tab (Amenities, Meters, Personnel)
- **Room Assignment UI**: Clean interface for managing cleaning room assignments
- **Secure Storage**: Uses Capacitor Preferences for secure token storage
- **Environment Configuration**: Support for dev/qa/prod environments

## Tech Stack

- **Angular 21**: Modern Angular framework
- **Capacitor 6**: Native mobile runtime
- **TypeScript**: Type-safe development
- **Standalone Components**: Modern Angular architecture

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services and guards
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── network.interceptor.ts
│   │   └── services/
│   │       ├── api.service.ts
│   │       ├── auth.service.ts
│   │       └── storage.service.ts
│   ├── features/                # Feature modules
│   │   ├── auth/
│   │   │   └── pin-login/
│   │   └── shell/
│   │       ├── housekeeping/
│   │       ├── service-orders/
│   │       ├── guests/
│   │       └── more/
│   └── shared/                  # Shared components and services
│       └── components/
│           └── bottom-sheet/
├── assets/
│   └── mock-data/
│       └── pins.json           # Mock PIN data
└── environments/
    └── environment.ts          # Environment configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 21+
- Capacitor CLI 6+

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Capacitor platforms (if needed):**
   ```bash
   npx cap add android
   npx cap add ios
   ```

3. **Sync Capacitor:**
   ```bash
   npx cap sync
   ```

## Development

### Run Development Server

```bash
npm start
# or
ng serve --host=0.0.0.0 --port=3000
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

### Run on Android

```bash
npm run build
npx cap sync android
npx cap open android
```

### Run on iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

## Environment Configuration

Edit `src/environments/environment.ts` to switch between environments:

```typescript
// Change this line to switch environments
export default ENV.DEV;  // Options: ENV.DEV | ENV.QA | ENV.UAT | ENV.PROD
```

## PIN Login

### Valid PINs (for testing)

- `1234` - Krishna Kumar
- `5678` - Jane Smith
- `2135174` - Admin User
- `0000` - Test User
- `9999` - Demo User

### PIN Requirements

- Must be 4-8 digits
- Numeric only
- Continue button enabled only when PIN is valid length

## Features Implementation

### Part A - App Setup ✅

- [x] Angular app + Capacitor integration
- [x] Android + iOS platforms configured
- [x] Environment configs (dev/qa/prod)
- [x] Clean folder structure (core/, shared/, features/)

### Part B - PIN Login ✅

- [x] PIN input with numeric keypad
- [x] Continue button enabled only when PIN is valid
- [x] Mock API call with local JSON data
- [x] Secure token storage using Capacitor Preferences
- [x] Navigation to Shell on success
- [x] Error handling (invalid PIN, network unavailable)

### Part C - Tab Shell + More Menu ✅

- [x] Bottom tab bar with 4 tabs
- [x] Bottom sheet menu in More tab
- [x] Menu items: Amenities, Meters, Personnel
- [x] Custom bottom sheet component (no Ionic)

### Part D - Room Assignment UI ✅

- [x] Cleaning - All Rooms assignment UI
- [x] Room cards with task details
- [x] Search, filter, and sort functionality
- [x] Role selector dropdown

## Routing

- `/pin-login` - PIN login screen (default)
- `/shell` - Main shell with tabs
  - `/shell/housekeeping` - Room assignments
  - `/shell/service-orders` - Service orders
  - `/shell/guests` - Guests management
  - `/shell/more` - More menu (opens bottom sheet)

## Security

- Tokens stored securely using Capacitor Preferences
- Falls back to localStorage for web platform
- Auth guard protects shell routes
- Network interceptor handles offline scenarios

## Mock Data

Mock PIN data is stored in `src/assets/mock-data/pins.json`. In production, this would be replaced with actual API calls.

## Troubleshooting

### Build Issues

If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Capacitor Sync Issues

```bash
npx cap sync
```

### Platform-Specific Issues

- **Android**: Ensure Android SDK is installed and configured
- **iOS**: Ensure Xcode is installed (macOS only)

## License

Private project - All rights reserved
