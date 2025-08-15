import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Plus,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import GradientBackground from '../../../components/GradientBackground';
import { useTraining } from '../../../contexts/TrainingContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function TrainingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { trainingPlans, currentPlan, loading, error, refreshPlans } =
    useTraining();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlans();
    setRefreshing(false);
  }, [refreshPlans]);

  const getCurrentWeekWorkouts = () => {
    if (!currentPlan?.workouts) return [];

    const currentWeek =
      Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % currentPlan.duration;
    return currentPlan.workouts.filter((w) => w.week_number === currentWeek);
  };

  const getWorkoutStatus = (dayOfWeek: number) => {
    const today = new Date().getDay();
    if (dayOfWeek < today) return 'completed';
    if (dayOfWeek === today) return 'current';
    return 'pending';
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Training Plans</Text>
          <Text style={styles.subtitle}>Personalized by AI for your goals</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Program</Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => router.push('/training/generate-plan')}
            >
              <Brain size={16} color="#fff" />
              <Text style={styles.generateButtonText}>AI Plan</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : currentPlan ? (
            <TouchableOpacity
              style={styles.programCard}
              onPress={() => router.push('/training/program')}
            >
              <View style={styles.programHeader}>
                <Text style={styles.programTitle}>{currentPlan.name}</Text>
                <Text style={styles.programWeek}>
                  Week 1 of {currentPlan.duration}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '12.5%' }]} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.emptyProgramCard}
              onPress={() => router.push('/training/generate-plan')}
            >
              <Plus size={48} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.emptyProgramText}>
                Create your first training plan
              </Text>
              <Text style={styles.emptyProgramSubtext}>
                Let AI generate a personalized plan for you
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Floating Action Button for creating new plans */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/training/generate-plan')}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>

        {currentPlan && (
          <View style={styles.workouts}>
            <Text style={styles.sectionTitle}>This Week's Workouts</Text>

            {getCurrentWeekWorkouts().map((workout, index) => {
              const dayNames = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              const status = getWorkoutStatus(workout.day_of_week);

              return (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.workoutCard}
                  onPress={() => router.push('/training/run')}
                >
                  <View
                    style={[
                      styles.workoutStatus,
                      status === 'completed' && styles.completed,
                      status === 'current' && styles.current,
                    ]}
                  />
                  <View style={styles.workoutContent}>
                    <Text style={styles.workoutDay}>
                      {dayNames[workout.day_of_week]}
                    </Text>
                    <Text style={styles.workoutTitle}>{workout.name}</Text>
                    <View style={styles.workoutDetails}>
                      {workout.distance && (
                        <View style={styles.detailItem}>
                          <Target size={16} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.detailText}>
                            {workout.distance}km
                          </Text>
                        </View>
                      )}
                      <View style={styles.detailItem}>
                        <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                        <Text style={styles.detailText}>
                          {workout.duration}min
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <TrendingUp
                          size={16}
                          color="rgba(255, 255, 255, 0.8)"
                        />
                        <Text style={styles.detailText}>{workout.type}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  title: {
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
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  generateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#fff',
  },
  programCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  programTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  programWeek: {
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
  workouts: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  workoutStatus: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  completed: {
    backgroundColor: '#10b981',
  },
  current: {
    backgroundColor: '#3b82f6',
  },
  workoutContent: {
    flex: 1,
    padding: 15,
  },
  workoutDay: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  workoutTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#10b981',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProgramCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  emptyProgramText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyProgramSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    textAlign: 'center',
  },
});
