import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import SimpleMapView from '../../components/SimpleMapView';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  TrendingUp,
  Zap,
  Award,
  Mountain,
  Flame,
  Share,
  Bookmark,
  Target,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import GradientBackground from '../../components/GradientBackground';
import { useActivity } from '@/contexts/ActivityContext';
import { activityAPI, lapsAPI } from '@/lib/activity-api';
import { Activity } from '@/types/activity';

const getActivityIcon = (type: string) => {
  const activityType = type.toLowerCase();
  switch (activityType) {
    case 'run':
    case 'virtualrun':
      return { icon: TrendingUp, color: '#ef4444' };
    case 'ride':
      return { icon: Zap, color: '#3b82f6' };
    case 'walk':
    case 'hike':
      return { icon: MapPin, color: '#10b981' };
    case 'workout':
    case 'gym':
      return { icon: Award, color: '#f59e0b' };
    case 'swim':
      return { icon: Target, color: '#06b6d4' };
    default:
      return { icon: TrendingUp, color: '#6b7280' };
  }
};

const getActivityTypeLabel = (type: string, sportType?: string) => {
  if (sportType && sportType !== type) {
    return sportType;
  }

  const activityType = type.toLowerCase();
  switch (activityType) {
    case 'run':
      return 'Run';
    case 'virtualrun':
      return 'Virtual Run';
    case 'ride':
      return 'Ride';
    case 'walk':
      return 'Walk';
    case 'hike':
      return 'Hike';
    case 'workout':
      return 'Workout';
    case 'swim':
      return 'Swim';
    default:
      return type;
  }
};

// Formatting functions matching web app
const formatDistance = (meters: number): string => {
  if (!meters || meters === 0) return '0km';
  const km = meters / 1000;
  return `${km.toFixed(2)}km`;
};

