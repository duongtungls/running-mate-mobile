import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Award,
  Calendar,
  ChevronRight,
  Mail,
  MapPin,
  Medal,
  Settings,
  Trophy,
  User as UserIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../../../components/GradientBackground';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <UserIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Sarah Connor</Text>
          <Text style={styles.handle}>@sarahconnor</Text>

          <View style={styles.bioContainer}>
            <Text style={styles.bio}>
              🏃‍♀️ Marathon enthusiast | Personal best: 3:45:22
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.location}>San Francisco, CA</Text>
            </View>
            <View style={styles.joinDateContainer}>
              <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.joinDate}>Joined March 2024</Text>
            </View>
            <View style={styles.emailContainer}>
              <Mail size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.email}>sarah.connor@example.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>286</Text>
            <Text style={styles.statLabel}>Runs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,524</Text>
            <Text style={styles.statLabel}>km Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Medals</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievements}>
            <View style={styles.achievement}>
              <View
                style={[styles.achievementIcon, { backgroundColor: '#fef3c7' }]}
              >
                <Trophy size={24} color="#d97706" />
              </View>
              <Text style={styles.achievementTitle}>Marathon</Text>
              <Text style={styles.achievementSubtitle}>Finisher</Text>
            </View>
            <View style={styles.achievement}>
              <View
                style={[styles.achievementIcon, { backgroundColor: '#e0e7ff' }]}
              >
                <Medal size={24} color="#4f46e5" />
              </View>
              <Text style={styles.achievementTitle}>10K</Text>
              <Text style={styles.achievementSubtitle}>Sub 45min</Text>
            </View>
            <View style={styles.achievement}>
              <View
                style={[styles.achievementIcon, { backgroundColor: '#dcfce7' }]}
              >
                <Award size={24} color="#15803d" />
              </View>
              <Text style={styles.achievementTitle}>Streak</Text>
              <Text style={styles.achievementSubtitle}>30 Days</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/profile/settings')}
        >
          <Settings size={20} color="#fff" />
          <Text style={styles.settingsText}>Settings</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  handle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  bioContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  joinDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievement: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 2,
  },
  achievementSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
  },
});
