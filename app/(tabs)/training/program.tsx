import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
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
  Activity,
  BarChart3,
  Heart,
  Timer,
} from 'lucide-react-native';
import GradientBackground from '../../../components/GradientBackground';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

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
  pace?: string;
  averageHR?: number;
}

interface WeeklyProgress {
  week: number;
  totalDistance: number;
  totalTime: number;
  avgPace: string;
  workoutsCompleted: number;
  caloriesBurned: number;
}

interface PerformanceMetric {
  date: string;
  value: number;
  type: 'pace' | 'distance' | 'heartRate' | 'duration';
}

const weeklyProgress: WeeklyProgress[] = [
  {
    week: 1,
    totalDistance: 28,
    totalTime: 180,
    avgPace: '5:45/km',
    workoutsCompleted: 4,
    caloriesBurned: 1420,
  },
  {
    week: 2,
    totalDistance: 32,
    totalTime: 195,
    avgPace: '5:30/km',
    workoutsCompleted: 5,
    caloriesBurned: 1680,
  },
  {
    week: 3,
    totalDistance: 35,
    totalTime: 210,
    avgPace: '5:15/km',
    workoutsCompleted: 3,
    caloriesBurned: 1291,
  },
];

const performanceData: PerformanceMetric[] = [
  { date: 'Week 1', value: 5.75, type: 'pace' },
  { date: 'Week 2', value: 5.5, type: 'pace' },
  { date: 'Week 3', value: 5.25, type: 'pace' },
  { date: 'Week 4', value: 5.0, type: 'pace' },
];

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
    pace: '6:00/km',
    averageHR: 145,
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
    pace: '4:30/km',
    averageHR: 175,
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
    pace: '5:20/km',
    averageHR: 165,
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
    pace: '5:45/km',
    averageHR: 155,
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

