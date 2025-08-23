# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Code quality
npm run lint
npm run format
npm run format:check
```

### Environment Setup

Create `.env.local` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Expo/EAS Commands

```bash
# Clear cache and restart
npx expo start --clear

# Create development builds for OAuth testing
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Architecture Overview

### Framework Stack

- **React Native + Expo** (v53): Core mobile framework
- **Expo Router**: File-based routing with typed routes
- **Supabase**: Authentication and database
- **i18next**: Internationalization (en, ko, vi, zh)
- **TypeScript**: Strict typing enabled

### Project Structure

```
app/
├── (auth)/          # Authentication screens (login, signup, etc.)
├── (tabs)/          # Main tab navigation (home, profile, settings, training)
├── activity/        # Activity detail screens
├── onboarding/      # User onboarding flow
└── settings/        # Settings screens

contexts/            # React Context providers
├── AuthContext.tsx    # Authentication state management
├── ActivityContext.tsx # Activity data management
├── NotificationContext.tsx # Notification handling
├── ProfileContext.tsx     # User profile management
└── TrainingContext.tsx    # Training plans management

lib/
├── api.ts          # Centralized API service layer
├── supabase.ts     # Supabase client configuration
└── oauth.ts        # OAuth providers (Google, Apple)

components/         # Reusable UI components
i18n/              # Internationalization setup and locales
types/             # TypeScript type definitions
```

### Context Architecture

The app uses a hierarchical context structure in `app/_layout.tsx`:

1. **AuthProvider** - Session management and authentication
2. **ProfileProvider** - User profile data
3. **ActivityProvider** - Activity tracking and data
4. **NotificationProvider** - Notification system
5. **TrainingProvider** - Training plans and workouts

### API Integration

- **Dual API approach**: Direct Supabase calls for auth, REST API for business logic
- **Automatic auth headers**: API service injects Bearer tokens automatically
- **Web app integration**: Connects to backend at `EXPO_PUBLIC_API_BASE_URL`
- **Shared session**: Uses same Supabase session as web application

### Path Aliases (tsconfig.json & babel.config.js)

```typescript
@/*           -> ./*
@/app/*       -> ./app/*
@/components/* -> ./components/*
@/contexts/*  -> ./contexts/*
@/lib/*       -> ./lib/*
@/types/*     -> ./types/*
// etc.
```

## Key Features & Implementation Notes

### Authentication

- **Email/Password**: Standard Supabase auth
- **OAuth Ready**: Google and Apple Sign-In configured (requires setup)
- **Session Persistence**: AsyncStorage for offline session handling
- **Deep Linking**: Password reset uses `runningmate://reset-password`

### Internationalization

- **Auto-detection**: Device locale with AsyncStorage persistence
- **Supported Languages**: English (default), Korean, Vietnamese, Chinese
- **Usage**: Import `useI18n` hook, translations in `i18n/locales/`

### Mobile-Specific Considerations

- **OAuth Limitations**: Requires development builds (not Expo Go)
- **Bundle ID**: `com.runningmate.app` for both iOS and Android
- **Deep Linking**: `runningmate://` scheme configured
- **Maps**: Google Maps API key required for Android
- **Performance**: AsyncStorage for data persistence, gesture handlers configured

### API Endpoints

The mobile app integrates with these web app endpoints:

- `/api/auth/*` - Authentication
- `/api/profile` - User profile management
- `/api/training/*` - Training plans and workouts
- `/api/notifications/*` - Notification management
- `/api/activities` - Activity tracking
- `/api/strava/*` - Strava integration
- `/api/chat` - AI chat functionality

## Development Best Practices

### Testing OAuth Features

1. Configure Supabase OAuth providers
2. Create development build: `eas build --profile development --platform ios`
3. Install on physical device (required for Apple Sign-In)
4. Test with development build, not Expo Go

### Debugging

- Use Expo DevTools for general debugging
- Enable network inspection for API calls
- Check Supabase dashboard for auth issues
- Use `console.log` prefixed with component name (e.g., `[AuthContext]`)

### Common Issues

- **OAuth not working**: Use development build, not Expo Go
- **API errors**: Verify `EXPO_PUBLIC_API_BASE_URL` and CORS settings
- **Build failures**: Clear node_modules and reinstall dependencies
