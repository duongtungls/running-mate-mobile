// Activity types matching the web app's database structure

export type ActivityType =
  | 'Run'
  | 'Ride'
  | 'Walk'
  | 'Workout'
  | 'VirtualRun'
  | 'Hike'
  | 'Swim';

export interface Activity {
  id: string; // Strava activity ID (BIGINT)
  user_id: string;
  name: string;
  description?: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number; // in seconds
  total_elevation_gain: number; // in meters
  activity_type: string; // e.g., 'Run', 'Ride'
  sport_type?: string; // More specific type from Strava
  start_date: string; // ISO timestamp
  start_date_local: string; // Local time ISO timestamp
  timezone?: string;
  utc_offset?: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  start_latlng?: number[];
  end_latlng?: number[];
  map?: {
    polyline?: string;
    summary_polyline?: string;
  };
  achievement_count?: number;
  kudos_count?: number;
  comment_count?: number;
  athlete_count?: number;
  photo_count?: number;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  visibility?: string;
  flagged?: boolean;
  gear_id?: string;
  from_accepted_tag?: boolean;
  upload_id?: string;
  upload_id_str?: string;
  external_id?: string;
  average_speed?: number; // in m/s
  max_speed?: number; // in m/s
  average_cadence?: number;
  average_watts?: number;
  max_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  average_temp?: number;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  calories?: number;
  perceived_exertion?: number;
  prefer_perceived_exertion?: boolean;
  segment_efforts?: any[];
  splits_metric?: any[];
  splits_standard?: any[];
  laps?: any[];
  best_efforts?: any[];
  device_name?: string;
  embed_token?: string;
  segment_leaderboard_opt_out?: boolean;
  leaderboard_opt_out?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Simplified activity interface for UI display
export interface ActivitySummary {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  distance: number; // in meters
  duration: number; // in seconds (moving_time)
  pace?: number; // calculated: duration/distance in seconds per meter
  speed?: number; // in m/s (average_speed)
  date: string; // start_date_local
  location?: string; // formatted location from city/state
  image?: string; // activity photo or default image
  calories?: number;
  heartRate?: number; // average_heartrate
  elevation?: number; // total_elevation_gain
  aiAnalysis?: string; // AI-generated insights
}

// Weekly activity statistics
export interface WeeklyStats {
  totalDistance: number; // in meters
  totalActivities: number;
  totalTime: number; // in seconds
  averageDistance: number; // in meters
  averageTime: number; // in seconds
  totalElevation: number; // in meters
  totalCalories: number;
  weekStartDate: string;
  weekEndDate: string;
}

// Activity filters and sorting options
export interface ActivityFilters {
  activityTypes?: ActivityType[];
  dateRange?: {
    start: string;
    end: string;
  };
  minDistance?: number; // in meters
  maxDistance?: number; // in meters
  minDuration?: number; // in seconds
  maxDuration?: number; // in seconds
}

export interface ActivitySortOptions {
  field: 'start_date' | 'distance' | 'moving_time' | 'average_speed';
  direction: 'asc' | 'desc';
}

// Activity create/update interface
export interface ActivityCreateData {
  name: string;
  description?: string;
  activity_type: string;
  sport_type?: string;
  start_date_local: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  calories?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_speed?: number;
  max_speed?: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  manual?: boolean;
  private?: boolean;
}

// Activity analysis and insights
export interface ActivityInsights {
  activityId: string;
  analysis: string;
  performanceScore?: number;
  recommendations?: string[];
  comparedToPrevious?: {
    distanceChange: number; // percentage
    paceChange: number; // percentage
    heartRateChange: number; // percentage
  };
  achievements?: string[];
  createdAt: string;
}

// Utility types for formatting
export interface FormattedActivity extends ActivitySummary {
  formattedDistance: string; // "8.2 km" or "5.1 mi"
  formattedDuration: string; // "42:15"
  formattedPace: string; // "5:09/km" or "8:18/mi"
  formattedSpeed: string; // "11.6 km/h" or "7.2 mph"
  formattedElevation: string; // "124 m" or "407 ft"
  relativeDate: string; // "2 hours ago", "Yesterday"
  activityIcon: any; // Icon component
  activityColor: string; // Color for UI elements
}
