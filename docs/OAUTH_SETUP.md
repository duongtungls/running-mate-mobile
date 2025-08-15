# OAuth Setup Guide - Google & Apple Sign-In

This guide explains how to set up Google and Apple OAuth authentication for the RunningMate mobile app.

## Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project set up
2. **EAS CLI**: Install Expo Application Services CLI if building for production
3. **Developer Accounts**: Google Cloud Platform account and Apple Developer account

## Supabase OAuth Configuration

### 1. Enable OAuth Providers in Supabase Dashboard

Navigate to your Supabase project dashboard:

1. Go to **Authentication** > **Providers**
2. Enable **Google** and **Apple** providers
3. Configure each provider with the credentials from the steps below

### 2. Google OAuth Setup

#### A. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google Sign-In API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**

#### B. Create OAuth Clients

Create **3 separate OAuth clients** for different platforms:

**1. Web Client (for Supabase)**

- Application type: Web application
- Authorized redirect URIs: `https://[your-supabase-project].supabase.co/auth/v1/callback`

**2. iOS Client**

- Application type: iOS
- Bundle ID: `com.runningmate.app` (or your bundle ID)

**3. Android Client**

- Application type: Android
- Package name: `com.runningmate.app` (or your package name)
- SHA-1 certificate fingerprint: Get from EAS or Android Studio

#### C. Configure Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers** > **Google**
2. Enable Google provider
3. Add the **Web Client** Client ID and Client Secret
4. Set redirect URL: `https://[your-supabase-project].supabase.co/auth/v1/callback`

### 3. Apple OAuth Setup

#### A. Apple Developer Account Setup

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID** with Sign In with Apple capability enabled
4. Create a **Services ID** for web authentication

#### B. Configure Services ID

1. Enable **Sign In with Apple** for your Services ID
2. Add domain: `[your-supabase-project].supabase.co`
3. Add redirect URL: `https://[your-supabase-project].supabase.co/auth/v1/callback`

#### C. Generate Key

1. Go to **Keys** section
2. Create a new key with **Sign In with Apple** capability
3. Download the `.p8` key file (save it securely)

#### D. Configure Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers** > **Apple**
2. Enable Apple provider
3. Add your Services ID as Client ID
4. Upload the `.p8` key file or paste the key content
5. Add your Team ID and Key ID from Apple Developer account

## Mobile App Configuration

### 1. Environment Variables

Add to your `.env.local` file:

```env
# Supabase (already configured)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# OAuth Configuration (optional - handled by Supabase)
# These are handled automatically by the Supabase integration
```

### 2. App Configuration

The `app.config.js` is already configured with:

```javascript
export default {
  expo: {
    // ... other config
    scheme: 'runningmate', // For deep linking
    plugins: [
      'expo-apple-authentication', // For Apple Sign-In
      // ... other plugins
    ],
    ios: {
      bundleIdentifier: 'com.runningmate.app',
    },
    android: {
      package: 'com.runningmate.app',
    },
  },
};
```

### 3. Deep Linking Setup

For OAuth callbacks to work properly, ensure your app handles the redirect:

```javascript
// This is already configured in lib/oauth.ts
const oauth = {
  redirectUri: makeRedirectUri({
    scheme: 'runningmate',
    path: 'auth/callback',
  }),
};
```

## Testing OAuth Integration

### Development Testing

1. **Expo Go**: OAuth won't work in Expo Go due to security restrictions
2. **Development Build**: Create a development build with EAS:

   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

3. **iOS Simulator**: Apple Sign-In won't work in simulator (device only)
4. **Android Emulator**: Google Sign-In should work in emulator

### Testing Steps

1. **Build Development Version**:

   ```bash
   # Install EAS CLI
   npm install -g @expo/eas-cli

   # Configure project
   eas build:configure

   # Build for testing
   eas build --profile development --platform all
   ```

2. **Test on Device**:
   - Install the development build on a physical device
   - Test Google Sign-In on both iOS and Android
   - Test Apple Sign-In on iOS device (not simulator)

3. **Verify in Supabase**:
   - Check that users are created in Supabase auth dashboard
   - Verify user metadata is populated correctly

## Production Setup

### 1. App Store Connect (iOS)

1. Upload your app to App Store Connect
2. Enable **Sign In with Apple** capability
3. Ensure Bundle ID matches your OAuth configuration

### 2. Google Play Console (Android)

1. Upload your app to Play Console
2. Get the SHA-1 fingerprint from Play Console
3. Update your Google OAuth client with the production SHA-1

### 3. Production Build

```bash
# Build for production
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Troubleshooting

### Common Issues

1. **"Invalid Client ID" Error**
   - Verify OAuth client IDs match platform (iOS/Android/Web)
   - Check Bundle ID / Package Name matches OAuth configuration

2. **Apple Sign-In Not Working**
   - Only works on physical iOS devices, not simulator
   - Ensure Services ID is properly configured
   - Check Team ID and Key ID are correct

3. **Google Sign-In Fails**
   - Verify SHA-1 certificate matches registered fingerprint
   - Check that Google+ API is enabled
   - Ensure redirect URI is correctly configured

4. **Deep Linking Issues**
   - Verify app scheme matches `makeRedirectUri` configuration
   - Check that URL handling is properly set up

### Debug Steps

1. **Enable Debug Logging**:

   ```javascript
   // Add to your AuthContext for debugging
   console.log('OAuth Result:', { data, error });
   ```

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard > Logs
   - Monitor auth events during OAuth flow

3. **Verify Network Requests**:
   - Use React Native Debugger or Flipper
   - Check OAuth redirect URLs and responses

## Security Considerations

1. **Client Secrets**: Never include client secrets in mobile app code
2. **Bundle/Package ID**: Keep consistent across all platforms
3. **Redirect URIs**: Use HTTPS for production redirects
4. **Key Management**: Store Apple private keys securely
5. **Scope Permissions**: Request only necessary user permissions

## OAuth Flow Summary

1. User taps Google/Apple sign-in button
2. App opens OAuth provider's authentication page
3. User completes authentication with provider
4. Provider redirects back to Supabase with auth code
5. Supabase exchanges code for tokens and creates user session
6. App receives authentication result and navigates user to main screen

The integration is now complete and ready for testing!
