import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
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
  LogOut,
  Bell,
  Edit3,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '../../../hooks/useI18n';
import GradientBackground from '../../../components/GradientBackground';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';
import { NotificationBell } from '../../../components/NotificationBell';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, signOut, loading: authLoading } = useAuth();
  const {
    profile,
    stats,
    achievements,
    profileLoading,
    statsLoading,
    achievementsLoading,
    refreshAll,
  } = useProfile();

  const handleSignOut = () => {
    Alert.alert(t('common.signOut'), 'Are you sure you want to sign out?', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.signOut'), style: 'destructive', onPress: signOut },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/profile/edit');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  };

  const formatDistance = (
    meters: number | undefined,
    units: string = 'metric',
  ) => {
    if (!meters) return '0';
    if (units === 'imperial') {
      const miles = meters / 1609.34;
      return miles.toFixed(1);
    }
    const km = meters / 1000;
    return km.toFixed(1);
  };

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '0m';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    else if (hours > 0) return `${hours}h ${minutes}m`;
    else return `${minutes}m`;
  };

  const getDisplayName = () => {
    return (
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Runner'
    );
  };

  const getDisplayEmail = () => {
    return user?.email || 'runner@example.com';
  };

  const loading = profileLoading || statsLoading || achievementsLoading;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshAll}
            tintColor="#fff"
          />
        }
      >
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <Text style={styles.screenTitle}>{t('navigation.profile')}</Text>
          <View style={styles.topActions}>
            <NotificationBell onPress={() => router.push('/notifications')} />
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              disabled={authLoading}
            >
              <LogOut size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      profile?.avatar_url ||
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
                  }}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditProfile}
                >
                  <Edit3 size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{getDisplayName()}</Text>
              <Text style={styles.handle}>{getDisplayEmail()}</Text>

              <View style={styles.bioContainer}>
                {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                {profile?.location && (
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.location}>{profile.location}</Text>
                  </View>
                )}

                {profile?.created_at && (
                  <View style={styles.joinDateContainer}>
                    <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.joinDate}>
                      Joined {formatDate(profile.created_at)}
                    </Text>
                  </View>
                )}

                <View style={styles.emailContainer}>
                  <Mail size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.email}>{getDisplayEmail()}</Text>
                </View>
              </View>
            </View>

            {/* Year-to-Date Stats (Primary) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>This Year</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats?.ytd_runs || stats?.total_runs || 0}
                </Text>
                <Text style={styles.statLabel}>Runs</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatDistance(
                    stats?.ytd_distance || stats?.total_distance,
                    profile?.preferred_units,
                  )}
                </Text>
                <Text style={styles.statLabel}>
                  {profile?.preferred_units === 'imperial' ? 'mi' : 'km'}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatDuration(stats?.ytd_moving_time || stats?.total_time)}
                </Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            </View>

            {/* All-Time Stats (Secondary) */}
            {stats &&
              (stats.total_runs !== stats.ytd_runs ||
                stats.total_distance !== stats.ytd_distance) && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>All Time</Text>
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <Text style={styles.statValue}>
                        {stats.total_runs || 0}
                      </Text>
                      <Text style={styles.statLabel}>Total Runs</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statValue}>
                        {formatDistance(
                          stats.total_distance,
                          profile?.preferred_units,
                        )}
                      </Text>
                      <Text style={styles.statLabel}>
                        Total{' '}
                        {profile?.preferred_units === 'imperial' ? 'mi' : 'km'}
                      </Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statValue}>
                        {achievements.length}
                      </Text>
                      <Text style={styles.statLabel}>Achievements</Text>
                    </View>
                  </View>
                </>
              )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              {achievements.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.achievementsScroll}
                >
                  {achievements.slice(0, 5).map((achievement, index) => (
                    <View key={achievement.id} style={styles.achievement}>
                      <View
                        style={[
                          styles.achievementIcon,
                          { backgroundColor: achievement.color || '#fef3c7' },
                        ]}
                      >
                        <Trophy size={24} color="#d97706" />
                      </View>
                      <Text style={styles.achievementTitle}>
                        {achievement.title}
                      </Text>
                      <Text
                        style={styles.achievementSubtitle}
                        numberOfLines={2}
                      >
                        {achievement.description}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noAchievements}>
                  <Text style={styles.noAchievementsText}>
                    No achievements yet. Start running to earn your first
                    achievement!
                  </Text>
                </View>
              )}
            </View>

            {stats && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Records</Text>
                <View style={styles.recordsContainer}>
                  {stats.fastest_5k_time && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Fastest 5K</Text>
                      <Text style={styles.recordValue}>
                        {formatTime(stats.fastest_5k_time)}
                      </Text>
                    </View>
                  )}
                  {stats.fastest_10k_time && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Fastest 10K</Text>
                      <Text style={styles.recordValue}>
                        {formatTime(stats.fastest_10k_time)}
                      </Text>
                    </View>
                  )}
                  {stats.fastest_half_marathon_time && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Fastest Half</Text>
                      <Text style={styles.recordValue}>
                        {formatTime(stats.fastest_half_marathon_time)}
                      </Text>
                    </View>
                  )}
                  {stats.fastest_marathon_time && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Fastest Marathon</Text>
                      <Text style={styles.recordValue}>
                        {formatTime(stats.fastest_marathon_time)}
                      </Text>
                    </View>
                  )}
                  {stats.longest_run_distance && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Longest Run</Text>
                      <Text style={styles.recordValue}>
                        {formatDistance(
                          stats.longest_run_distance,
                          profile?.preferred_units,
                        )}{' '}
                        {profile?.preferred_units === 'imperial' ? 'mi' : 'km'}
                      </Text>
                    </View>
                  )}
                  {stats.current_streak > 0 && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Current Streak</Text>
                      <Text style={styles.recordValue}>
                        {stats.current_streak} days
                      </Text>
                    </View>
                  )}
                  {stats.total_elevation_gain > 0 && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Total Elevation</Text>
                      <Text style={styles.recordValue}>
                        {Math.round(stats.total_elevation_gain)} m
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color="#fff" />
          <Text style={styles.settingsText}>{t('common.settings')}</Text>
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  screenTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  achievementsScroll: {
    paddingHorizontal: 10,
  },
  noAchievements: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  noAchievementsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  recordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recordItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: '48%',
  },
  recordLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  recordValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
});
