import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Theme,
  ThemeMode,
  lightTheme,
  darkTheme,
  statusBarStyles,
} from '../constants/designTokens';

interface ThemeContextType {
  // Theme state
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;

  // Theme actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Status bar style for current theme
  statusBarStyle: 'light-content' | 'dark-content';

  // Loading state
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@runningmate_theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Determine the actual theme based on mode and system preference
  const getActualTheme = (themeMode: ThemeMode): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const actualTheme = getActualTheme(mode);
  const theme = actualTheme === 'dark' ? darkTheme : lightTheme;
  const isDark = actualTheme === 'dark';
  const statusBarStyle = statusBarStyles[actualTheme];

  // Load theme preference from storage on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('[ThemeContext] Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage whenever it changes
  const setThemeMode = async (newMode: ThemeMode) => {
    try {
      setMode(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('[ThemeContext] Error saving theme preference:', error);
    }
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    if (mode === 'system') {
      // If currently system, toggle to opposite of current system theme
      const newMode = systemColorScheme === 'dark' ? 'light' : 'dark';
      setThemeMode(newMode);
    } else {
      // If currently light or dark, toggle to opposite
      const newMode = mode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
    }
  };

  const value: ThemeContextType = {
    theme,
    mode,
    isDark,
    setThemeMode,
    toggleTheme,
    statusBarStyle,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
