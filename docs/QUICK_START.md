# Quick Start Guide - RunningMate Mobile

## 🚀 Getting Started

### 1. Environment Setup

Create `.env.local` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 2. Install Dependencies & Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

### 3. Testing the App

#### Option A: Expo Go (Limited)

- Install Expo Go on your device
- Scan QR code from terminal
- **Note**: OAuth won't work in Expo Go

#### Option B: Development Build (Recommended for OAuth)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Create development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

## 📱 Features Available

### ✅ Currently Working

- **Email/Password Authentication** - Login and signup
- **User Profile** - Display user info from Supabase
- **Training Plans Integration** - Connect to web app API
- **Notifications** - Mobile notification system
- **Mobile UI** - Touch-friendly interface

### 🔄 OAuth Features (Requires Setup)

- **Google Sign-In** - Needs Google Cloud Console setup
- **Apple Sign-In** - Needs Apple Developer account setup

## 🔧 OAuth Testing

### For Google & Apple Sign-In:

1. **Configure Supabase**
   - Enable OAuth providers in Supabase dashboard
   - See `OAUTH_SETUP.md` for detailed instructions

2. **Create Development Build**

   ```bash
   eas build --profile development --platform ios
   ```

3. **Test on Physical Device**
   - OAuth requires development build on device
   - Apple Sign-In only works on physical iOS devices

## 🐛 Common Issues

### App Won't Start

```bash
# Clear cache and restart
npx expo start --clear
```

### OAuth Errors

- OAuth only works with development builds, not Expo Go
- Ensure Supabase OAuth providers are configured
- Check that bundle IDs match OAuth configuration

### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Current Integration Status

| Feature            | Status            | Notes                        |
| ------------------ | ----------------- | ---------------------------- |
| Authentication     | ✅ Complete       | Email/password + OAuth ready |
| Training Plans     | ✅ Complete       | Syncs with web app API       |
| Notifications      | ✅ Complete       | Mobile notification system   |
| Profile Management | ✅ Complete       | User data from Supabase      |
| OAuth (Google)     | 🔧 Setup Required | Needs Google Cloud config    |
| OAuth (Apple)      | 🔧 Setup Required | Needs Apple Developer config |
| Offline Support    | 🔄 Basic          | AsyncStorage for basic data  |
| Push Notifications | 📋 Planned        | Framework ready              |

## 🎯 Next Steps

1. **Test Basic Features**: Start with email authentication
2. **Setup OAuth**: Follow `OAUTH_SETUP.md` for social login
3. **Create Development Build**: For OAuth testing
4. **Deploy to Stores**: When ready for production

The app is now fully integrated with your web application's backend!
