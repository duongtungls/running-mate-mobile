import { supabase } from './supabase';
import {
  UserProfile,
  RunningStats,
  Achievement,
  UserGoal,
  ProfileUpdateData,
} from '../types/profile';

// Profile CRUD operations
export const profileAPI = {
  // Get user profile
  getProfile: async (
    userId: string,
  ): Promise<{ data: UserProfile | null; error: any }> => {
    try {
      // Getting profile for user

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found"
        console.error('[ProfileAPI] Error getting profile:', error);
        return { data: null, error };
      }

      // Profile data retrieved
      return { data: data || null, error: null };
    } catch (err) {
      console.error('[ProfileAPI] Exception getting profile:', err);
      return { data: null, error: err };
    }
  },

  // Create user profile
  createProfile: async (
    profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<{ data: UserProfile | null; error: any }> => {
    try {
      // Creating profile

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profile])
        .select()
        .single();

      if (error) {
        console.error('[ProfileAPI] Error creating profile:', error);
        return { data: null, error };
      }

      // Profile created
      return { data, error: null };
    } catch (err) {
      console.error('[ProfileAPI] Exception creating profile:', err);
      return { data: null, error: err };
    }
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    updates: ProfileUpdateData,
  ): Promise<{ data: UserProfile | null; error: any }> => {
    try {
      // Updating profile for user

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('[ProfileAPI] Error updating profile:', error);
        return { data: null, error };
      }

      // Profile updated
      return { data, error: null };
    } catch (err) {
      console.error('[ProfileAPI] Exception updating profile:', err);
      return { data: null, error: err };
    }
  },

  // Upload profile avatar
  uploadAvatar: async (
    userId: string,
    file: any,
  ): Promise<{ data: string | null; error: any }> => {
    try {
      // Uploading avatar for user

      const fileExt = file.name?.split('.').pop() || 'jpg';
      const fileName = `${userId}/avatar.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('[ProfileAPI] Error uploading avatar:', error);
        return { data: null, error };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Avatar uploaded successfully

      // Update profile with new avatar URL
      await supabase
        .from('user_profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('user_id', userId);

      return { data: urlData.publicUrl, error: null };
    } catch (err) {
      console.error('[ProfileAPI] Exception uploading avatar:', err);
      return { data: null, error: err };
    }
  },

  // Delete user profile
  deleteProfile: async (userId: string): Promise<{ error: any }> => {
    try {
      // Deleting profile for user

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('[ProfileAPI] Error deleting profile:', error);
        return { error };
      }

      // Profile deleted successfully
      return { error: null };
    } catch (err) {
      console.error('[ProfileAPI] Exception deleting profile:', err);
      return { error: err };
    }
  },
};

// Running stats operations
export const statsAPI = {
  // Get running stats
  getStats: async (
    userId: string,
  ): Promise<{ data: RunningStats | null; error: any }> => {
    try {
      // Getting stats for user

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId) // user_stats table uses 'id' field referencing users(id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[StatsAPI] Error getting stats:', error);
        return { data: null, error };
      }

      // Stats data retrieved
      return { data: data || null, error: null };
    } catch (err) {
      console.error('[StatsAPI] Exception getting stats:', err);
      return { data: null, error: err };
    }
  },

  // Update running stats
  updateStats: async (
    userId: string,
    stats: Partial<RunningStats>,
  ): Promise<{ data: RunningStats | null; error: any }> => {
    try {
      // Updating stats for user

      const { data, error } = await supabase
        .from('user_stats')
        .upsert({
          id: userId, // user_stats uses 'id' field
          ...stats,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[StatsAPI] Error updating stats:', error);
        return { data: null, error };
      }

      // Stats updated
      return { data, error: null };
    } catch (err) {
      console.error('[StatsAPI] Exception updating stats:', err);
      return { data: null, error: err };
    }
  },
};

// Achievements operations
export const achievementsAPI = {
  // Get user achievements
  getAchievements: async (
    userId: string,
  ): Promise<{ data: Achievement[]; error: any }> => {
    try {
      // Getting achievements for user

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('[AchievementsAPI] Error getting achievements:', error);
        return { data: [], error };
      }

      // Achievements data retrieved
      return { data: data || [], error: null };
    } catch (err) {
      console.error('[AchievementsAPI] Exception getting achievements:', err);
      return { data: [], error: err };
    }
  },

  // Add achievement
  addAchievement: async (
    achievement: Omit<Achievement, 'id' | 'earned_at'>,
  ): Promise<{ data: Achievement | null; error: any }> => {
    try {
      // Adding achievement

      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          {
            ...achievement,
            earned_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('[AchievementsAPI] Error adding achievement:', error);
        return { data: null, error };
      }

      // Achievement added
      return { data, error: null };
    } catch (err) {
      console.error('[AchievementsAPI] Exception adding achievement:', err);
      return { data: null, error: err };
    }
  },
};

// Goals operations
export const goalsAPI = {
  // Get user goals
  getGoals: async (
    userId: string,
  ): Promise<{ data: UserGoal[]; error: any }> => {
    try {
      // Getting goals for user

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[GoalsAPI] Error getting goals:', error);
        return { data: [], error };
      }

      // Goals data retrieved
      return { data: data || [], error: null };
    } catch (err) {
      console.error('[GoalsAPI] Exception getting goals:', err);
      return { data: [], error: err };
    }
  },

  // Create goal
  createGoal: async (
    goal: Omit<UserGoal, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<{ data: UserGoal | null; error: any }> => {
    try {
      // Creating goal

      const { data, error } = await supabase
        .from('user_goals')
        .insert([goal])
        .select()
        .single();

      if (error) {
        console.error('[GoalsAPI] Error creating goal:', error);
        return { data: null, error };
      }

      // Goal created
      return { data, error: null };
    } catch (err) {
      console.error('[GoalsAPI] Exception creating goal:', err);
      return { data: null, error: err };
    }
  },

  // Update goal
  updateGoal: async (
    goalId: string,
    updates: Partial<UserGoal>,
  ): Promise<{ data: UserGoal | null; error: any }> => {
    try {
      // Updating goal

      const { data, error } = await supabase
        .from('user_goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('[GoalsAPI] Error updating goal:', error);
        return { data: null, error };
      }

      // Goal updated
      return { data, error: null };
    } catch (err) {
      console.error('[GoalsAPI] Exception updating goal:', err);
      return { data: null, error: err };
    }
  },

  // Delete goal
  deleteGoal: async (goalId: string): Promise<{ error: any }> => {
    try {
      // Deleting goal

      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('[GoalsAPI] Error deleting goal:', error);
        return { error };
      }

      // Goal deleted successfully
      return { error: null };
    } catch (err) {
      console.error('[GoalsAPI] Exception deleting goal:', err);
      return { error: err };
    }
  },
};
