import { supabase } from './supabase';
import {
  Activity,
  ActivitySummary,
  WeeklyStats,
  ActivityFilters,
  ActivitySortOptions,
  ActivityCreateData,
  ActivityInsights,
} from '../types/activity';

// Activity CRUD operations
export const activityAPI = {
  // Get user activities with pagination and filters
  getActivities: async (
    userId: string,
    limit: number = 20,
    offset: number = 0,
    filters?: ActivityFilters,
    sort: ActivitySortOptions = { field: 'start_date', direction: 'desc' },
  ): Promise<{ data: Activity[]; error: any; count?: number }> => {
    try {
      // Getting activities for user

      let query = supabase
        .from('activities')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters) {
        if (filters.activityTypes && filters.activityTypes.length > 0) {
          query = query.in('activity_type', filters.activityTypes);
        }

        if (filters.dateRange) {
          query = query
            .gte('start_date_local', filters.dateRange.start)
            .lte('start_date_local', filters.dateRange.end);
        }

        if (filters.minDistance !== undefined) {
          query = query.gte('distance', filters.minDistance);
        }

        if (filters.maxDistance !== undefined) {
          query = query.lte('distance', filters.maxDistance);
        }

        if (filters.minDuration !== undefined) {
          query = query.gte('moving_time', filters.minDuration);
        }

        if (filters.maxDuration !== undefined) {
          query = query.lte('moving_time', filters.maxDuration);
        }
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('[ActivityAPI] Error getting activities:', error);
        return { data: [], error, count: 0 };
      }

      // Retrieved activities
      return { data: data || [], error: null, count: count || 0 };
    } catch (err) {
      console.error('[ActivityAPI] Exception getting activities:', err);
      return { data: [], error: err, count: 0 };
    }
  },

  // Get single activity by ID
  getActivity: async (
    activityId: string,
  ): Promise<{ data: Activity | null; error: any }> => {
    try {
      // Getting activity

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (error) {
        console.error('[ActivityAPI] Error getting activity:', error);
        return { data: null, error };
      }

      // Retrieved activity
      return { data, error: null };
    } catch (err) {
      console.error('[ActivityAPI] Exception getting activity:', err);
      return { data: null, error: err };
    }
  },

  // Get recent activities (last 10)
  getRecentActivities: async (
    userId: string,
    limit: number = 10,
  ): Promise<{ data: Activity[]; error: any }> => {
    try {
      // Getting recent activities for user

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('start_date_local', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[ActivityAPI] Error getting recent activities:', error);
        return { data: [], error };
      }

      // Retrieved recent activities
      return { data: data || [], error: null };
    } catch (err) {
      console.error('[ActivityAPI] Exception getting recent activities:', err);
      return { data: [], error: err };
    }
  },

  // Create new activity
  createActivity: async (
    activityData: ActivityCreateData & { user_id: string },
  ): Promise<{ data: Activity | null; error: any }> => {
    try {
      // Creating activity

      const { data, error } = await supabase
        .from('activities')
        .insert([
          {
            ...activityData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('[ActivityAPI] Error creating activity:', error);
        return { data: null, error };
      }

      // Activity created
      return { data, error: null };
    } catch (err) {
      console.error('[ActivityAPI] Exception creating activity:', err);
      return { data: null, error: err };
    }
  },

  // Update activity
  updateActivity: async (
    activityId: string,
    updates: Partial<Activity>,
  ): Promise<{ data: Activity | null; error: any }> => {
    try {
      // Updating activity

      const { data, error } = await supabase
        .from('activities')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activityId)
        .select()
        .single();

      if (error) {
        console.error('[ActivityAPI] Error updating activity:', error);
        return { data: null, error };
      }

      // Activity updated
      return { data, error: null };
    } catch (err) {
      console.error('[ActivityAPI] Exception updating activity:', err);
      return { data: null, error: err };
    }
  },

  // Delete activity
  deleteActivity: async (activityId: string): Promise<{ error: any }> => {
    try {
      // Deleting activity

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) {
        console.error('[ActivityAPI] Error deleting activity:', error);
        return { error };
      }

      // Activity deleted successfully
      return { error: null };
    } catch (err) {
      console.error('[ActivityAPI] Exception deleting activity:', err);
      return { error: err };
    }
  },
};

