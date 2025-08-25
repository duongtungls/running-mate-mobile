// Re-export the useTheme hook from ThemeContext for convenience
// This allows consistent imports: import { useTheme } from '@/hooks/useTheme'
export { useTheme } from '../contexts/ThemeContext';

// Export additional theme utilities
export * from '../constants/designTokens';
