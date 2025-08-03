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
  Flame,
  Heart,
  Map,
  Target,
  TrendingUp,
  X,
} from 'lucide-react-native';

export default function RunDetailScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.headerImage}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Workout Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Interval Training</Text>
            <Text style={styles.subtitle}>High-intensity workout</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Target size={24} color="#10b981" />
              <Text style={styles.statValue}>6.0km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={24} color="#10b981" />
              <Text style={styles.statValue}>45:00</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color="#10b981" />
              <Text style={styles.statValue}>486</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Heart size={24} color="#10b981" />
              <Text style={styles.statValue}>165</Text>
              <Text style={styles.statLabel}>Avg HR</Text>
            </View>
          </View>

          {/* Workout Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleCard}>
              <Calendar size={20} color="#666" />
              <Text style={styles.scheduleText}>
                Wednesday, March 13 • 6:30 AM
              </Text>
            </View>
          </View>

          {/* Workout Structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Structure</Text>
            <View style={styles.workoutPhases}>
              <View style={styles.phase}>
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseName}>Warm Up</Text>
                  <Text style={styles.phaseDuration}>10 minutes</Text>
                </View>
                <Text style={styles.phaseDescription}>
                  Easy pace running to warm up muscles
                </Text>
              </View>

              <View style={styles.phase}>
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseName}>Intervals</Text>
                  <Text style={styles.phaseDuration}>25 minutes</Text>
                </View>
                <Text style={styles.phaseDescription}>
                  6 x 3 minutes at high intensity with 2-minute recovery
                </Text>
              </View>

              <View style={styles.phase}>
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseName}>Cool Down</Text>
                  <Text style={styles.phaseDuration}>10 minutes</Text>
                </View>
                <Text style={styles.phaseDescription}>
                  Easy pace running to gradually reduce heart rate
                </Text>
              </View>
            </View>
          </View>

          {/* AI Coach Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Coach Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                Focus on maintaining consistent pace during high-intensity
                intervals. Your target pace should be around 4:30/km for these
                segments. Remember to breathe rhythmically and keep your form
                strong even when fatigue sets in.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statItem: {
    width: '50%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  scheduleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1a1a1a',
  },
  workoutPhases: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  phase: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  phaseDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  phaseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
