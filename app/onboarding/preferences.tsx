import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  ArrowLeft,
  Settings,
  Bell,
  Globe,
  Moon,
  Zap,
  Clock,
  CheckCircle,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

interface PreferencesData {
  units: 'metric' | 'imperial';
  language: string;
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    achievements: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareActivities: boolean;
    allowAnalytics: boolean;
  };
  training: {
    preferredTime: string;
    restDayReminders: boolean;
    adaptivePlanning: boolean;
  };
}

export default function OnboardingPreferencesScreen() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<PreferencesData>({
    units: 'metric',
    language: 'en',
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      achievements: true,
      weeklyReports: false,
    },
    privacy: {
      shareActivities: false,
      allowAnalytics: true,
    },
    training: {
      preferredTime: 'morning',
      restDayReminders: true,
      adaptivePlanning: true,
    },
  });

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'Deutsch' },
    { id: 'ko', name: '한국어' },
    { id: 'vi', name: 'Tiếng Việt' },
  ];

  const trainingTimes = [
    { id: 'morning', name: 'Morning (6-10 AM)', icon: '🌅' },
    { id: 'afternoon', name: 'Afternoon (12-4 PM)', icon: '☀️' },
    { id: 'evening', name: 'Evening (5-8 PM)', icon: '🌆' },
    { id: 'flexible', name: 'Flexible', icon: '🕐' },
  ];

  const updateNotification = (
    key: keyof PreferencesData['notifications'],
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePrivacy = (
    key: keyof PreferencesData['privacy'],
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const updateTraining = (
    key: keyof PreferencesData['training'],
    value: boolean | string,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      training: {
        ...prev.training,
        [key]: value,
      },
    }));
  };

  const handleFinish = () => {
    Alert.alert(
      'Setup Complete!',
      'Your profile has been created successfully. Welcome to RunningMate!',
      [
        {
          text: 'Start Training',
          onPress: () => router.push('/(tabs)' as any),
        },
      ],
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <GradientBackground>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Settings size={28} color="#fff" />
              </View>
              <Text style={styles.title}>Preferences</Text>
              <Text style={styles.subtitle}>
                Customize your RunningMate experience
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Units & Language */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General</Text>

              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Globe size={20} color="#3b82f6" />
                  <Text style={styles.settingTitle}>Units</Text>
                </View>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      preferences.units === 'metric' &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setPreferences({ ...preferences, units: 'metric' })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        preferences.units === 'metric' &&
                          styles.optionButtonTextActive,
                      ]}
                    >
                      Metric
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      preferences.units === 'imperial' &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setPreferences({ ...preferences, units: 'imperial' })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        preferences.units === 'imperial' &&
                          styles.optionButtonTextActive,
                      ]}
                    >
                      Imperial
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Globe size={20} color="#10b981" />
                  <Text style={styles.settingTitle}>Language</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.languageScroll}
                >
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.id}
                      style={[
                        styles.languageButton,
                        preferences.language === lang.id &&
                          styles.languageButtonActive,
                      ]}
                      onPress={() =>
                        setPreferences({ ...preferences, language: lang.id })
                      }
                    >
                      <Text
                        style={[
                          styles.languageButtonText,
                          preferences.language === lang.id &&
                            styles.languageButtonTextActive,
                        ]}
                      >
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Training Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Training</Text>

              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Clock size={20} color="#f59e0b" />
                  <Text style={styles.settingTitle}>
                    Preferred Training Time
                  </Text>
                </View>
                <View style={styles.timeOptions}>
                  {trainingTimes.map((time) => (
                    <TouchableOpacity
                      key={time.id}
                      style={[
                        styles.timeOption,
                        preferences.training.preferredTime === time.id &&
                          styles.timeOptionActive,
                      ]}
                      onPress={() => updateTraining('preferredTime', time.id)}
                    >
                      <Text style={styles.timeEmoji}>{time.icon}</Text>
                      <Text
                        style={[
                          styles.timeOptionText,
                          preferences.training.preferredTime === time.id &&
                            styles.timeOptionTextActive,
                        ]}
                      >
                        {time.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.toggleCard}>
                <View style={styles.toggleContent}>
                  <Zap size={20} color="#8b5cf6" />
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleTitle}>Adaptive Planning</Text>
                    <Text style={styles.toggleDescription}>
                      Adjust training plans based on your progress and recovery
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.training.adaptivePlanning}
                  onValueChange={(value) =>
                    updateTraining('adaptivePlanning', value)
                  }
                  trackColor={{
                    false: 'rgba(255,255,255,0.1)',
                    true: '#8b5cf6',
                  }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleCard}>
                <View style={styles.toggleContent}>
                  <Moon size={20} color="#6b7280" />
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleTitle}>Rest Day Reminders</Text>
                    <Text style={styles.toggleDescription}>
                      Get reminded to take your scheduled rest days
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.training.restDayReminders}
                  onValueChange={(value) =>
                    updateTraining('restDayReminders', value)
                  }
                  trackColor={{
                    false: 'rgba(255,255,255,0.1)',
                    true: '#6b7280',
                  }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>

              <View style={styles.toggleCard}>
                <View style={styles.toggleContent}>
                  <Bell size={20} color="#ef4444" />
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleTitle}>Workout Reminders</Text>
                    <Text style={styles.toggleDescription}>
                      Get notified about upcoming training sessions
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.notifications.workoutReminders}
                  onValueChange={(value) =>
                    updateNotification('workoutReminders', value)
                  }
                  trackColor={{
                    false: 'rgba(255,255,255,0.1)',
                    true: '#ef4444',
                  }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleCard}>
                <View style={styles.toggleContent}>
                  <CheckCircle size={20} color="#22c55e" />
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleTitle}>Progress Updates</Text>
                    <Text style={styles.toggleDescription}>
                      Celebrate your achievements and milestones
                    </Text>
                  </View>
                </View>
                <Switch
                  value={preferences.notifications.progressUpdates}
                  onValueChange={(value) =>
                    updateNotification('progressUpdates', value)
                  }
                  trackColor={{
                    false: 'rgba(255,255,255,0.1)',
                    true: '#22c55e',
                  }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <CheckCircle size={16} color="#22c55e" />
                <Text style={styles.summaryTitle}>You&apos;re All Set!</Text>
              </View>
              <Text style={styles.summaryText}>
                Your personalized running experience is ready. You can always
                change these preferences later in settings.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '100%' }]} />
              </View>
              <Text style={styles.progressText}>Setup Complete!</Text>
            </View>

            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
            >
              <Text style={styles.finishButtonText}>Start My Journey</Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </GradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  optionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  languageScroll: {
    flexDirection: 'row',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  languageButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  languageButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  timeOptions: {
    gap: 8,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeOptionActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  timeEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  timeOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeOptionTextActive: {
    color: '#fff',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleText: {
    marginLeft: 12,
    flex: 1,
  },
  toggleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  toggleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#22c55e',
    marginLeft: 8,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#22c55e',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  finishButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
});
