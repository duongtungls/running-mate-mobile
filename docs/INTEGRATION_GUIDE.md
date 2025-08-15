# RunningMate Mobile Integration Guide

This document outlines how the mobile app integrates with the web app's Supabase backend and API services.

## Setup Instructions

1. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Configure the following variables:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     EXPO_PUBLIC_API_BASE_URL=http://localhost:3000  # Web app URL
     ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

## Integration Architecture

### 1. Authentication (`contexts/AuthContext.tsx`)

- Uses Supabase Auth for user authentication
- Shared session management with web app
- Automatic token refresh and persistence
- OAuth support (Google, Apple) ready to implement

### 2. API Service Layer (`lib/api.ts`)

- Centralized service for API calls to web app
- Automatic authentication header injection
- Error handling and retry logic
- Supports both direct Supabase calls and REST API endpoints

### 3. Training Plans Integration (`contexts/TrainingContext.tsx`)

- Fetches training plans from web app API
- Real-time updates via Supabase subscriptions (can be added)
- Offline caching support (can be enhanced)
- Mobile-optimized workout display

### 4. Notifications System (`contexts/NotificationContext.tsx`)

- Syncs with web app notification system
- Push notifications support (can be added)
- Real-time notification updates
- Mobile-specific notification handling

## Shared Features

### Authentication

- ✅ Email/Password login and signup
- ✅ Password reset functionality
- ✅ Session persistence
- 🔄 OAuth providers (Google, Apple) - Ready to implement
- ✅ Automatic session management

### Training Plans

- ✅ View training plans from web app
- ✅ AI-generated plan integration
- ✅ Workout scheduling and tracking
- 🔄 Progress synchronization - Can be enhanced
- ✅ Mobile-optimized workout display

### Notifications

- ✅ Notification list and management
- ✅ Mark as read functionality
- ✅ Real-time notification count
- 🔄 Push notifications - Can be added
- ✅ Mobile-specific notification UI

### User Profile

- ✅ User data from Supabase Auth
- ✅ Profile picture and settings sync
- ✅ Account management (sign out)
- 🔄 Profile editing - Can be enhanced

## Mobile-Specific Features

### UI/UX Adaptations

- **Touch-friendly interface**: Larger touch targets, swipe gestures
- **Mobile navigation**: Bottom tabs, native-feeling navigation
- **Responsive design**: Adapts to different screen sizes
- **Dark theme support**: Gradient backgrounds with mobile-optimized colors

### Performance Optimizations

- **Lazy loading**: Components load as needed
- **Image optimization**: Cached and compressed images
- **Minimal bundle size**: Tree-shaking and code splitting
- **Smooth animations**: Native performance with React Native

### Mobile Platform Features

- **Deep linking**: URL scheme for notifications and sharing
- **Biometric auth**: Ready to implement (Face ID, Touch ID)
- **Offline support**: Basic offline functionality with AsyncStorage
- **Push notifications**: Framework ready for implementation

## API Endpoints Used

The mobile app integrates with the following web app endpoints:

### Authentication

- `POST /api/auth/signin` - Email/password login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/reset-password` - Password reset

### Profile

- `GET /api/profile` - User profile data
- `PUT /api/profile` - Update profile

### Training Plans

- `GET /api/training/plans` - List training plans
- `POST /api/training/generate-plan` - Generate new plan
- `GET /api/training/plans/:id` - Get specific plan

### Notifications

- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/:id` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

### Activities

- `GET /api/activities` - List user activities
- `POST /api/activity/analyze` - Analyze activity

## Development Workflow

1. **Web App Changes**: When adding new features to the web app
2. **API Updates**: Ensure API endpoints are mobile-friendly
3. **Mobile Integration**: Update mobile service layer and contexts
4. **UI Implementation**: Create mobile-specific UI components
5. **Testing**: Test integration between web and mobile apps

## Next Steps for Enhanced Integration

1. **Real-time Sync**: Add Supabase real-time subscriptions
2. **Push Notifications**: Implement Expo notifications
3. **Offline Support**: Enhanced offline data persistence
4. **Biometric Auth**: Add Face ID/Touch ID support
5. **Deep Linking**: Enhanced URL routing and sharing
6. **Performance Monitoring**: Add analytics and crash reporting

## Troubleshooting

### Common Issues

1. **Authentication Token Errors**
   - Check Supabase configuration
   - Verify JWT token expiration handling
   - Ensure proper session management

2. **API Connection Issues**
   - Verify `EXPO_PUBLIC_API_BASE_URL` is correct
   - Check network permissions
   - Ensure web app CORS settings allow mobile requests

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Expo CLI version compatibility
   - Verify all required environment variables are set

### Development Tips

- Use Expo DevTools for debugging
- Enable network inspection for API calls
- Test on both iOS and Android devices
- Use Flipper for advanced debugging
