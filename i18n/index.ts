import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import ko from './locales/ko.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Try to get saved language preference
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Fall back to device locale
      const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
      let detectedLang = 'en'; // default

      if (deviceLocale.includes('ko')) {
        detectedLang = 'ko';
      } else if (deviceLocale.includes('vi')) {
        detectedLang = 'vi';
      } else if (deviceLocale.includes('zh')) {
        detectedLang = 'zh';
      }

      callback(detectedLang);
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  vi: { translation: vi },
  zh: { translation: zh },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    // i18n initialized successfully
  })
  .catch((error) => {
    console.error('[i18n] Initialization error:', error);
  });

export default i18n;