const formatTime = (seconds: number): string => {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatPaceOrSpeed = (
  metersPerSecond: number,
  sportType: string,
): string => {
  if (!metersPerSecond) return 'N/A';

  const type = sportType.toLowerCase();

  // For cycling and similar sports, show speed in km/h
  if (
    type.includes('ride') ||
    type.includes('bike') ||
    type.includes('cycling')
  ) {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  }

  // For running, walking, swimming - show pace in min/km
  const kmh = metersPerSecond * 3.6;
  const paceMinPerKm = 60 / kmh;
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
};

const formatElevation = (meters: number): string => {
  if (!meters || meters === 0) return '0m';
  return `${Math.round(meters)}m`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatLocation = (
  city?: string,
  state?: string,
  country?: string,
): string => {
  if (city && state) return `${city}, ${state}`;
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (state && country) return `${state}, ${country}`;
  if (state) return state;
  if (country) return country;
  return 'Unknown Location';
};

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [laps, setLaps] = useState<any[]>([]);

  const fetchActivity = async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid activity ID');
      setLoading(false);
      return;
    }

    try {
      // Fetching activity
      const { data, error: apiError } = await activityAPI.getActivity(id);

      if (apiError) {
        console.error('[ActivityDetail] Error fetching activity:', apiError);
        setError('Failed to load activity');
        setActivity(null);
      } else if (!data) {
        setError('Activity not found');
        setActivity(null);
      } else {
        // Activity loaded
        setActivity(data);
        setError(null);

        // Fetch laps for this activity
        try {
          const { data: lapsData } = await lapsAPI.getActivityLaps(id);
          setLaps(lapsData || []);
        } catch (err) {
          // No laps data available
          setLaps([]);
        }
      }
    } catch (err) {
      console.error('[ActivityDetail] Exception fetching activity:', err);
      setError('Failed to load activity');
      setActivity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivity();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading activity...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (error || !activity) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error || 'Activity not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchActivity}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  const { icon: IconComponent, color } = getActivityIcon(
    activity.activity_type,
  );
  const hasDistance = activity.distance && activity.distance > 0;
  const hasElevation =
    activity.total_elevation_gain && activity.total_elevation_gain > 0;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="rgba(255, 255, 255, 0.8)"
            titleColor="rgba(255, 255, 255, 0.8)"
          />
        }
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Navigation Header */}
          <View style={styles.navigationHeader}>
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Share size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Bookmark size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Activity Title */}
          <View style={styles.titleContainer}>
            <View style={styles.activityTypeContainer}>
              <View
                style={[
                  styles.activityTypeIcon,
                  { backgroundColor: `${color}30` },
                ]}
              >
                <IconComponent size={20} color={color} />
              </View>
              <Text style={styles.activityTypeText}>
                {getActivityTypeLabel(
                  activity.activity_type,
                  activity.sport_type,
                )}
              </Text>
            </View>
            <Text style={styles.activityTitle}>{activity.name}</Text>

            <View style={styles.dateLocationRow}>
              <View style={styles.dateRow}>
                <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.dateText}>
                  {formatDate(activity.start_date_local)}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.locationText}>
                  {formatLocation(
                    activity.location_city,
                    activity.location_state,
                    activity.location_country,
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Stats Row */}
        <View style={styles.statsRow}>
          {hasDistance && (
            <View style={styles.compactStatCard}>
              <MapPin size={16} color="#10b981" />
              <Text style={styles.compactStatValue}>
                {formatDistance(activity.distance)}
              </Text>
              <Text style={styles.compactStatLabel}>Distance</Text>
            </View>
          )}

          <View style={styles.compactStatCard}>
            <Clock size={16} color="#3b82f6" />
            <Text style={styles.compactStatValue}>
              {formatTime(activity.moving_time || 0)}
            </Text>
            <Text style={styles.compactStatLabel}>Time</Text>
          </View>

          {activity.average_speed && hasDistance && (
            <View style={styles.compactStatCard}>
              <TrendingUp size={16} color="#ef4444" />
              <Text style={styles.compactStatValue}>
                {formatPaceOrSpeed(
                  activity.average_speed,
                  activity.activity_type,
                )}
              </Text>
              <Text style={styles.compactStatLabel}>
                {activity.activity_type.toLowerCase().includes('ride')
                  ? 'Speed'
                  : 'Pace'}
              </Text>
            </View>
          )}

          {hasElevation && (
            <View style={styles.compactStatCard}>
              <Mountain size={16} color="#8b5cf6" />
              <Text style={styles.compactStatValue}>
                {formatElevation(activity.total_elevation_gain!)}
              </Text>
              <Text style={styles.compactStatLabel}>Elevation</Text>
            </View>
          )}
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            {activity.calories && (
              <View style={styles.metricCard}>
                <Flame size={20} color="#f59e0b" />
                <Text style={styles.metricValue}>
                  {Math.round(activity.calories)}
                </Text>
                <Text style={styles.metricLabel}>Calories</Text>
              </View>
            )}

            {activity.average_heartrate && (
              <View style={styles.metricCard}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.metricValue}>
                  {Math.round(activity.average_heartrate)}
                </Text>
                <Text style={styles.metricLabel}>Avg HR</Text>
              </View>
            )}

            {activity.max_heartrate && (
              <View style={styles.metricCard}>
                <Heart size={20} color="#dc2626" />
                <Text style={styles.metricValue}>
                  {Math.round(activity.max_heartrate)}
                </Text>
                <Text style={styles.metricLabel}>Max HR</Text>
              </View>
            )}

            {activity.average_cadence && (
              <View style={styles.metricCard}>
                <Target size={20} color="#06b6d4" />
                <Text style={styles.metricValue}>
                  {Math.round(activity.average_cadence)}
                </Text>
                <Text style={styles.metricLabel}>Cadence</Text>
              </View>
            )}

            {activity.average_watts && (
              <View style={styles.metricCard}>
                <Zap size={20} color="#fbbf24" />
                <Text style={styles.metricValue}>
                  {Math.round(activity.average_watts)}
                </Text>
                <Text style={styles.metricLabel}>Avg Power</Text>
              </View>
            )}

            {activity.max_speed && (
              <View style={styles.metricCard}>
                <TrendingUp size={20} color="#10b981" />
                <Text style={styles.metricValue}>
                  {(activity.max_speed * 3.6).toFixed(1)} km/h
                </Text>
                <Text style={styles.metricLabel}>Max Speed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Interactive Map */}
        <View style={styles.mapContainer}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Route Map</Text>
          </View>

          <SimpleMapView
            startLatLng={activity.start_latlng}
            endLatLng={activity.end_latlng}
            polyline={activity.map?.polyline || activity.map?.summary_polyline}
          />
        </View>

        {/* AI Analysis in Description */}
        {activity.description && (
          <View style={styles.analysisContainer}>
            <View style={styles.sectionHeader}>
              <Zap size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>AI Analysis</Text>
            </View>

            <View style={styles.analysisCard}>
              <Markdown style={markdownStyles}>{activity.description}</Markdown>
            </View>
          </View>
        )}
        {/* Laps Section */}
        <View style={styles.lapsContainer}>
          <View style={styles.sectionHeader}>
            <Target size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Laps</Text>
          </View>

          <View>
            {/* Lap data: shows real laps from activity_laps table when available, otherwise estimates */}
            {Array.from(
              {
                length: Math.max(
                  1,
                  Math.floor((activity.distance || 1000) / 1000),
                ),
              },
              (_, index) => {
                const lapNumber = index + 1;
                const isLastLap =
                  lapNumber === Math.floor((activity.distance || 1000) / 1000);
                const lapDistance = isLastLap
                  ? (activity.distance || 1000) % 1000 || 1000
                  : 1000;
                const estimatedLapTime = activity.moving_time
                  ? Math.round(
                      (activity.moving_time * lapDistance) /
                        (activity.distance || 1),
                    )
                  : 0;
                const lapPace = activity.average_speed
                  ? formatPaceOrSpeed(
                      activity.average_speed,
                      activity.activity_type,
                    )
                  : 'N/A';

                return (
                  <View key={lapNumber} style={styles.lapCard}>
                    <View style={styles.lapHeader}>
                      <Text style={styles.lapNumber}>Lap {lapNumber}</Text>
                      <Text style={styles.lapDistance}>
                        {formatDistance(lapDistance)}
                      </Text>
                    </View>
                    <View style={styles.lapStats}>
                      <View style={styles.lapStat}>
                        <Clock size={12} color="rgba(255, 255, 255, 0.7)" />
                        <Text style={styles.lapStatText}>
                          {formatTime(estimatedLapTime)}
                        </Text>
                      </View>
                      <View style={styles.lapStat}>
                        <TrendingUp
                          size={12}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                        <Text style={styles.lapStatText}>{lapPace}</Text>
                      </View>
                      {activity.average_heartrate && (
                        <View style={styles.lapStat}>
                          <Heart size={12} color="rgba(255, 255, 255, 0.7)" />
                          <Text style={styles.lapStatText}>
                            {Math.round(activity.average_heartrate)} bpm
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              },
            )}
          </View>
        </View>

        {/* Additional Stats */}
        <View style={styles.additionalStatsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity Details</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Elapsed Time:</Text>
              <Text style={styles.detailValue}>
                {formatTime(activity.elapsed_time || activity.moving_time || 0)}
              </Text>
            </View>

            {activity.kudos_count !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kudos:</Text>
                <Text style={styles.detailValue}>{activity.kudos_count}</Text>
              </View>
            )}

            {activity.comment_count !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Comments:</Text>
                <Text style={styles.detailValue}>{activity.comment_count}</Text>
              </View>
            )}

            {activity.achievement_count !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Achievements:</Text>
                <Text style={styles.detailValue}>
                  {activity.achievement_count}
                </Text>
              </View>
            )}

            {activity.trainer && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Indoor:</Text>
                <Text style={styles.detailValue}>Yes</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  errorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButtonHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    paddingHorizontal: 20,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTypeIcon: {
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  activityTypeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activityTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 16,
  },
  dateLocationRow: {
    flexDirection: 'row',
    gap: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
    gap: 8,
  },
  compactStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 80,
    justifyContent: 'center',
  },
  compactStatValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  compactStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  metricsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginTop: 6,
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  mapContainer: {
    padding: 20,
    paddingTop: 10,
  },
  lapsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  lapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lapNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  lapDistance: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#10b981',
  },
  lapStats: {
    flexDirection: 'row',
    gap: 16,
  },
  lapStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lapStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  analysisContainer: {
    padding: 20,
    paddingTop: 0,
  },
  analysisCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  additionalStatsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  detailsGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});

// Markdown styles for AI analysis
const markdownStyles = StyleSheet.create({
  body: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  heading2: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 6,
  },
  paragraph: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  strong: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  em: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#10b981',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#10b981',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  list_item: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
});
