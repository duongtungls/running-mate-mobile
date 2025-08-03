# Internationalization (i18n) for React Native Mobile App

This mobile app supports multiple languages using `react-i18next` and `expo-localization`.

## Supported Languages

- **English (en)** - Default language
- **Korean (ko)** - 한국어
- **Vietnamese (vi)** - Tiếng Việt
- **Chinese (zh)** - 中文

## Setup

The i18n system is automatically initialized when the app starts. The configuration is in `/i18n/index.ts`.

## Usage

### Using the i18n hook

```typescript
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t, changeLanguage, currentLanguage } = useI18n();

  return (
    <View>
      <Text>{t('common.welcome')}</Text>
      <Text>{t('home.subtitle')}</Text>
    </View>
  );
}
```

### Available Methods

- `t(key)` - Translate a key to the current language
- `changeLanguage(langCode)` - Change the app language
- `getCurrentLanguage()` - Get current language code
- `getAvailableLanguages()` - Get array of supported language codes
- `getLanguageDisplayName(langCode)` - Get display name for a language
- `currentLanguage` - Current language code
- `isReady` - Boolean indicating if i18n is initialized

### Language Selector Component

Use the built-in `LanguageSelector` component to allow users to change languages:

```typescript
import LanguageSelector from '@/components/LanguageSelector';

function SettingsScreen() {
  return (
    <View>
      <LanguageSelector />
    </View>
  );
}
```

## Language Detection

The app automatically detects the user's preferred language in this order:

1. **Saved language preference** - From AsyncStorage
2. **Device locale** - From expo-localization
3. **Default fallback** - English (en)

## Translation Files

Translation files are located in `/i18n/locales/`:

- `en.json` - English translations
- `ko.json` - Korean translations
- `vi.json` - Vietnamese translations
- `zh.json` - Chinese translations

### Translation File Structure

```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "home": {
    "welcome": "Welcome to RunningMate",
    "subtitle": "Your AI-powered running companion"
  }
}
```

### Using Nested Keys

Access nested translations using dot notation:

```typescript
const { t } = useI18n();

// Access nested key
const welcomeMessage = t('home.welcome');
const loadingText = t('common.loading');
```

## Adding New Translations

1. Add the key to all language files
2. Use the key in your component with `t('your.new.key')`

Example:

```json
// en.json
{
  "profile": {
    "editProfile": "Edit Profile"
  }
}

// ko.json
{
  "profile": {
    "editProfile": "프로필 편집"
  }
}
```

## Best Practices

1. **Use semantic keys** - `auth.signIn` instead of `signInButton`
2. **Group related translations** - Put all auth-related strings under `auth`
3. **Provide fallbacks** - Always add the key to all language files
4. **Test all languages** - Make sure text fits in your UI for all languages
5. **Use the hook consistently** - Import and use `useI18n` in every component that needs translations

## Examples

Check out these files for implementation examples:

- `/app/settings/index.tsx` - Settings page with language selector
- `/app/(tabs)/index.tsx` - Home screen with translated content
- `/components/LanguageSelector.tsx` - Language selection modal

## Troubleshooting

### "Translation not found" warnings

Make sure the key exists in all language files:

```json
// Missing key in one language file will show fallback
{
  "common": {
    "save": "Save" // ← Make sure this exists in all files
  }
}
```

### Language not persisting

The app saves language preferences to AsyncStorage automatically. If having issues:

1. Check device storage permissions
2. Verify AsyncStorage is working
3. Check console for error logs
