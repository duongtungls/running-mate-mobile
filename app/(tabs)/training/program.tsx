import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  CircleCheck as CheckCircle,
  Circle,
  Play,
  Users,
  Trophy,
  Zap,
} from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';

type WorkoutStatus = 'completed' | 'current' | 'upcoming';

interface Workout {
  id: string;
  day: string;
  date: string;
  title: string;
  type: string;
  distance: string;
  duration: string;
  intensity: string;
  description: string;
  status: WorkoutStatus;
  calories?: number;
  heartRateZone?: string;
}

const workouts: Workout[] = [
  {
    id: '1',
    day: 'Monday',
    date: 'Mar 11',
    title: 'Easy Recovery Run',
    type: 'Endurance',
    distance: '5km',
    duration: '30min',
    intensity: 'Easy',
    description: 'Gentle pace to promote recovery and maintain aerobic base',
    status: 'completed',
    calories: 285,
    heartRateZone: 'Zone 1-2',
  },
  {
    id: '2',
    day: 'Tuesday',
    date: 'Mar 12',
    title: 'Rest Day',
    type: 'Recovery',
    distance: '0km',
    duration: '0min',
    intensity: 'Rest',
    description: 'Complete rest or light stretching/yoga',
    status: 'completed',
  },
  {
    id: '3',
    day: 'Wednesday',
    date: 'Mar 13',
    title: 'Interval Training',
    type: 'Speed Work',
    distance: '6km',
    duration: '45min',
    intensity: 'High',
    description: '6 x 3min intervals at 5K pace with 2min recovery',
    status: 'current',
    calories: 486,
    heartRateZone: 'Zone 4-5',
  },
  {
    id: '4',
    day: 'Thursday',
    date: 'Mar 14',
    title: 'Cross Training',
    type: 'Strength',
    distance: '0km',
    duration: '40min',
    intensity: 'Moderate',
    description: 'Core and leg strength training with resistance exercises',
    status: 'upcoming',
    calories: 320,
    heartRateZone: 'Zone 2-3',
  },
  {
    id: '5',
    day: 'Friday',
    date: 'Mar 15',
    title: 'Tempo Run',
    type: 'Threshold',
    distance: '8km',
    duration: '50min',
    intensity: 'Moderate-High',
    description: '20min tempo at half-marathon pace with warm-up/cool-down',
    status: 'upcoming',
    calories: 520,
    heartRateZone: 'Zone 3-4',
  },
  {
    id: '6',
    day: 'Saturday',
    date: 'Mar 16',
    title: 'Rest Day',
    type: 'Recovery',
    distance: '0km',
    duration: '0min',
    intensity: 'Rest',
    description: 'Active recovery with light walking or stretching',
    status: 'upcoming',
  },
  {
    id: '7',
    day: 'Sunday',
    date: 'Mar 17',
    title: 'Long Run',
    type: 'Endurance',
    distance: '12km',
    duration: '75min',
    intensity: 'Moderate',
    description: 'Steady aerobic pace to build endurance base',
    status: 'upcoming',
    calories: 780,
    heartRateZone: 'Zone 2-3',
  },
];

const getStatusIcon = (status: WorkoutStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={20} color="#10b981" />;
    case 'current':
      return <Play size={20} color="#3b82f6" />;
    case 'upcoming':
      return <Circle size={20} color="rgba(255, 255, 255, 0.4)" />;
  }
};

const getStatusColor = (status: WorkoutStatus) => {
  switch (status) {
    case 'completed':
      return '#10b981';
    case 'current':
      return '#3b82f6';
    case 'upcoming':
      return 'rgba(255, 255, 255, 0.2)';
  }
};

const getIntensityColor = (intensity: string) => {
  switch (intensity.toLowerCase()) {
    case 'easy':
      return '#10b981';
    case 'moderate':
      return '#f59e0b';
    case 'moderate-high':
      return '#f97316';
    case 'high':
      return '#ef4444';
    case 'rest':
      return '#6b7280';
    default:
      return '#6b7280';
  }
};

