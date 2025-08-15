import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect, useState } from 'react';
import { SplashScreen, useRouter } from 'expo-router';
import {
  Clock,
  MapPin,
  Heart,
  TrendingUp,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useI18n } from '@/hooks/useI18n';
import { useActivity } from '@/contexts/ActivityContext';

SplashScreen.preventAutoHideAsync();

type ActivityType =
  | 'run'
  | 'ride'
  | 'walk'
  | 'workout'
  | 'Run'
  | 'Ride'
  | 'Walk'
  | 'Workout'
  | 'VirtualRun'
  | 'Hike'
  | 'Swim';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'run':
      return { icon: TrendingUp, color: '#ef4444' };
    case 'ride':
      return { icon: Zap, color: '#3b82f6' };
    case 'walk':
      return { icon: MapPin, color: '#10b981' };
    case 'workout':
      return { icon: Award, color: '#f59e0b' };
    default:
      return { icon: TrendingUp, color: '#6b7280' };
  }
};

const getActivityTypeLabel = (type: string) => {
  const activityType = type.toLowerCase();
  switch (activityType) {
    case 'run':
    case 'virtualrun':
      return 'Run';
    case 'ride':
      return 'Ride';
    case 'walk':
      return 'Walk';
    case 'hike':
      return 'Hike';
    case 'workout':
    case 'gym':
      return 'Workout';
    case 'swim':
      return 'Swim';
    default:
      return type;
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    recentActivities,
    weeklyStats,
    isLoadingRecent,
    isLoadingWeekly,
    error,
    refreshData,
  } = useActivity();

  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const formatWeeklyDistance = (meters: number): string => {
    if (!meters) return '0km';
    const km = meters / 1000;
    return `${km.toFixed(1)}km`;
  };

  const formatAverageDistance = (
    totalMeters: number,
    count: number,
  ): string => {
    if (!totalMeters || !count) return '0km';
    const avgMeters = totalMeters / count;
    const km = avgMeters / 1000;
    return `${km.toFixed(1)}km`;
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.welcome')}</Text>
          <Text style={styles.subtitle}>{t('home.recentActivities')}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            {isLoadingWeekly ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.statValue}>
                  {formatWeeklyDistance(weeklyStats?.totalDistance || 0)}
                </Text>
                <Text style={styles.statLabel}>This Week</Text>
              </>
            )}
          </View>
          <View style={styles.statCard}>
            {isLoadingWeekly ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.statValue}>
                  {weeklyStats?.totalActivities || 0}
                </Text>
                <Text style={styles.statLabel}>Activities</Text>
              </>
            )}
          </View>
          <View style={styles.statCard}>
            {isLoadingWeekly ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.statValue}>
                  {formatAverageDistance(
                    weeklyStats?.totalDistance || 0,
                    weeklyStats?.totalActivities || 0,
                  )}
                </Text>
                <Text style={styles.statLabel}>Avg/Activity</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>

          {isLoadingRecent ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading activities...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load activities</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : recentActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No activities yet</Text>
              <Text style={styles.emptySubtext}>
                Connect your Strava account or start tracking to see activities
                here!
              </Text>
            </View>
          ) : (
            recentActivities.map((activity) => {
              const { icon: IconComponent, color } = getActivityIcon(
                activity.activity_type.toLowerCase() as ActivityType,
              );

              const formatDistance = (meters: number): string => {
                if (!meters) return '0km';
                const km = meters / 1000;
                return `${km.toFixed(1)}km`;
              };

              const formatDuration = (seconds: number): string => {
                if (!seconds) return '0:00';
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const remainingSeconds = seconds % 60;

                if (hours > 0) {
                  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                }
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
              };

              const formatPace = (meters: number, seconds: number): string => {
                if (!meters || !seconds) return 'N/A';
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
                if (diffInHours < 168)
                  return `${Math.floor(diffInHours / 24)} days ago`;

                return date.toLocaleDateString();
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

              return (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityCard}
                  onPress={() => router.push(`/activity/${activity.id}`)}
                >
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <View style={styles.activityTitleRow}>
                        <View
                          style={[
                            styles.activityIcon,
                            { backgroundColor: `${color}20` },
                          ]}
                        >
                          <IconComponent size={18} color={color} />
                        </View>
                        <View style={styles.activityTitleContainer}>
                          <Text style={styles.activityTitle}>
                            {activity.name}
                          </Text>
                          <Text style={styles.activityType}>
                            {getActivityTypeLabel(activity.activity_type)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.activityDate}>
                        {formatRelativeDate(activity.start_date_local)}
                      </Text>
                    </View>

                    <View style={styles.activityStats}>
                      {activity.distance && activity.distance > 0 && (
                        <View style={styles.statItem}>
                          <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.statText}>
                            {formatDistance(activity.distance)}
                          </Text>
                        </View>
                      )}
                      {activity.moving_time && (
                        <View style={styles.statItem}>
                          <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.statText}>
                            {formatDuration(activity.moving_time)}
                          </Text>
                        </View>
                      )}
                      {activity.distance &&
                        activity.moving_time &&
                        activity.distance > 0 && (
                          <View style={styles.statItem}>
                            <TrendingUp
                              size={14}
                              color="rgba(255, 255, 255, 0.8)"
                            />
                            <Text style={styles.statText}>
                              {formatPace(
                                activity.distance,
                                activity.moving_time,
                              )}
                            </Text>
                          </View>
                        )}
                      {activity.average_heartrate && (
                        <View style={styles.statItem}>
                          <Heart size={14} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.statText}>
                            {Math.round(activity.average_heartrate)} bpm
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.locationRow}>
                      <MapPin size={12} color="rgba(255, 255, 255, 0.6)" />
                      <Text style={styles.locationText}>
                        {formatLocation(
                          activity.location_city,
                          activity.location_state,
                          activity.location_country,
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activitiesSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activityContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTitleContainer: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  activityType: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activityDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 20,
  },
  activityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
