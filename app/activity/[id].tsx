import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
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
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import GradientBackground from '../../components/GradientBackground';

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

// Mock data - in real app, this would come from API/database
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
      'Excellent pacing consistency! Your heart rate stayed in the optimal zone for 85% of the workout. Consider adding more recovery time between intervals for better adaptation. Your split times showed remarkable consistency with only 3% variation between fastest and slowest kilometers.',
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
      'Strong endurance performance! Your power output was consistent throughout the ride. The coastal headwinds provided excellent resistance training that will improve your overall cycling strength.',
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
      'Perfect active recovery session. Your heart rate stayed in the ideal recovery zone, promoting muscle repair and reducing inflammation. This type of activity is crucial for long-term training success.',
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
      'Intense workout with excellent heart rate variability. Your recovery between sets improved throughout the session, showing good cardiovascular adaptation and improved fitness.',
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
      'Outstanding endurance run! You maintained negative splits for the final 5km. Your aerobic base is strengthening significantly, which will translate to better race performance.',
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

const getActivityTypeLabel = (type: ActivityType) => {
  switch (type) {
    case 'run':
      return 'Run';
    case 'ride':
      return 'Bike Ride';
    case 'walk':
      return 'Walk';
    case 'workout':
      return 'Workout';
    default:
      return 'Activity';
  }
};

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Activity not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  const { icon: IconComponent, color } = getActivityIcon(activity.type);

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: activity.image }} style={styles.headerImage} />
          <View style={styles.headerOverlay} />

          {/* Navigation Header */}
          <View style={styles.navigationHeader}>
            <TouchableOpacity
              style={styles.backButton}
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

          {/* Activity Title Overlay */}
          <View style={styles.titleOverlay}>
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
                {getActivityTypeLabel(activity.type)}
              </Text>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>

            <View style={styles.dateLocationRow}>
              <View style={styles.dateRow}>
                <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.dateText}>{activity.date}</Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.locationText}>{activity.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {activity.distance !== '0km' && (
            <View style={styles.statCard}>
              <MapPin size={24} color="#10b981" />
              <Text style={styles.statValue}>{activity.distance}</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          )}

          <View style={styles.statCard}>
            <Clock size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{activity.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>

          {activity.pace !== 'N/A' && (
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#ef4444" />
              <Text style={styles.statValue}>{activity.pace}</Text>
              <Text style={styles.statLabel}>Pace</Text>
            </View>
          )}
        </View>

        {/* Additional Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Flame size={20} color="#f59e0b" />
              <Text style={styles.metricValue}>{activity.calories}</Text>
              <Text style={styles.metricLabel}>Calories</Text>
            </View>

            {activity.heartRate && (
              <View style={styles.metricCard}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.metricValue}>{activity.heartRate}</Text>
                <Text style={styles.metricLabel}>Avg HR</Text>
              </View>
            )}

            {activity.elevation && (
              <View style={styles.metricCard}>
                <Mountain size={20} color="#8b5cf6" />
                <Text style={styles.metricValue}>{activity.elevation}</Text>
                <Text style={styles.metricLabel}>Elevation</Text>
              </View>
            )}
          </View>
        </View>

        {/* AI Analysis */}
        <View style={styles.analysisContainer}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>AI Performance Analysis</Text>
          </View>

          <View style={styles.analysisCard}>
            <Text style={styles.analysisText}>{activity.aiAnalysis}</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Route Map</Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.mapPlaceholderText}>
              Map visualization coming soon
            </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  backText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#10b981',
  },
  headerContainer: {
    position: 'relative',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  navigationHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
    color: '#fff',
  },
  activityTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
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
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    gap: 12,
  },
  metricCard: {
    flex: 1,
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
  analysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  mapContainer: {
    padding: 20,
    paddingTop: 0,
  },
  mapPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});
