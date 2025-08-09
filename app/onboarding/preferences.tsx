import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckCircle,
  Play,
  Target,
  Clock,
  Zap,
  Settings,
  Bell,
  Shield,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingHeader from '../../components/OnboardingHeader';

export default function OnboardingPreferencesScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);

  const completedSteps = [
    {
      icon: CheckCircle,
      title: 'Plan Selected',
      description: 'Free plan activated',
      completed: true,
    },
    {
      icon: CheckCircle,
      title: 'Account Connected',
      description: 'Strava connected successfully',
      completed: true,
    },
    {
      icon: CheckCircle,
      title: 'Profile Setup',
      description: 'Personal information complete',
      completed: true,
    },
  ];

  const nextSteps = [
    {
      icon: Play,
      title: 'Log your first run',
      description: 'Start tracking your progress',
      action: 'Start Running',
    },
    {
      icon: Target,
      title: 'Set specific goals',
      description: 'Define your target race or distance',
      action: 'Set Goals',
    },
    {
      icon: Clock,
      title: 'Create training plan',
      description: 'Get personalized workouts',
      action: 'Create Plan',
    },
  ];

  const quickTips = [
    {
      title: 'Start Slow',
      description: 'Begin with walk-run intervals to build endurance safely',
    },
    {
      title: 'Be Consistent',
      description: 'Regular training is more important than intensity',
    },
    {
      title: 'Listen to Your Body',
      description: "Rest when needed and don't ignore pain signals",
    },
    {
      title: 'Track Progress',
      description: 'Monitor your improvements and celebrate milestones',
    },
  ];

  const handleComplete = () => {
    Alert.alert(
      'Setup Complete!',
      "Your personalized running experience is ready. Let's start your journey!",
      [
        {
          text: 'Get Started',
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
          <OnboardingHeader
            title="You're All Set!"
            subtitle="Your personalized running experience is ready to go"
            icon={<CheckCircle size={28} color="#fff" />}
            onBack={handleBack}
          />

          <View style={styles.content}>
            {/* Completion Summary */}
            <View style={styles.section}>
              <View style={styles.completionIcon}>
                <CheckCircle size={40} color="#fff" />
              </View>
              <Text style={styles.completionTitle}>Setup Complete!</Text>
              <Text style={styles.completionSubtitle}>
                We've personalized your experience based on your goals and
                preferences.
              </Text>
            </View>

            {/* Progress Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What we've set up:</Text>
              <View style={styles.completedStepsContainer}>
                {completedSteps.map((step, index) => (
                  <View key={index} style={styles.completedStep}>
                    <View style={styles.stepIcon}>
                      <step.icon size={20} color="#22c55e" />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>
                        {step.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Next Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's next?</Text>
              <View style={styles.nextStepsContainer}>
                {nextSteps.map((step, index) => (
                  <View key={index} style={styles.nextStepCard}>
                    <View style={styles.nextStepIcon}>
                      <step.icon size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.nextStepContent}>
                      <Text style={styles.nextStepTitle}>{step.title}</Text>
                      <Text style={styles.nextStepDescription}>
                        {step.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Final Preferences</Text>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceHeader}>
                  <Bell size={20} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.preferenceTitle}>Notifications</Text>
                </View>
                <Text style={styles.preferenceDescription}>
                  Get reminders for workouts and progress updates
                </Text>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    notificationsEnabled && styles.toggleButtonActive,
                  ]}
                  onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  <Text style={styles.toggleButtonText}>
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceHeader}>
                  <Shield size={20} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.preferenceTitle}>Data Sharing</Text>
                </View>
                <Text style={styles.preferenceDescription}>
                  Help improve our AI by sharing anonymous usage data
                </Text>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    dataSharing && styles.toggleButtonActive,
                  ]}
                  onPress={() => setDataSharing(!dataSharing)}
                >
                  <Text style={styles.toggleButtonText}>
                    {dataSharing ? 'Enabled' : 'Disabled'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Tips */}
            <View style={styles.section}>
              <View style={styles.tipsHeader}>
                <Zap size={16} color="#f59e0b" />
                <Text style={styles.tipsTitle}>Quick Tips</Text>
              </View>
              <View style={styles.tipsContainer}>
                {quickTips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Final CTA */}
            <View style={styles.section}>
              <Text style={styles.ctaText}>
                Ready to start your running journey?
              </Text>
              <Text style={styles.ctaSubtext}>Let's go running! 🏃‍♂️</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <OnboardingProgress currentStep={8} totalSteps={8} />

            <OnboardingButton
              title="Complete Setup"
              onPress={handleComplete}
              variant="primary"
              showArrow={true}
              arrowDirection="right"
            />
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
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  completionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  completionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  completedStepsContainer: {
    gap: 12,
  },
  completedStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  nextStepsContainer: {
    gap: 16,
  },
  nextStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  nextStepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  preferenceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  preferenceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  preferenceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  toggleButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tipItem: {
    marginBottom: 12,
  },
  tipTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#f59e0b',
    marginBottom: 4,
  },
  tipDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  ctaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtext: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
});