// Weekly statistics API
export const weeklyStatsAPI = {
  // Get current week statistics
  getCurrentWeekStats: async (
    userId: string,
  ): Promise<{ data: WeeklyStats | null; error: any }> => {
    try {
      // Getting current week stats for user

      // Get start and end of current week (Monday to Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1

      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - daysFromMonday);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('activities')
        .select('distance, moving_time, total_elevation_gain, calories')
        .eq('user_id', userId)
        .gte('start_date_local', weekStart.toISOString())
        .lte('start_date_local', weekEnd.toISOString());

      if (error) {
        console.error('[WeeklyStatsAPI] Error getting week stats:', error);
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        const emptyStats: WeeklyStats = {
          totalDistance: 0,
          totalActivities: 0,
          totalTime: 0,
          averageDistance: 0,
          averageTime: 0,
          totalElevation: 0,
          totalCalories: 0,
          weekStartDate: weekStart.toISOString(),
          weekEndDate: weekEnd.toISOString(),
        };
        return { data: emptyStats, error: null };
      }

      // Calculate aggregated stats
      const totalDistance = data.reduce(
        (sum, activity) => sum + (activity.distance || 0),
        0,
      );
      const totalTime = data.reduce(
        (sum, activity) => sum + (activity.moving_time || 0),
        0,
      );
      const totalElevation = data.reduce(
        (sum, activity) => sum + (activity.total_elevation_gain || 0),
        0,
      );
      const totalCalories = data.reduce(
        (sum, activity) => sum + (activity.calories || 0),
        0,
      );
      const totalActivities = data.length;

      const weekStats: WeeklyStats = {
        totalDistance,
        totalActivities,
        totalTime,
        averageDistance:
          totalActivities > 0 ? totalDistance / totalActivities : 0,
        averageTime: totalActivities > 0 ? totalTime / totalActivities : 0,
        totalElevation,
        totalCalories,
        weekStartDate: weekStart.toISOString(),
        weekEndDate: weekEnd.toISOString(),
      };

      // Week stats calculated
      return { data: weekStats, error: null };
    } catch (err) {
      console.error('[WeeklyStatsAPI] Exception getting week stats:', err);
      return { data: null, error: err };
    }
  },

  // Get stats for specific week
  getWeekStats: async (
    userId: string,
    weekStartDate: string,
  ): Promise<{ data: WeeklyStats | null; error: any }> => {
    try {
      // Getting week stats for user

      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('activities')
        .select('distance, moving_time, total_elevation_gain, calories')
        .eq('user_id', userId)
        .gte('start_date_local', weekStart.toISOString())
        .lte('start_date_local', weekEnd.toISOString());

      if (error) {
        console.error('[WeeklyStatsAPI] Error getting week stats:', error);
        return { data: null, error };
      }

      // Calculate aggregated stats (same logic as getCurrentWeekStats)
      const totalDistance =
        data?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0;
      const totalTime =
        data?.reduce((sum, activity) => sum + (activity.moving_time || 0), 0) ||
        0;
      const totalElevation =
        data?.reduce(
          (sum, activity) => sum + (activity.total_elevation_gain || 0),
          0,
        ) || 0;
      const totalCalories =
        data?.reduce((sum, activity) => sum + (activity.calories || 0), 0) || 0;
      const totalActivities = data?.length || 0;

      const weekStats: WeeklyStats = {
        totalDistance,
        totalActivities,
        totalTime,
        averageDistance:
          totalActivities > 0 ? totalDistance / totalActivities : 0,
        averageTime: totalActivities > 0 ? totalTime / totalActivities : 0,
        totalElevation,
        totalCalories,
        weekStartDate: weekStart.toISOString(),
        weekEndDate: weekEnd.toISOString(),
      };

      // Week stats calculated
      return { data: weekStats, error: null };
    } catch (err) {
      console.error('[WeeklyStatsAPI] Exception getting week stats:', err);
      return { data: null, error: err };
    }
  },
};

// Activity insights API (for AI analysis)
export const insightsAPI = {
  // Get insights for an activity
  getActivityInsights: async (
    activityId: string,
  ): Promise<{ data: ActivityInsights | null; error: any }> => {
    try {
      // Getting insights for activity

      const { data, error } = await supabase
        .from('activity_insights')
        .select('*')
        .eq('activityId', activityId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[InsightsAPI] Error getting insights:', error);
        return { data: null, error };
      }

      // Retrieved insights
      return { data: data || null, error: null };
    } catch (err) {
      console.error('[InsightsAPI] Exception getting insights:', err);
      return { data: null, error: err };
    }
  },

  // Create or update activity insights
  createActivityInsights: async (
    insights: Omit<ActivityInsights, 'createdAt'>,
  ): Promise<{ data: ActivityInsights | null; error: any }> => {
    try {
      // Creating insights for activity

      const { data, error } = await supabase
        .from('activity_insights')
        .upsert({
          ...insights,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[InsightsAPI] Error creating insights:', error);
        return { data: null, error };
      }

      // Insights created
      return { data, error: null };
    } catch (err) {
      console.error('[InsightsAPI] Exception creating insights:', err);
      return { data: null, error: err };
    }
  },
};

// Activity laps API
export const lapsAPI = {
  // Get activity laps
  getActivityLaps: async (
    activityId: string,
  ): Promise<{ data: any[]; error: any }> => {
    try {
      // Getting laps for activity

      const { data, error } = await supabase
        .from('activity_laps')
        .select('*')
        .eq('activity_id', activityId)
        .order('lap_index', { ascending: true });

      if (error) {
        console.error('[LapsAPI] Error getting activity laps:', error);
        return { data: [], error };
      }

      // Retrieved laps
      return { data: data || [], error: null };
    } catch (err) {
      console.error('[LapsAPI] Exception getting activity laps:', err);
      return { data: [], error: err };
    }
  },
};
