/**
 * Design tokens converted from web app's Tailwind CSS custom properties
 * Maintains exact same visual consistency across platforms
 */

// Helper function to convert HSL to hex color
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Helper function to convert HSL to rgba
function hslToRgba(h: number, s: number, l: number, alpha: number = 1): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return `rgba(${f(0)}, ${f(8)}, ${f(4)}, ${alpha})`;
}

// Light theme colors (current mobile app theme)
export const lightTheme = {
  // Main colors
  background: '#ffffff',
  foreground: '#0f172a',

  // Card colors
  card: '#ffffff',
  cardForeground: '#0f172a',

  // Popover colors
  popover: '#ffffff',
  popoverForeground: '#0f172a',

  // Primary colors (keeping current green-blue)
  primary: hslToHex(199, 89, 48), // #0ea5e9 - cyan-blue
  primaryForeground: '#ffffff',

  // Secondary colors
  secondary: hslToHex(210, 40, 96), // #f1f5f9
  secondaryForeground: hslToHex(222, 47, 11), // #1e293b

  // Muted colors
  muted: hslToHex(210, 40, 96), // #f1f5f9
  mutedForeground: hslToHex(215, 16, 47), // #64748b

  // Accent colors
  accent: hslToHex(210, 40, 96), // #f1f5f9
  accentForeground: hslToHex(222, 47, 11), // #1e293b

  // Status colors
  destructive: hslToHex(0, 84, 60), // #ef4444
  destructiveForeground: '#ffffff',
  success: hslToHex(142, 76, 36), // #16a34a
  successForeground: '#ffffff',
  warning: hslToHex(38, 92, 50), // #f59e0b
  warningForeground: '#ffffff',

  // Border colors
  border: hslToHex(214, 32, 91), // #e2e8f0
  input: hslToHex(214, 32, 91), // #e2e8f0
  ring: hslToHex(222, 84, 5), // #0f172a

  // Gradient colors (current mobile app gradient)
  gradientStart: '#22c55e', // green-500
  gradientMiddle: '#0d9488', // teal-600
  gradientEnd: '#0891b2', // sky-600
};

// Dark theme colors (from web app's CSS custom properties)
export const darkTheme = {
  // Main colors - hsl(210 11% 15%) = #242933
  background: hslToHex(210, 11, 15),
  foreground: hslToHex(213, 31, 91), // #e2e8f0

  // Card colors - hsl(217 19% 18%) = #272e3f
  card: hslToHex(217, 19, 18),
  cardForeground: hslToHex(213, 31, 91),

  // Popover colors
  popover: hslToHex(217, 19, 18),
  popoverForeground: hslToHex(213, 31, 91),

  // Primary colors - hsl(199 89% 48%) = #0ea5e9
  primary: hslToHex(199, 89, 48),
  primaryForeground: hslToHex(210, 11, 15), // dark background

  // Secondary colors - hsl(217 19% 27%) = #3c4557
  secondary: hslToHex(217, 19, 27),
  secondaryForeground: hslToHex(213, 31, 91),

  // Muted colors
  muted: hslToHex(217, 19, 27),
  mutedForeground: hslToHex(215, 20, 65), // #9ca3af

  // Accent colors
  accent: hslToHex(217, 19, 27),
  accentForeground: hslToHex(213, 31, 91),

  // Status colors
  destructive: hslToHex(0, 63, 31), // #7f1d1d - darker red
  destructiveForeground: hslToHex(210, 40, 98),
  success: hslToHex(142, 76, 36), // #16a34a - same green
  successForeground: hslToHex(356, 100, 97),
  warning: hslToHex(38, 92, 50), // #f59e0b - same orange
  warningForeground: hslToHex(48, 96, 89),

  // Border colors
  border: hslToHex(217, 19, 27),
  input: hslToHex(217, 19, 27),
  ring: hslToHex(199, 89, 48), // primary color

  // Dark gradient colors (based on dark theme background tokens)
  gradientStart: hslToHex(210, 11, 15), // background: #242933
  gradientMiddle: hslToHex(217, 19, 18), // card: #272e3f
  gradientEnd: hslToHex(217, 19, 27), // secondary: #3c4557
};

// Theme type definition
export type Theme = typeof lightTheme;

// Helper functions for rgba colors with opacity
export const createRgbaColor = (baseColor: string, opacity: number): string => {
  // Extract RGB from hex color
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Common opacity variants used throughout the app
export const opacity = {
  1: 0.05, // Very subtle
  2: 0.1, // Subtle backgrounds
  3: 0.2, // Muted elements
  4: 0.3, // Borders, dividers
  5: 0.4, // Secondary text
  6: 0.6, // Muted text
  7: 0.7, // Regular text
  8: 0.8, // Primary text
  9: 0.9, // High contrast
};

// Status bar styles for each theme
export const statusBarStyles = {
  light: 'dark-content' as const,
  dark: 'light-content' as const,
};

export type ThemeMode = 'light' | 'dark' | 'system';
