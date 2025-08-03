import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
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

SplashScreen.preventAutoHideAsync();

type ActivityType = 'run' | 'ride' | 'walk' | 'workout';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  distance: string;
  duration: string;
  pace: string;
  date: string;
  location: string;
  image: string;
  calories: number;
  heartRate?: number;
  elevation?: string;
  aiAnalysis: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'run',
    title: 'Morning Interval Run',
    description: 'Perfect weather for speed work',
    distance: '8.2km',
    duration: '42:15',
    pace: '5:09/km',
    date: '2 hours ago',
    location: 'Golden Gate Park',
    image:
      'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    calories: 486,
    heartRate: 165,
    elevation: '124m',
    aiAnalysis:
      'Excellent pacing consistency! Your heart rate stayed in the optimal zone for 85% of the workout. Consider adding more recovery time between intervals.',
  },
  {
    id: '2',
    type: 'ride',
    title: 'Coastal Bike Ride',
    description: 'Beautiful sunset ride along the coast',
    distance: '32.4km',
    duration: '1:18:32',
    pace: '24.8km/h',
    date: 'Yesterday',
    location: 'Pacific Coast Highway',
    image:
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
    calories: 892,
    heartRate: 142,
    elevation: '456m',
    aiAnalysis:
      'Strong endurance performance! Your power output was consistent throughout the ride. The coastal headwinds provided excellent resistance training.',
  },
  {
    id: '3',
    type: 'walk',
    title: 'Recovery Walk',
    description: 'Easy recovery day in the neighborhood',
    distance: '4.1km',
    duration: '48:20',
    pace: '11:47/km',
    date: '2 days ago',
    location: 'Neighborhood Loop',
    image:
      'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=800',
    calories: 198,
    heartRate: 98,
    aiAnalysis:
      'Perfect active recovery session. Your heart rate stayed in the ideal recovery zone, promoting muscle repair and reducing inflammation.',
  },
  {
    id: '4',
    type: 'workout',
    title: 'HIIT Training',
    description: 'High-intensity circuit training',
    distance: '0km',
    duration: '35:00',
    pace: 'N/A',
    date: '3 days ago',
    location: 'Home Gym',
    image:
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    calories: 425,
    heartRate: 178,
    aiAnalysis:
      'Intense workout with excellent heart rate variability. Your recovery between sets improved throughout the session, showing good cardiovascular adaptation.',
  },
  {
    id: '5',
    type: 'run',
    title: 'Long Sunday Run',
    description: 'Building endurance for upcoming race',
    distance: '16.8km',
    duration: '1:24:12',
    pace: '5:01/km',
    date: '4 days ago',
    location: 'Marina District',
    image:
      'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    calories: 1024,
    heartRate: 152,
    elevation: '89m',
    aiAnalysis:
      'Outstanding endurance run! You maintained negative splits for the final 5km. Your aerobic base is strengthening significantly.',
  },
];

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

const getActivityTypeLabel = (
  type: ActivityType,
  t: (key: string) => string,
) => {
  switch (type) {
    case 'run':
      return t('training.easyRun');
    case 'ride':
      return 'Bike Ride';
    case 'walk':
      return 'Walk';
    case 'workout':
      return t('training.workoutComplete');
    default:
      return 'Activity';
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.welcome')}</Text>
          <Text style={styles.subtitle}>{t('home.recentActivities')}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>47.2km</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>9.4km</Text>
            <Text style={styles.statLabel}>Avg/Activity</Text>
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

          {activities.map((activity) => {
            const { icon: IconComponent, color } = getActivityIcon(
              activity.type,
            );

            return (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => router.push(`/activity/${activity.id}`)}
              >
                <Image
                  source={{ uri: activity.image }}
                  style={styles.activityImage}
                />

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
                          {activity.title}
                        </Text>
                        <Text style={styles.activityType}>
                          {getActivityTypeLabel(activity.type, t)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>

                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>

                  <View style={styles.activityStats}>
                    {activity.distance !== '0km' && (
                      <View style={styles.statItem}>
                        <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                        <Text style={styles.statText}>{activity.distance}</Text>
                      </View>
                    )}
                    <View style={styles.statItem}>
                      <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.statText}>{activity.duration}</Text>
                    </View>
                    {activity.pace !== 'N/A' && (
                      <View style={styles.statItem}>
                        <TrendingUp
                          size={14}
                          color="rgba(255, 255, 255, 0.8)"
                        />
                        <Text style={styles.statText}>{activity.pace}</Text>
                      </View>
                    )}
                    {activity.heartRate && (
                      <View style={styles.statItem}>
                        <Heart size={14} color="rgba(255, 255, 255, 0.8)" />
                        <Text style={styles.statText}>
                          {activity.heartRate} bpm
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.locationRow}>
                    <MapPin size={12} color="rgba(255, 255, 255, 0.6)" />
                    <Text style={styles.locationText}>{activity.location}</Text>
                  </View>

                  <View style={styles.aiAnalysisContainer}>
                    <View style={styles.aiAnalysisHeader}>
                      <Zap size={14} color="#10b981" />
                      <Text style={styles.aiAnalysisTitle}>AI Analysis</Text>
                    </View>
                    <Text style={styles.aiAnalysisText}>
                      {activity.aiAnalysis}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
  activityImage: {
    width: '100%',
    height: 120,
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
  aiAnalysisContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiAnalysisTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#10b981',
  },
  aiAnalysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});
