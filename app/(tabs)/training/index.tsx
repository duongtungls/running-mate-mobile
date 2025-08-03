import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../../../components/GradientBackground';

export default function TrainingScreen() {
  const router = useRouter();

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Training Plans</Text>
          <Text style={styles.subtitle}>Personalized by AI for your goals</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Program</Text>
          <TouchableOpacity
            style={styles.programCard}
            onPress={() => router.push('/training/program')}
          >
            <View style={styles.programHeader}>
              <Text style={styles.programTitle}>5K Improvement Plan</Text>
              <Text style={styles.programWeek}>Week 3 of 8</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '37.5%' }]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.workouts}>
          <Text style={styles.sectionTitle}>This Week's Workouts</Text>

          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => router.push('/training/run')}
          >
            <View style={[styles.workoutStatus, styles.completed]} />
            <View style={styles.workoutContent}>
              <Text style={styles.workoutDay}>Monday</Text>
              <Text style={styles.workoutTitle}>Easy Run</Text>
              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Target size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>5km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>30min</Text>
                </View>
                <View style={styles.detailItem}>
                  <TrendingUp size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>Easy pace</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => router.push('/training/run')}
          >
            <View style={[styles.workoutStatus, styles.current]} />
            <View style={styles.workoutContent}>
              <Text style={styles.workoutDay}>Wednesday</Text>
              <Text style={styles.workoutTitle}>Interval Training</Text>
              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Target size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>6km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>45min</Text>
                </View>
                <View style={styles.detailItem}>
                  <TrendingUp size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>High intensity</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => router.push('/training/run')}
          >
            <View style={styles.workoutStatus} />
            <View style={styles.workoutContent}>
              <Text style={styles.workoutDay}>Friday</Text>
              <Text style={styles.workoutTitle}>Long Run</Text>
              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Target size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>10km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>60min</Text>
                </View>
                <View style={styles.detailItem}>
                  <TrendingUp size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>Steady pace</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
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
});
