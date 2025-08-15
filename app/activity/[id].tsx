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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SimpleMapView from '../../components/SimpleMapView';
import ActivityCharts from '../../components/ActivityCharts';
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
  BarChart3,
  Activity as ActivityIcon,
  Thermometer,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import GradientBackground from '../../components/GradientBackground';
import { useActivity } from '@/contexts/ActivityContext';
import { activityAPI, lapsAPI } from '@/lib/activity-api';
import { Activity } from '@/types/activity';

const Tab = createMaterialTopTabNavigator();

type TabType = 'overview' | 'stats' | 'laps' | 'charts';

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

// Tab Screen Components
function OverviewScreen({
  activity,
  hasElevation,
  refreshing,
  onRefresh,
}: any) {
  return (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="rgba(255, 255, 255, 0.8)"
        />
      }
    >
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <SimpleMapView
          startLatLng={activity.start_latlng}
          endLatLng={activity.end_latlng}
          polyline={activity.map?.polyline || activity.map?.summary_polyline}
        />
      </View>

      {/* Key Stats Grid */}
      <View style={styles.overviewStats}>
        {activity.average_heartrate && (
          <View style={styles.overviewStatCard}>
            <Heart size={24} color="#ef4444" />
            <Text style={styles.overviewStatValue}>
              {Math.round(activity.average_heartrate)}
            </Text>
            <Text style={styles.overviewStatLabel}>Avg HR</Text>
          </View>
        )}

        <View style={styles.overviewStatCard}>
          <TrendingUp size={24} color="#10b981" />
          <Text style={styles.overviewStatValue}>
            {activity.average_speed
              ? formatPaceOrSpeed(
                  activity.average_speed,
                  activity.activity_type,
                )
              : 'N/A'}
          </Text>
          <Text style={styles.overviewStatLabel}>
            {activity.activity_type.toLowerCase().includes('ride')
              ? 'Avg Speed'
              : 'Avg Pace'}
          </Text>
        </View>

        <View style={styles.overviewStatCard}>
          <Clock size={24} color="#3b82f6" />
          <Text style={styles.overviewStatValue}>
            {formatTime(activity.moving_time || 0)}
          </Text>
          <Text style={styles.overviewStatLabel}>Time</Text>
        </View>

        {activity.calories && (
          <View style={styles.overviewStatCard}>
            <Flame size={24} color="#f59e0b" />
            <Text style={styles.overviewStatValue}>
              {Math.round(activity.calories)}
            </Text>
            <Text style={styles.overviewStatLabel}>Calories</Text>
          </View>
        )}
      </View>

      {/* AI Analysis */}
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
    </ScrollView>
  );
}

