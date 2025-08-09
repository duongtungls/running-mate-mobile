import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Zap,
  Target,
  Activity,
  TrendingUp,
  User,
  CheckCircle,
  Play,
  Clock,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingHeader from '../../components/OnboardingHeader';
import SelectionCard from '../../components/SelectionCard';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    {
      id: 'general-fitness',
      title: 'General Fitness',
      description: 'Stay healthy and maintain regular running routine',
      icon: User,
      color: '#22c55e',
    },
    {
      id: 'weight-loss',
      title: 'Weight Loss',
      description: 'Burn calories and improve overall fitness',
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      id: '5k',
      title: '5K Training',
      description: 'Build up to running 5K without stopping',
      icon: Target,
      color: '#f59e0b',
    },
    {
      id: '10k',
      title: '10K Training',
      description: 'Build endurance for longer distances',
      icon: Activity,
      color: '#8b5cf6',
    },
    {
      id: 'half-marathon',
      title: 'Half Marathon',
      description: 'Train for 21.1K challenge',
      icon: TrendingUp,
      color: '#ef4444',
    },
    {
      id: 'marathon',
      title: 'Marathon',
      description: 'Ultimate 42.2K goal',
      icon: Activity,
      color: '#06b6d4',
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

  const handleContinue = () => {
    if (selectedGoal) {
      router.push('/onboarding/profile' as any);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/profile' as any);
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
            title="Welcome to RunningMate"
            subtitle="Let's create a personalized training plan that fits your goals and lifestyle"
            icon={<Zap size={28} color="#fff" />}
            showBackButton={false}
          />

          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroImage}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&h=400&q=80',
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <View style={styles.imageContent}>
                  <Text style={styles.imageTitle}>Your AI Running Coach</Text>
                  <Text style={styles.imageText}>
                    Personalized training plans powered by artificial
                    intelligence
                  </Text>
                </View>
              </View>
            </View>

            {/* Goal Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's your main goal?</Text>
              <Text style={styles.sectionSubtitle}>
                Choose what you'd like to achieve first. You can always change
                this later.
              </Text>

              <View style={styles.goalsContainer}>
                {goals.map((goal) => (
                  <SelectionCard
                    key={goal.id}
                    title={goal.title}
                    description={goal.description}
                    icon={goal.icon}
                    isSelected={selectedGoal === goal.id}
                    onPress={() => setSelectedGoal(goal.id)}
                    color={goal.color}
                    showIcon={true}
                  />
                ))}
              </View>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What you'll get:</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color="#22c55e" />
                  <Text style={styles.featureText}>
                    AI-powered training plans
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color="#22c55e" />
                  <Text style={styles.featureText}>
                    Real-time progress tracking
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color="#22c55e" />
                  <Text style={styles.featureText}>
                    Personalized insights & tips
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color="#22c55e" />
                  <Text style={styles.featureText}>Community support</Text>
                </View>
              </View>
            </View>

            {/* Next Steps Preview */}
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
          </View>

          <View style={styles.footer}>
            <OnboardingProgress currentStep={1} totalSteps={8} />

            <OnboardingButton
              title="Continue"
              onPress={handleContinue}
              disabled={!selectedGoal}
              variant="primary"
              showArrow={true}
              arrowDirection="right"
            />

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
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
  content: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroImage: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  imageContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  imageTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  imageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
    lineHeight: 22,
  },
  goalsContainer: {
    gap: 12,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
