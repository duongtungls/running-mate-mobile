import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Activity,
  ActivitySummary,
  WeeklyStats,
  FormattedActivity,
  ActivityType,
} from '../types/activity';
import { activityAPI, weeklyStatsAPI } from '../lib/activity-api';
import { useAuth } from './AuthContext';

interface ActivityContextType {
  // Activity data
  activities: Activity[];
  recentActivities: Activity[];
  weeklyStats: WeeklyStats | null;
  formattedActivities: FormattedActivity[];

  // Loading states
  isLoading: boolean;
  isLoadingRecent: boolean;
  isLoadingWeekly: boolean;

  // Error states
  error: string | null;

  // Functions
  fetchActivities: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchWeeklyStats: () => Promise<void>;
  refreshData: () => Promise<void>;
  createActivity: (activity: any) => Promise<Activity | null>;
  updateActivity: (id: string, updates: any) => Promise<Activity | null>;
  deleteActivity: (id: string) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined,
);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

// Utility functions for formatting
const formatDistance = (meters: number): string => {
  if (meters === 0) return '0km';
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatPace = (meters: number, seconds: number): string => {
  if (meters === 0 || seconds === 0) return 'N/A';
  const km = meters / 1000;
  const paceSeconds = seconds / km;
  const minutes = Math.floor(paceSeconds / 60);
  const remainingSeconds = Math.floor(paceSeconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}/km`;
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;

  return date.toLocaleDateString();
};

const getActivityIcon = (type: string) => {
  const activityType = type.toLowerCase();
  switch (activityType) {
    case 'run':
    case 'virtualrun':
      return { color: '#ef4444', name: 'run' };
    case 'ride':
      return { color: '#3b82f6', name: 'ride' };
    case 'walk':
      return { color: '#10b981', name: 'walk' };
    case 'workout':
    case 'gym':
      return { color: '#f59e0b', name: 'workout' };
    default:
      return { color: '#6b7280', name: 'workout' };
  }
};

const formatLocation = (
  city?: string,
  state?: string,
  country?: string,
): string => {
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  if (country) return country;
  return 'Unknown Location';
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format activities for UI display
  const formattedActivities: FormattedActivity[] = recentActivities.map(
    (activity) => {
      const icon = getActivityIcon(activity.activity_type);

      return {
        id: activity.id,
        type: activity.activity_type.toLowerCase() as ActivityType,
        title: activity.name,
        description: activity.description || '',
        distance: activity.distance || 0,
        duration: activity.moving_time || 0,
        pace:
          activity.distance && activity.moving_time
            ? activity.moving_time / (activity.distance / 1000)
            : undefined,
        speed: activity.average_speed,
        date: activity.start_date_local,
        location: formatLocation(
          activity.location_city,
          activity.location_state,
          activity.location_country,
        ),
        image: undefined, // We'll use default images for now
        calories: activity.calories,
        heartRate: activity.average_heartrate,
        elevation: activity.total_elevation_gain,
        aiAnalysis: '', // Will be populated by AI analysis later

        // Formatted fields
        formattedDistance: formatDistance(activity.distance || 0),
        formattedDuration: formatDuration(activity.moving_time || 0),
        formattedPace: formatPace(
          activity.distance || 0,
          activity.moving_time || 0,
        ),
        formattedSpeed: activity.average_speed
          ? `${(activity.average_speed * 3.6).toFixed(1)} km/h`
          : 'N/A',
        formattedElevation: activity.total_elevation_gain
          ? `${activity.total_elevation_gain.toFixed(0)}m`
          : '0m',
        relativeDate: formatRelativeDate(activity.start_date_local),
        activityIcon: null, // Will be set by the UI component
        activityColor: icon.color,
      };
    },
  );

  // Fetch all activities
  const fetchActivities = useCallback(async () => {
    if (!user?.id) {
      // No user ID available
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetching activities for user
      const { data, error: apiError } = await activityAPI.getActivities(
        user.id,
        50,
      );

      if (apiError) {
        console.error('[ActivityContext] Error fetching activities:', apiError);
        setError('Failed to load activities');
        setActivities([]);
      } else {
        // Fetched activities
        setActivities(data);
      }
    } catch (err) {
      console.error('[ActivityContext] Exception fetching activities:', err);
      setError('Failed to load activities');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch recent activities (for home page)
  const fetchRecentActivities = useCallback(async () => {
    if (!user?.id) {
      // No user ID available for recent activities
      return;
    }

    setIsLoadingRecent(true);
    setError(null);

    try {
      // Fetching recent activities for user
      const { data, error: apiError } = await activityAPI.getRecentActivities(
        user.id,
        5,
      );

      if (apiError) {
        console.error(
          '[ActivityContext] Error fetching recent activities:',
          apiError,
        );
        setError('Failed to load recent activities');
        setRecentActivities([]);
      } else {
        // Fetched recent activities
        setRecentActivities(data);
      }
    } catch (err) {
      console.error(
        '[ActivityContext] Exception fetching recent activities:',
        err,
      );
      setError('Failed to load recent activities');
      setRecentActivities([]);
    } finally {
      setIsLoadingRecent(false);
    }
  }, [user?.id]);

  // Fetch weekly statistics
  const fetchWeeklyStats = useCallback(async () => {
    if (!user?.id) {
      // No user ID available for weekly stats
      return;
    }

    setIsLoadingWeekly(true);
    setError(null);

    try {
      // Fetching weekly stats for user
      const { data, error: apiError } =
        await weeklyStatsAPI.getCurrentWeekStats(user.id);

      if (apiError) {
        console.error(
          '[ActivityContext] Error fetching weekly stats:',
          apiError,
        );
        setError('Failed to load weekly statistics');
        setWeeklyStats(null);
      } else {
        // Fetched weekly stats
        setWeeklyStats(data);
      }
    } catch (err) {
      console.error('[ActivityContext] Exception fetching weekly stats:', err);
      setError('Failed to load weekly statistics');
      setWeeklyStats(null);
    } finally {
      setIsLoadingWeekly(false);
    }
  }, [user?.id]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    // Refreshing all activity data
    await Promise.all([fetchRecentActivities(), fetchWeeklyStats()]);
  }, [fetchRecentActivities, fetchWeeklyStats]);

  // Create new activity
  const createActivity = useCallback(
    async (activityData: any) => {
      if (!user?.id) throw new Error('No user logged in');

      const { data, error } = await activityAPI.createActivity({
        ...activityData,
        user_id: user.id,
      });

      if (error) throw new Error('Failed to create activity');

      // Refresh data after creating
      await refreshData();
      return data;
    },
    [user?.id, refreshData],
  );

  // Update activity
  const updateActivity = useCallback(
    async (activityId: string, updates: any) => {
      const { data, error } = await activityAPI.updateActivity(
        activityId,
        updates,
      );

      if (error) throw new Error('Failed to update activity');

      // Refresh data after updating
      await refreshData();
      return data;
    },
    [refreshData],
  );

  // Delete activity
  const deleteActivity = useCallback(
    async (activityId: string) => {
      const { error } = await activityAPI.deleteActivity(activityId);

      if (error) throw new Error('Failed to delete activity');

      // Refresh data after deleting
      await refreshData();
    },
    [refreshData],
  );

  // Initialize data when user is available
  useEffect(() => {
    if (user?.id) {
      // User available, initializing activity data
      refreshData();
    } else {
      // No user, clearing activity data
      setActivities([]);
      setRecentActivities([]);
      setWeeklyStats(null);
      setError(null);
    }
  }, [user?.id, refreshData]);

  const value: ActivityContextType = {
    // Data
    activities,
    recentActivities,
    weeklyStats,
    formattedActivities,

    // Loading states
    isLoading,
    isLoadingRecent,
    isLoadingWeekly,

    // Error state
    error,

    // Functions
    fetchActivities,
    fetchRecentActivities,
    fetchWeeklyStats,
    refreshData,
    createActivity,
    updateActivity,
    deleteActivity,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