function StatsScreen({ activity, hasDistance, hasElevation }: any) {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        {/* Distance & Speed Stats */}
        {hasDistance && (
          <View style={styles.statCategory}>
            <Text style={styles.categoryTitle}>Distance & Speed</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Distance</Text>
              <Text style={styles.statValue}>
                {formatDistance(activity.distance)}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Speed</Text>
              <Text style={styles.statValue}>
                {activity.average_speed
                  ? (activity.average_speed * 3.6).toFixed(1) + ' km/h'
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Max Speed</Text>
              <Text style={styles.statValue}>
                {activity.max_speed
                  ? (activity.max_speed * 3.6).toFixed(1) + ' km/h'
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Pace</Text>
              <Text style={styles.statValue}>
                {activity.average_speed
                  ? formatPaceOrSpeed(
                      activity.average_speed,
                      activity.activity_type,
                    )
                  : 'N/A'}
              </Text>
            </View>
          </View>
        )}

        {/* Timing Stats */}
        <View style={styles.statCategory}>
          <Text style={styles.categoryTitle}>Timing</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Moving Time</Text>
            <Text style={styles.statValue}>
              {formatTime(activity.moving_time || 0)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Elapsed Time</Text>
            <Text style={styles.statValue}>
              {formatTime(activity.elapsed_time || activity.moving_time || 0)}
            </Text>
          </View>
        </View>

        {/* Heart Rate Stats */}
        {activity.average_heartrate && (
          <View style={styles.statCategory}>
            <Text style={styles.categoryTitle}>Heart Rate</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average HR</Text>
              <Text style={styles.statValue}>
                {Math.round(activity.average_heartrate)} bpm
              </Text>
            </View>
            {activity.max_heartrate && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max HR</Text>
                <Text style={styles.statValue}>
                  {Math.round(activity.max_heartrate)} bpm
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Power Stats */}
        {activity.average_watts && (
          <View style={styles.statCategory}>
            <Text style={styles.categoryTitle}>Power</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Power</Text>
              <Text style={styles.statValue}>
                {Math.round(activity.average_watts)} W
              </Text>
            </View>
            {activity.max_watts && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max Power</Text>
                <Text style={styles.statValue}>
                  {Math.round(activity.max_watts)} W
                </Text>
              </View>
            )}
            {activity.kilojoules && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Energy</Text>
                <Text style={styles.statValue}>
                  {Math.round(activity.kilojoules)} kJ
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Elevation Stats */}
        {hasElevation && (
          <View style={styles.statCategory}>
            <Text style={styles.categoryTitle}>Elevation</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Elevation Gain</Text>
              <Text style={styles.statValue}>
                {formatElevation(activity.total_elevation_gain!)}
              </Text>
            </View>
          </View>
        )}

        {/* Other Stats */}
        <View style={styles.statCategory}>
          <Text style={styles.categoryTitle}>Other</Text>
          {activity.calories && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>
                {Math.round(activity.calories)}
              </Text>
            </View>
          )}
          {activity.average_cadence && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Cadence</Text>
              <Text style={styles.statValue}>
                {Math.round(activity.average_cadence)} spm
              </Text>
            </View>
          )}
          {activity.average_temp && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Temperature</Text>
              <Text style={styles.statValue}>
                {Math.round(activity.average_temp)}°C
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function LapsScreen({ activity }: any) {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.lapsContainer}>
        {Array.from(
          {
            length: Math.max(1, Math.floor((activity.distance || 1000) / 1000)),
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
                    <TrendingUp size={12} color="rgba(255, 255, 255, 0.7)" />
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
    </ScrollView>
  );
}

function ChartsScreen({ activity, hasElevation }: any) {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <ActivityCharts activity={activity} hasElevation={hasElevation} />
    </ScrollView>
  );
}

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
            style={styles.backButtonHeader}
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
            style={styles.backButtonHeader}
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
      <View style={styles.container}>
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

        {/* Material Top Tabs */}
        <NavigationContainer independent={true}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                marginHorizontal: 20,
                borderRadius: 12,
                marginBottom: 10,
                height: 50,
              },
              tabBarIndicatorStyle: {
                backgroundColor: '#10b981',
                height: 3,
                borderRadius: 2,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Inter-SemiBold',
                textTransform: 'none',
                marginTop: -5,
              },
              tabBarActiveTintColor: '#10b981',
              tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
              tabBarItemStyle: {
                paddingVertical: 8,
              },
              swipeEnabled: true,
            }}
          >
            <Tab.Screen
              name="Overview"
              children={() => (
                <OverviewScreen
                  activity={activity}
                  hasElevation={hasElevation}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              )}
              options={{
                tabBarIcon: ({ color }) => <MapPin size={18} color={color} />,
              }}
            />
            <Tab.Screen
              name="Stats"
              children={() => (
                <StatsScreen
                  activity={activity}
                  hasDistance={hasDistance}
                  hasElevation={hasElevation}
                />
              )}
              options={{
                tabBarIcon: ({ color }) => (
                  <ActivityIcon size={18} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Laps"
              children={() => <LapsScreen activity={activity} />}
              options={{
                tabBarIcon: ({ color }) => <Target size={18} color={color} />,
              }}
            />
            <Tab.Screen
              name="Charts"
              children={() => (
                <ChartsScreen activity={activity} hasElevation={hasElevation} />
              )}
              options={{
                tabBarIcon: ({ color }) => (
                  <BarChart3 size={18} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 10,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
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

  // Tab styles
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },

  // Overview tab styles
  mapContainer: {
    marginBottom: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  overviewStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overviewStatValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Stats tab styles
  statsGrid: {
    gap: 16,
  },
  statCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },

  // Laps tab styles
  lapsContainer: {
    gap: 8,
  },
  lapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
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

  // Analysis styles
  analysisContainer: {
    marginTop: 20,
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

  // Loading states
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