export default function ProgramDetailScreen() {
  const router = useRouter();

  const completedWorkouts = workouts.filter(
    (w) => w.status === 'completed',
  ).length;
  const totalWorkouts = workouts.length;
  const progressPercentage = (completedWorkouts / totalWorkouts) * 100;

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>5K Improvement Plan</Text>
            <Text style={styles.subtitle}>
              Week 3 of 8 • Intermediate Level
            </Text>
          </View>
        </View>

        {/* Program Overview */}
        <View style={styles.overviewCard}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
            }}
            style={styles.overviewImage}
          />
          <View style={styles.overviewContent}>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Weekly Progress</Text>
                <Text style={styles.progressText}>
                  {completedWorkouts}/{totalWorkouts} completed
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Target size={20} color="#10b981" />
                <Text style={styles.statValue}>31km</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color="#10b981" />
                <Text style={styles.statValue}>4h 20m</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={20} color="#10b981" />
                <Text style={styles.statValue}>18:45</Text>
                <Text style={styles.statLabel}>Target 5K</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Program Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Program Overview</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              This 8-week program is designed to improve your 5K time through a
              balanced mix of speed work, tempo runs, and endurance training.
              Each week builds progressively to enhance your aerobic capacity
              and running efficiency.
            </Text>

            <View style={styles.infoStats}>
              <View style={styles.infoStatItem}>
                <Users size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.infoStatText}>12,847 runners</Text>
              </View>
              <View style={styles.infoStatItem}>
                <Award size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.infoStatText}>4.8/5 rating</Text>
              </View>
              <View style={styles.infoStatItem}>
                <Zap size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.infoStatText}>AI Optimized</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>This Week's Schedule</Text>

          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={[
                styles.workoutCard,
                workout.status === 'current' && styles.currentWorkoutCard,
              ]}
              onPress={() =>
                workout.status === 'current' && router.push('/training/run')
              }
            >
              <View
                style={[
                  styles.workoutStatus,
                  { backgroundColor: getStatusColor(workout.status) },
                ]}
              />

              <View style={styles.workoutContent}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTitleRow}>
                    {getStatusIcon(workout.status)}
                    <View style={styles.workoutTitleContainer}>
                      <Text style={styles.workoutDay}>{workout.day}</Text>
                      <Text style={styles.workoutDate}>{workout.date}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.intensityBadge,
                      {
                        backgroundColor: `${getIntensityColor(workout.intensity)}20`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.intensityText,
                        { color: getIntensityColor(workout.intensity) },
                      ]}
                    >
                      {workout.intensity}
                    </Text>
                  </View>
                </View>

                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <Text style={styles.workoutType}>{workout.type}</Text>
                <Text style={styles.workoutDescription}>
                  {workout.description}
                </Text>

                {workout.distance !== '0km' && (
                  <View style={styles.workoutStats}>
                    <View style={styles.workoutStatItem}>
                      <Target size={14} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.workoutStatText}>
                        {workout.distance}
                      </Text>
                    </View>
                    <View style={styles.workoutStatItem}>
                      <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.workoutStatText}>
                        {workout.duration}
                      </Text>
                    </View>
                    {workout.calories && (
                      <View style={styles.workoutStatItem}>
                        <Zap size={14} color="rgba(255, 255, 255, 0.8)" />
                        <Text style={styles.workoutStatText}>
                          {workout.calories} cal
                        </Text>
                      </View>
                    )}
                    {workout.heartRateZone && (
                      <View style={styles.workoutStatItem}>
                        <TrendingUp
                          size={14}
                          color="rgba(255, 255, 255, 0.8)"
                        />
                        <Text style={styles.workoutStatText}>
                          {workout.heartRateZone}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {workout.status === 'current' && (
                  <View style={styles.currentWorkoutIndicator}>
                    <Play size={16} color="#fff" />
                    <Text style={styles.currentWorkoutText}>
                      Ready to start
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  overviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overviewImage: {
    width: '100%',
    height: 120,
  },
  overviewContent: {
    padding: 20,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleSection: {
    padding: 20,
    paddingTop: 0,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentWorkoutCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  workoutStatus: {
    width: 4,
  },
  workoutContent: {
    flex: 1,
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutTitleContainer: {
    marginLeft: 12,
  },
  workoutDay: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  workoutDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  intensityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
  },
  workoutTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  workoutType: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  workoutDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  workoutStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  currentWorkoutIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  currentWorkoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  bottomSpacing: {
    height: 20,
  },
});
