export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  activity_level?:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'super_active';
  running_experience?:
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'professional';
  goals?: string[];
  preferred_units?: 'metric' | 'imperial';
  preferred_language?: string;
  timezone?: string;
  privacy_settings?: {
    profile_visibility?: 'public' | 'friends' | 'private';
    activity_visibility?: 'public' | 'friends' | 'private';
    stats_visibility?: 'public' | 'friends' | 'private';
  };
  notifications_settings?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    training_reminders?: boolean;
    achievement_updates?: boolean;
    social_updates?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface RunningStats {
  id: string; // user_id field in user_stats table is actually named 'id'
  total_runs: number;
  total_distance: number; // in meters (same as web app)
  total_time: number; // in seconds (same as web app)
  moving_time?: number; // in seconds (for Strava compatibility)
  elapsed_time?: number; // in seconds (for Strava compatibility)
  total_elevation_gain: number; // in meters (matches web app field name)
  average_pace?: number; // in seconds per km
  fastest_5k_time?: number; // in seconds (matches web app field name)
  fastest_10k_time?: number; // in seconds (matches web app field name)
  fastest_half_marathon_time?: number; // in seconds (matches web app field name)
  fastest_marathon_time?: number; // in seconds (matches web app field name)
  longest_run_distance?: number; // in meters (matches web app field name)
  current_streak: number; // in days
  longest_streak: number; // in days
  avg_weekly_distance?: number; // in meters (matches web app)
  avg_weekly_runs?: number; // matches web app
  ytd_runs?: number; // year-to-date runs (for web app compatibility)
  ytd_distance?: number; // year-to-date distance (for web app compatibility)
  ytd_moving_time?: number; // year-to-date moving time (for web app compatibility)
  ytd_elevation_gain?: number; // year-to-date elevation gain (for web app compatibility)
  achievement_count?: number; // matches web app
  calories_burned?: number;
  last_activity_date?: string; // matches web app
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earned_at: string;
  category: 'distance' | 'speed' | 'frequency' | 'special';
  value?: number;
}

export interface UserGoal {
  id: string;
  user_id: string;
  type: 'distance' | 'time' | 'frequency' | 'pace' | 'weight_loss' | 'event';
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'super_active';
  running_experience?:
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'professional';
  goals?: string[];
  preferred_units?: 'metric' | 'imperial';
  preferred_language?: string;
  timezone?: string;
  privacy_settings?: {
    profile_visibility?: 'public' | 'friends' | 'private';
    activity_visibility?: 'public' | 'friends' | 'private';
    stats_visibility?: 'public' | 'friends' | 'private';
  };
  notifications_settings?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    training_reminders?: boolean;
    achievement_updates?: boolean;
    social_updates?: boolean;
  };
}
