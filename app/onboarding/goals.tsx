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
import { Target, Calendar, Clock, CheckCircle } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingHeader from '../../components/OnboardingHeader';
import SelectionCard from '../../components/SelectionCard';

interface GoalsData {
  primaryGoal: string;
  targetDate: string;
  weeklyAvailability: string;
  preferredTimes: string[];
}

const goalOptions = [
  {
    id: 'general-fitness',
    title: 'General Fitness',
    description: 'Stay healthy and maintain regular running routine',
    color: '#22c55e',
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Burn calories and improve overall fitness',
    color: '#3b82f6',
  },
  {
    id: '5k',
    title: '5K Training',
    description: 'Build up to running 5K without stopping',
    color: '#f59e0b',
  },
  {
    id: '10k',
    title: '10K Training',
    description: 'Build endurance for longer distances',
    color: '#8b5cf6',
  },
  {
    id: 'half-marathon',
    title: 'Half Marathon',
    description: 'Train for 21.1K challenge',
    color: '#ef4444',
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: 'Ultimate 42.2K goal',
    color: '#06b6d4',
  },
  {
    id: 'ultra',
    title: 'Ultra Running',
    description: 'Go beyond marathon distances',
    color: '#7c3aed',
  },
];

const timePreferences = [
  'Early Morning (5-7 AM)',
  'Morning (7-9 AM)',
  'Late Morning (9-11 AM)',
  'Afternoon (12-3 PM)',
  'Late Afternoon (3-5 PM)',
  'Evening (5-7 PM)',
  'Night (7-9 PM)',
];

export default function OnboardingGoalsScreen() {
  const router = useRouter();
  const [goalsData, setGoalsData] = useState<GoalsData>({
    primaryGoal: '',
    targetDate: '',
    weeklyAvailability: '',
    preferredTimes: [],
  });

  const isFormValid = () => {
    return (
      goalsData.primaryGoal !== '' &&
      goalsData.weeklyAvailability !== '' &&
      goalsData.preferredTimes.length > 0
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

  const handleInputChange = (field: keyof GoalsData, value: string) => {
    setGoalsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeToggle = (time: string) => {
    setGoalsData((prev) => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter((t) => t !== time)
        : [...prev.preferredTimes, time],
    }));
  };

  const selectedGoal = goalOptions.find((g) => g.id === goalsData.primaryGoal);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <GradientBackground>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <OnboardingHeader
            title="Set Your Goals"
            subtitle="Help us create the perfect training plan for your aspirations"
            icon={<Target size={28} color="#fff" />}
            onBack={handleBack}
          />

          <View style={styles.content}>
            {/* Primary Goal */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>
                  What's your main running goal? *
                </Text>
              </View>

              <View style={styles.goalsContainer}>
                {goalOptions.map((goal) => (
                  <SelectionCard
                    key={goal.id}
                    title={goal.title}
                    description={goal.description}
                    isSelected={goalsData.primaryGoal === goal.id}
                    onPress={() => handleInputChange('primaryGoal', goal.id)}
                    color={goal.color}
                  />
                ))}
              </View>
            </View>

            {/* Target Date */}
            {goalsData.primaryGoal &&
              !['general-fitness', 'weight-loss'].includes(
                goalsData.primaryGoal,
              ) && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Calendar size={20} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.sectionTitle}>Target Date</Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    When do you want to achieve your{' '}
                    {selectedGoal?.title.toLowerCase()} goal?
                  </Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      // In a real app, you'd open a date picker here
                      Alert.alert('Date Picker', 'Date picker would open here');
                    }}
                  >
                    <Text style={styles.dateInputText}>
                      {goalsData.targetDate || 'Select target date'}
                    </Text>
                    <Calendar size={20} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
                </View>
              )}

            {/* Weekly Availability */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>
                  How many days per week can you train? *
                </Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Be realistic about your time commitment. Consistency is more
                important than intensity.
              </Text>

              <View style={styles.availabilityContainer}>
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.availabilityOption,
                      goalsData.weeklyAvailability === days.toString() &&
                        styles.availabilityOptionSelected,
                    ]}
                    onPress={() =>
                      handleInputChange('weeklyAvailability', days.toString())
                    }
                  >
                    <Text
                      style={[
                        styles.availabilityOptionText,
                        goalsData.weeklyAvailability === days.toString() &&
                          styles.availabilityOptionTextSelected,
                      ]}
                    >
                      {days} {days === 1 ? 'day' : 'days'} per week
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time Preferences */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>
                  Preferred training times *
                </Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Select all times that work for your schedule. We'll create
                workouts around your availability.
              </Text>

              <View style={styles.timePreferencesContainer}>
                {timePreferences.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      goalsData.preferredTimes.includes(time) &&
                        styles.timeOptionSelected,
                    ]}
                    onPress={() => handleTimeToggle(time)}
                  >
                    <View style={styles.timeCheckbox}>
                      {goalsData.preferredTimes.includes(time) && (
                        <CheckCircle size={16} color="#22c55e" />
                      )}
                    </View>
                    <Text style={styles.timeOptionText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Summary */}
            {goalsData.primaryGoal &&
              goalsData.weeklyAvailability &&
              goalsData.preferredTimes.length > 0 && (
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <CheckCircle size={16} color="#22c55e" />
                    <Text style={styles.summaryTitle}>
                      Training Plan Preview
                    </Text>
                  </View>
                  <View style={styles.summaryContent}>
                    <Text style={styles.summaryText}>
                      <Text style={styles.summaryLabel}>Goal:</Text>{' '}
                      {selectedGoal?.title}
                      {goalsData.targetDate && ` by ${goalsData.targetDate}`}
                    </Text>
                    <Text style={styles.summaryText}>
                      <Text style={styles.summaryLabel}>Frequency:</Text>{' '}
                      {goalsData.weeklyAvailability}{' '}
                      {goalsData.weeklyAvailability === '1' ? 'day' : 'days'}{' '}
                      per week
                    </Text>
                    <Text style={styles.summaryText}>
                      <Text style={styles.summaryLabel}>Preferred Times:</Text>{' '}
                      {goalsData.preferredTimes.join(', ')}
                    </Text>
                  </View>
                </View>
              )}
          </View>

          <View style={styles.footer}>
            <OnboardingProgress currentStep={3} totalSteps={8} />

            <OnboardingButton
              title="Continue"
              onPress={handleContinue}
              disabled={!isFormValid()}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  goalsContainer: {
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateInputText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  availabilityContainer: {
    gap: 8,
  },
  availabilityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  availabilityOptionSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  availabilityOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  availabilityOptionTextSelected: {
    color: '#fff',
  },
  timePreferencesContainer: {
    gap: 8,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeOptionSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  timeCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
  summaryContent: {
    gap: 4,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  summaryLabel: {
    fontFamily: 'Inter-SemiBold',
    color: '#22c55e',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
});
