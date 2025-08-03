// Mobile app specific types
export interface MobileUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  preferences: {
    units: 'metric' | 'imperial';
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface NavigationProps {
  navigation: {
    navigate: (name: string, params?: object) => void;
    goBack: () => void;
    push: (name: string, params?: object) => void;
    replace: (name: string, params?: object) => void;
  };
  route: {
    params?: Record<string, unknown>;
    name: string;
    key: string;
  };
}

export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

// Re-export shared types with alias
export * from '@/shared/types';
