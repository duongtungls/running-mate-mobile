import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useI18n = () => {
  const { t, i18n: i18nInstance } = useTranslation();

  const changeLanguage = async (language: string) => {
    try {
      await i18nInstance.changeLanguage(language);
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return i18nInstance.language;
  };

  const getAvailableLanguages = () => {
    return ['en', 'ko', 'vi', 'zh'];
  };

  const getLanguageDisplayName = (langCode: string) => {
    const displayNames: Record<string, string> = {
      en: 'English',
      ko: '한국어',
      vi: 'Tiếng Việt',
      zh: '中文',
    };
    return displayNames[langCode] || langCode;
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageDisplayName,
    currentLanguage: i18nInstance.language,
    isReady: i18nInstance.isInitialized,
  };
};

export default useI18n;
