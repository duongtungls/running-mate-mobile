import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  UserProfile,
  RunningStats,
  Achievement,
  UserGoal,
  ProfileUpdateData,
} from '../types/profile';
import {
  profileAPI,
  statsAPI,
  achievementsAPI,
  goalsAPI,
} from '../lib/profile-api';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  // Profile data
  profile: UserProfile | null;
  stats: RunningStats | null;
  achievements: Achievement[];
  goals: UserGoal[];

  // Loading states
  profileLoading: boolean;
  statsLoading: boolean;
  achievementsLoading: boolean;
  goalsLoading: boolean;

  // Profile operations
  loadProfile: () => Promise<void>;
  updateProfile: (
    updates: ProfileUpdateData,
  ) => Promise<{ success: boolean; error?: any }>;
  uploadAvatar: (file: any) => Promise<{ success: boolean; error?: any }>;

  // Stats operations
  loadStats: () => Promise<void>;
  updateStats: (
    stats: Partial<RunningStats>,
  ) => Promise<{ success: boolean; error?: any }>;

  // Achievements operations
  loadAchievements: () => Promise<void>;
  addAchievement: (
    achievement: Omit<Achievement, 'id' | 'earned_at' | 'user_id'>,
  ) => Promise<{ success: boolean; error?: any }>;

  // Goals operations
  loadGoals: () => Promise<void>;
  createGoal: (
    goal: Omit<UserGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<{ success: boolean; error?: any }>;
  updateGoal: (
    goalId: string,
    updates: Partial<UserGoal>,
  ) => Promise<{ success: boolean; error?: any }>;
  deleteGoal: (goalId: string) => Promise<{ success: boolean; error?: any }>;

  // Utility functions
  refreshAll: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();

  // State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<RunningStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [goalsLoading, setGoalsLoading] = useState(false);

  // Profile operations
  const loadProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      const { data, error } = await profileAPI.getProfile(user.id);

      if (error && error.code !== 'PGRST116') {
        console.error('[ProfileContext] Error loading profile:', error);
        return;
      }

      // If no profile exists, create a default one
      if (!data) {
        // No profile found, creating default profile
        const defaultProfile = {
          user_id: user.id,
          full_name:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'Runner',
          bio: '',
          preferred_units: 'metric' as const,
          preferred_language: 'en',
          privacy_settings: {
            profile_visibility: 'public' as const,
            activity_visibility: 'public' as const,
            stats_visibility: 'public' as const,
          },
          notifications_settings: {
            email_notifications: true,
            push_notifications: true,
            training_reminders: true,
            achievement_updates: true,
            social_updates: true,
          },
        };

        const { data: createdProfile, error: createError } =
          await profileAPI.createProfile(defaultProfile);
        if (!createError && createdProfile) {
          setProfile(createdProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('[ProfileContext] Exception loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdateData) => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      const { data, error } = await profileAPI.updateProfile(user.id, updates);

      if (error) {
        console.error('[ProfileContext] Error updating profile:', error);
        return { success: false, error };
      }

      if (data) {
        setProfile(data);
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception updating profile:', error);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: any) => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      const { data, error } = await profileAPI.uploadAvatar(user.id, file);

      if (error) {
        console.error('[ProfileContext] Error uploading avatar:', error);
        return { success: false, error };
      }

      // Update profile with new avatar URL
      if (data) {
        await updateProfile({ avatar_url: data });
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception uploading avatar:', error);
      return { success: false, error };
    }
  };

  // Stats operations
  const loadStats = async () => {
    if (!user) return;

    setStatsLoading(true);
    try {
      const { data, error } = await statsAPI.getStats(user.id);

      if (error && error.code !== 'PGRST116') {
        console.error('[ProfileContext] Error loading stats:', error);
        return;
      }

      // If no stats exist, create default ones
      if (!data) {
        // No stats found, creating default stats
        const defaultStats = {
          id: user.id, // user_stats table uses 'id' field
          total_runs: 0,
          total_distance: 0,
          total_time: 0,
          current_streak: 0,
          longest_streak: 0,
          total_elevation_gain: 0,
          calories_burned: 0,
        };

        const { data: createdStats, error: createError } =
          await statsAPI.updateStats(user.id, defaultStats);
        if (!createError && createdStats) {
          setStats(createdStats);
        }
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('[ProfileContext] Exception loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const updateStats = async (updates: Partial<RunningStats>) => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      const { data, error } = await statsAPI.updateStats(user.id, updates);

      if (error) {
        console.error('[ProfileContext] Error updating stats:', error);
        return { success: false, error };
      }

      if (data) {
        setStats(data);
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception updating stats:', error);
      return { success: false, error };
    }
  };

  // Achievements operations
  const loadAchievements = async () => {
    if (!user) return;

    setAchievementsLoading(true);
    try {
      const { data, error } = await achievementsAPI.getAchievements(user.id);

      if (error) {
        console.error('[ProfileContext] Error loading achievements:', error);
        return;
      }

      setAchievements(data);
    } catch (error) {
      console.error('[ProfileContext] Exception loading achievements:', error);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const addAchievement = async (
    achievement: Omit<Achievement, 'id' | 'earned_at' | 'user_id'>,
  ) => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      const { data, error } = await achievementsAPI.addAchievement({
        ...achievement,
        user_id: user.id,
      });

      if (error) {
        console.error('[ProfileContext] Error adding achievement:', error);
        return { success: false, error };
      }

      if (data) {
        setAchievements((prev) => [data, ...prev]);
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception adding achievement:', error);
      return { success: false, error };
    }
  };

  // Goals operations
  const loadGoals = async () => {
    if (!user) return;

    setGoalsLoading(true);
    try {
      const { data, error } = await goalsAPI.getGoals(user.id);

      if (error) {
        console.error('[ProfileContext] Error loading goals:', error);
        return;
      }

      setGoals(data);
    } catch (error) {
      console.error('[ProfileContext] Exception loading goals:', error);
    } finally {
      setGoalsLoading(false);
    }
  };

  const createGoal = async (
    goal: Omit<UserGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      const { data, error } = await goalsAPI.createGoal({
        ...goal,
        user_id: user.id,
      });

      if (error) {
        console.error('[ProfileContext] Error creating goal:', error);
        return { success: false, error };
      }

      if (data) {
        setGoals((prev) => [data, ...prev]);
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception creating goal:', error);
      return { success: false, error };
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<UserGoal>) => {
    try {
      const { data, error } = await goalsAPI.updateGoal(goalId, updates);

      if (error) {
        console.error('[ProfileContext] Error updating goal:', error);
        return { success: false, error };
      }

      if (data) {
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? data : goal)),
        );
      }

      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception updating goal:', error);
      return { success: false, error };
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await goalsAPI.deleteGoal(goalId);

      if (error) {
        console.error('[ProfileContext] Error deleting goal:', error);
        return { success: false, error };
      }

      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      return { success: true };
    } catch (error) {
      console.error('[ProfileContext] Exception deleting goal:', error);
      return { success: false, error };
    }
  };

  // Utility functions
  const refreshAll = async () => {
    await Promise.all([
      loadProfile(),
      loadStats(),
      loadAchievements(),
      loadGoals(),
    ]);
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      // Clear data when user logs out
      setProfile(null);
      setStats(null);
      setAchievements([]);
      setGoals([]);
    }
  }, [user]);

  const value: ProfileContextType = {
    // Profile data
    profile,
    stats,
    achievements,
    goals,

    // Loading states
    profileLoading,
    statsLoading,
    achievementsLoading,
    goalsLoading,

    // Profile operations
    loadProfile,
    updateProfile,
    uploadAvatar,

    // Stats operations
    loadStats,
    updateStats,

    // Achievements operations
    loadAchievements,
    addAchievement,

    // Goals operations
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,

    // Utility functions
    refreshAll,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