// Simple chart component for progress visualization
const SimpleChart = ({ data, type, height = 120 }) => {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value));
  const chartWidth = screenWidth - 80;
  const barWidth = (chartWidth - 60) / data.length;

  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.chartBars}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <View key={index} style={styles.chartBarContainer}>
              <View
                style={[
                  styles.chartBar,
                  {
                    height: barHeight,
                    width: barWidth - 8,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
              <Text style={[styles.chartLabel, { color: theme.foreground }]}>
                {item.date.replace('Week ', 'W')}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ProgressCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.progressCard, { backgroundColor: `${theme.card}80` }]}>
      <View style={styles.progressCardHeader}>
        <Icon size={20} color={color} />
        <Text style={[styles.progressCardTitle, { color: theme.foreground }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.progressCardValue, { color: theme.foreground }]}>
        {value}
      </Text>
      <Text
        style={[
          styles.progressCardSubtitle,
          { color: `${theme.foreground}80` },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
};

export default function ProgramDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const completedWorkouts = workouts.filter(
    (w) => w.status === 'completed',
  ).length;
  const totalWorkouts = workouts.length;
  const progressPercentage = (completedWorkouts / totalWorkouts) * 100;

  const currentWeek = weeklyProgress[weeklyProgress.length - 1];
  const totalDistance = weeklyProgress.reduce(
    (sum, week) => sum + week.totalDistance,
    0,
  );
  const totalCalories = weeklyProgress.reduce(
    (sum, week) => sum + week.caloriesBurned,
    0,
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: `${theme.card}4D`,
                borderColor: `${theme.foreground}33`,
              },
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.foreground} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.foreground }]}>
              5K Improvement Plan
            </Text>
            <Text style={[styles.subtitle, { color: `${theme.foreground}CC` }]}>
              Week 3 of 8 • Intermediate Level
            </Text>
          </View>
        </View>

        {/* Program Overview */}
        <View
          style={[styles.overviewCard, { backgroundColor: `${theme.card}80` }]}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
            }}
            style={styles.overviewImage}
          />
          <View style={styles.overviewContent}>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text
                  style={[styles.progressTitle, { color: theme.foreground }]}
                >
                  Weekly Progress
                </Text>
                <Text
                  style={[
                    styles.progressText,
                    { color: `${theme.foreground}CC` },
                  ]}
                >
                  {completedWorkouts}/{totalWorkouts} completed
                </Text>
              </View>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: `${theme.foreground}1A` },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Target size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.foreground }]}>
                  {currentWeek.totalDistance}km
                </Text>
                <Text
                  style={[styles.statLabel, { color: `${theme.foreground}CC` }]}
                >
                  This Week
                </Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.foreground }]}>
                  {Math.floor(currentWeek.totalTime / 60)}h{' '}
                  {currentWeek.totalTime % 60}m
                </Text>
                <Text
                  style={[styles.statLabel, { color: `${theme.foreground}CC` }]}
                >
                  Total Time
                </Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.foreground }]}>
                  18:45
                </Text>
                <Text
                  style={[styles.statLabel, { color: `${theme.foreground}CC` }]}
                >
                  Target 5K
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Analytics */}
        <View style={styles.analyticsSection}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
            Performance Analytics
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.progressCardsContainer}>
              <ProgressCard
                title="Total Distance"
                value={`${totalDistance}km`}
                subtitle="Across 3 weeks"
                icon={Target}
                color={theme.primary}
              />
              <ProgressCard
                title="Current Pace"
                value={currentWeek.avgPace}
                subtitle="Average this week"
                icon={Timer}
                color="#f59e0b"
              />
              <ProgressCard
                title="Calories Burned"
                value={totalCalories.toLocaleString()}
                subtitle="Total calories"
                icon={Zap}
                color="#ef4444"
              />
              <ProgressCard
                title="Avg Heart Rate"
                value="162 bpm"
                subtitle="Zone 3-4"
                icon={Heart}
                color="#ec4899"
              />
            </View>
          </ScrollView>

          <View
            style={[styles.chartCard, { backgroundColor: `${theme.card}80` }]}
          >
            <View style={styles.chartHeader}>
              <BarChart3 size={20} color={theme.primary} />
              <Text style={[styles.chartTitle, { color: theme.foreground }]}>
                Pace Progression
              </Text>
            </View>
            <SimpleChart data={performanceData} type="pace" />
          </View>
        </View>

        {/* Program Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
            Program Overview
          </Text>
          <View
            style={[styles.infoCard, { backgroundColor: `${theme.card}80` }]}
          >
            <Text style={[styles.infoText, { color: `${theme.foreground}E6` }]}>
              This 8-week program is designed to improve your 5K time through a
              balanced mix of speed work, tempo runs, and endurance training.
              Each week builds progressively to enhance your aerobic capacity
              and running efficiency.
            </Text>

            <View style={styles.infoStats}>
              <View style={styles.infoStatItem}>
                <Users size={16} color={`${theme.foreground}CC`} />
                <Text
                  style={[
                    styles.infoStatText,
                    { color: `${theme.foreground}CC` },
                  ]}
                >
                  12,847 runners
                </Text>
              </View>
              <View style={styles.infoStatItem}>
                <Award size={16} color={`${theme.foreground}CC`} />
                <Text
                  style={[
                    styles.infoStatText,
                    { color: `${theme.foreground}CC` },
                  ]}
                >
                  4.8/5 rating
                </Text>
              </View>
              <View style={styles.infoStatItem}>
                <Zap size={16} color={`${theme.foreground}CC`} />
                <Text
                  style={[
                    styles.infoStatText,
                    { color: `${theme.foreground}CC` },
                  ]}
                >
                  AI Optimized
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
            This Week&apos;s Schedule
          </Text>

          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={[
                styles.workoutCard,
                { backgroundColor: `${theme.card}80` },
                workout.status === 'current' && [
                  styles.currentWorkoutCard,
                  { borderColor: theme.primary },
                ],
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
                      <Text
                        style={[styles.workoutDay, { color: theme.foreground }]}
                      >
                        {workout.day}
                      </Text>
                      <Text
                        style={[
                          styles.workoutDate,
                          { color: `${theme.foreground}99` },
                        ]}
                      >
                        {workout.date}
                      </Text>
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

                <Text
                  style={[styles.workoutTitle, { color: theme.foreground }]}
                >
                  {workout.title}
                </Text>
                <Text
                  style={[
                    styles.workoutType,
                    { color: `${theme.foreground}B3` },
                  ]}
                >
                  {workout.type}
                </Text>
                <Text
                  style={[
                    styles.workoutDescription,
                    { color: `${theme.foreground}CC` },
                  ]}
                >
                  {workout.description}
                </Text>

                {workout.distance !== '0km' && (
                  <View style={styles.workoutStats}>
                    <View style={styles.workoutStatItem}>
                      <Target size={14} color={`${theme.foreground}CC`} />
                      <Text
                        style={[
                          styles.workoutStatText,
                          { color: `${theme.foreground}CC` },
                        ]}
                      >
                        {workout.distance}
                      </Text>
                    </View>
                    <View style={styles.workoutStatItem}>
                      <Clock size={14} color={`${theme.foreground}CC`} />
                      <Text
                        style={[
                          styles.workoutStatText,
                          { color: `${theme.foreground}CC` },
                        ]}
                      >
                        {workout.duration}
                      </Text>
                    </View>
                    {workout.calories && (
                      <View style={styles.workoutStatItem}>
                        <Zap size={14} color={`${theme.foreground}CC`} />
                        <Text
                          style={[
                            styles.workoutStatText,
                            { color: `${theme.foreground}CC` },
                          ]}
                        >
                          {workout.calories} cal
                        </Text>
                      </View>
                    )}
                    {workout.heartRateZone && (
                      <View style={styles.workoutStatItem}>
                        <TrendingUp size={14} color={`${theme.foreground}CC`} />
                        <Text
                          style={[
                            styles.workoutStatText,
                            { color: `${theme.foreground}CC` },
                          ]}
                        >
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
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
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  analyticsSection: {
    padding: 20,
    paddingTop: 0,
  },
  progressCardsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 4,
  },
  progressCard: {
    borderRadius: 12,
    padding: 16,
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  progressCardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  progressCardValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  progressCardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  chartCard: {
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  chartContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
  },
  chartBar: {
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
