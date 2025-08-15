# Path Aliases in Mobile App

This document explains how to use the path aliases set up in the React Native Expo mobile app to avoid messy relative imports.

## Available Aliases

| Alias            | Path             | Description                 |
| ---------------- | ---------------- | --------------------------- |
| `@/`             | `./`             | Root of mobile app          |
| `@/app/*`        | `./app/*`        | App screens and layouts     |
| `@/components/*` | `./components/*` | Reusable components         |
| `@/hooks/*`      | `./hooks/*`      | Custom React hooks          |
| `@/assets/*`     | `./assets/*`     | Images, fonts, etc.         |
| `@/constants/*`  | `./constants/*`  | App constants               |
| `@/utils/*`      | `./utils/*`      | Utility functions           |
| `@/types/*`      | `./types/*`      | TypeScript type definitions |
| `@/services/*`   | `./services/*`   | API services                |
| `@/store/*`      | `./store/*`      | State management            |
| `@/shared/*`     | `../shared/*`    | Shared code with web app    |

## Before and After

### ❌ Before (with relative imports)

```typescript
import GradientBackground from '../../components/GradientBackground';
import { formatDistance } from '../../../utils/formatting';
import { User } from '../../../../shared/types/user';
```

### ✅ After (with aliases)

```typescript
import GradientBackground from '@/components/GradientBackground';
import { formatDistance } from '@/utils';
import { User } from '@/shared/types';
```

## Usage Examples

### Importing Components

```typescript
// Components
import Button from '@/components/Button';
import Header from '@/components/Header';
import GradientBackground from '@/components/GradientBackground';
```

### Importing Constants and Utils

```typescript
// Constants
import { COLORS, SPACING, FONT_SIZES } from '@/constants';

// Utils
import { formatDistance, formatDuration, calculatePace } from '@/utils';
```

### Importing Types

```typescript
// Mobile-specific types
import { MobileUser, NavigationProps } from '@/types';

// Shared types from web app
import { Activity, TrainingPlan, ApiResponse } from '@/shared/types';
```

### Importing from App Directory

```typescript
// Screens
import LoginScreen from '@/app/(auth)/login';
import HomeScreen from '@/app/(tabs)/index';
```

### Importing Assets

```typescript
// Images
import { Image } from 'react-native';
const logo = require('@/assets/images/logo.png');

// Using with Image component
<Image source={require('@/assets/images/hero.jpg')} />
```

## Configuration Files

The aliases are configured in:

1. **`tsconfig.json`** - TypeScript path mapping
2. **`babel.config.js`** - Runtime module resolution

## Development Tips

1. **Consistent Usage**: Always use aliases instead of relative imports
2. **Absolute Paths**: Aliases make refactoring easier since paths don't change
3. **Shared Code**: Use `@/shared/*` to import code shared with the web app
4. **IntelliSense**: Your IDE should provide autocomplete for these paths

## Common Patterns

### Screen Components

```typescript
// app/(tabs)/profile.tsx
import React from 'react';
import { View } from 'react-native';
import { ProfileHeader, ActivityList } from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/constants';
```

### Service Files

```typescript
// services/api.ts
import { ApiResponse } from '@/shared/types';
import { API_ENDPOINTS } from '@/shared/utils/constants';
```

### Custom Hooks

```typescript
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { MobileUser } from '@/types';
import { apiService } from '@/services/api';
```

## Troubleshooting

If aliases don't work:

1. Restart the Metro bundler: `npm run dev`
2. Clear cache: `expo start --clear`
3. Check that both `tsconfig.json` and `babel.config.js` are properly configured
