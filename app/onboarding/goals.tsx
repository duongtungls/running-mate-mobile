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
  ArrowRight,
  ArrowLeft,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

interface GoalsData {
  primaryGoal: string;
  targetDistance: string;
  timeframe: string;
  currentActivity: string;
  targetRaceDate: string;
  weeklyDays: string;
}

export default function OnboardingGoalsScreen() {
  const router = useRouter();
  const [goalsData, setGoalsData] = useState<GoalsData>({
    primaryGoal: '',
    targetDistance: '',
    timeframe: '',
    currentActivity: '',
    targetRaceDate: '',
    weeklyDays: '',
  });

  const primaryGoals = [
    {
      id: 'complete-first-5k',
      title: 'Complete my first 5K',
      description: 'Build up to running 5K without stopping',
      icon: Target,
      color: '#22c55e',
    },
    {
      id: 'improve-time',
      title: 'Improve my race times',
      description: 'Get faster and beat personal records',
      icon: Trophy,
      color: '#3b82f6',
    },
    {
      id: 'longer-distances',
      title: 'Run longer distances',
      description: 'Build endurance for 10K, half marathon, or marathon',
      icon: TrendingUp,
      color: '#f59e0b',
    },
    {
      id: 'stay-healthy',
      title: 'Stay fit and healthy',
      description: 'Maintain fitness and enjoy regular running',
      icon: Calendar,
      color: '#8b5cf6',
    },
  ];

  const targetDistances = [
    { id: '5k', title: '5K', description: 'Great for beginners' },
    { id: '10k', title: '10K', description: 'Build endurance' },
    {
      id: 'half-marathon',
      title: 'Half Marathon',
      description: '21.1K challenge',
    },
    { id: 'marathon', title: 'Marathon', description: '42.2K ultimate goal' },
    {
      id: 'just-running',
      title: 'Just running',
      description: 'No specific distance',
    },
  ];

  const timeframes = [
    { id: '4-weeks', title: '4 weeks', description: 'Quick improvement' },
    { id: '8-weeks', title: '8 weeks', description: 'Balanced progress' },
    { id: '12-weeks', title: '12 weeks', description: 'Steady development' },
    { id: '16-weeks', title: '16+ weeks', description: 'Long-term training' },
  ];

  const currentActivityLevels = [
    {
      id: 'none',
      title: 'Not running regularly',
      description: 'Starting fresh',
    },
    {
      id: '1-2-times',
      title: '1-2 times per week',
      description: 'Some experience',
    },
    {
      id: '3-4-times',
      title: '3-4 times per week',
      description: 'Regular runner',
    },
    { id: '5-plus', title: '5+ times per week', description: 'Very active' },
  ];

  const weeklyDaysOptions = [
    { id: '2-days', title: '2 days', description: 'Light commitment' },
    { id: '3-days', title: '3 days', description: 'Balanced schedule' },
    { id: '4-days', title: '4 days', description: 'Regular training' },
    { id: '5-days', title: '5 days', description: 'Serious commitment' },
    { id: '6-plus', title: '6+ days', description: 'Elite level' },
  ];

  const isFormValid = () => {
    return (
      goalsData.primaryGoal &&
      goalsData.targetDistance &&
      goalsData.timeframe &&
      goalsData.currentActivity &&
      goalsData.weeklyDays
    );
  };

  const handleContinue = () => {
    if (!isFormValid()) {
      Alert.alert(
        'Incomplete Form',
        'Please answer all questions to continue.',
      );
      return;
    }

    router.push('/onboarding/connect-strava' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const renderOptionGroup = (
    title: string,
    subtitle: string,
    options: any[],
    selectedValue: string,
    onSelect: (value: string) => void,
    showIcon = false,
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{title}</Text>
      {subtitle && <Text style={styles.labelSubtitle}>{subtitle}</Text>}

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option.id;
          const IconComponent = option.icon;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && {
                  backgroundColor: (option.color || '#22c55e') + '20',
                  borderColor: option.color || '#22c55e',
                },
              ]}
              onPress={() => onSelect(option.id)}
            >
              {showIcon && IconComponent && (
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: (option.color || '#22c55e') + '20' },
                  ]}
                >
                  <IconComponent
                    size={20}
                    color={isSelected ? option.color : 'rgba(255,255,255,0.8)'}
                  />
                </View>
              )}
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && { color: option.color || '#22c55e' },
                  ]}
                >
                  {option.title}
                </Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <View
                    style={[
                      styles.selectedDot,
                      { backgroundColor: option.color || '#22c55e' },
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
                <Target size={28} color="#fff" />
              </View>
              <Text style={styles.title}>Set your goals</Text>
              <Text style={styles.subtitle}>
                Help us create the perfect training plan for your aspirations
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            {renderOptionGroup(
              "What's your main running goal?",
              'Choose your primary objective for the training plan',
              primaryGoals,
              goalsData.primaryGoal,
              (value) => setGoalsData({ ...goalsData, primaryGoal: value }),
              true,
            )}

            {renderOptionGroup(
              'What distance are you targeting?',
              'Select your target race distance or running goal',
              targetDistances,
              goalsData.targetDistance,
              (value) => setGoalsData({ ...goalsData, targetDistance: value }),
            )}

            {renderOptionGroup(
              "What's your timeframe?",
              'How long do you want to work towards your goal?',
              timeframes,
              goalsData.timeframe,
              (value) => setGoalsData({ ...goalsData, timeframe: value }),
            )}

            {renderOptionGroup(
              'How often do you currently run?',
              'Select your current running frequency',
              currentActivityLevels,
              goalsData.currentActivity,
              (value) => setGoalsData({ ...goalsData, currentActivity: value }),
            )}

            {renderOptionGroup(
              'How many days per week can you train?',
              'Be realistic about your time commitment',
              weeklyDaysOptions,
              goalsData.weeklyDays,
              (value) => setGoalsData({ ...goalsData, weeklyDays: value }),
            )}

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <MapPin size={16} color="#22c55e" />
                <Text style={styles.summaryTitle}>Your Goal Summary</Text>
              </View>
              <Text style={styles.summaryText}>
                Based on your selections, we&apos;ll create a personalized
                training plan to help you achieve your running goals within your
                desired timeframe.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '37.5%' }]} />
              </View>
              <Text style={styles.progressText}>Step 3 of 8</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                isFormValid() && styles.continueButtonActive,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid()}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  isFormValid() && styles.continueButtonTextActive,
                ]}
              >
                Continue
              </Text>
              <ArrowRight
                size={20}
                color={isFormValid() ? '#fff' : 'rgba(255,255,255,0.5)'}
              />
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
  formGroup: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  labelSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  continueButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  continueButtonTextActive: {
    color: '#fff',
  },
});
