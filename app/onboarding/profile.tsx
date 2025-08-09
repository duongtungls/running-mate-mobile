import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Calendar,
  Activity,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingHeader from '../../components/OnboardingHeader';
import SelectionCard from '../../components/SelectionCard';

interface ProfileData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  location: string;
  experience: string;
  weeklyMileage: string;
  distanceUnit: 'miles' | 'kilometers';
  injuries: string[];
}

const experienceLevels = [
  {
    id: 'beginner',
    title: 'Beginner (0-6 months)',
    description: 'New to running or getting back into it',
    color: '#22c55e',
  },
  {
    id: 'intermediate',
    title: 'Intermediate (6 months - 2 years)',
    description: 'Regular runner with some experience',
    color: '#3b82f6',
  },
  {
    id: 'advanced',
    title: 'Advanced (2+ years)',
    description: 'Experienced runner with consistent training',
    color: '#f59e0b',
  },
  {
    id: 'elite',
    title: 'Elite/Competitive',
    description: 'Competitive runner or coach',
    color: '#ef4444',
  },
];

const weeklyMileageOptions = {
  miles: [
    { id: '0-5', title: '0-5 miles per week' },
    { id: '5-15', title: '5-15 miles per week' },
    { id: '15-25', title: '15-25 miles per week' },
    { id: '25-40', title: '25-40 miles per week' },
    { id: '40+', title: '40+ miles per week' },
  ],
  kilometers: [
    { id: '0-8', title: '0-8 km per week' },
    { id: '8-24', title: '8-24 km per week' },
    { id: '24-40', title: '24-40 km per week' },
    { id: '40-64', title: '40-64 km per week' },
    { id: '64+', title: '64+ km per week' },
  ],
};

const commonInjuries = [
  'Plantar Fasciitis',
  'Shin Splints',
  'IT Band Syndrome',
  "Runner's Knee",
  'Achilles Tendinitis',
  'Hip Flexor Strain',
  'Calf Strain',
  'Lower Back Pain',
];

export default function OnboardingProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    location: '',
    experience: '',
    weeklyMileage: '',
    distanceUnit: 'kilometers',
    injuries: [],
  });

  const isFormValid = () => {
    return (
      profileData.firstName.trim() !== '' &&
      profileData.lastName.trim() !== '' &&
      profileData.age !== '' &&
      profileData.gender !== '' &&
      profileData.experience !== '' &&
      profileData.weeklyMileage !== ''
    );
  };

  const handleContinue = () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    // Validate age
    const age = parseInt(profileData.age);
    if (isNaN(age) || age < 13 || age > 100) {
      Alert.alert(
        'Invalid Age',
        'Please enter a valid age between 13 and 100.',
      );
      return;
    }

    router.push('/onboarding/goals' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => {
      // Reset weekly mileage when distance unit changes
      if (field === 'distanceUnit') {
        return {
          ...prev,
          [field]: value as 'miles' | 'kilometers',
          weeklyMileage: '',
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleInjuryToggle = (injury: string) => {
    setProfileData((prev) => ({
      ...prev,
      injuries: prev.injuries.includes(injury)
        ? prev.injuries.filter((i) => i !== injury)
        : [...prev.injuries, injury],
    }));
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
            title="Tell Us About Yourself"
            subtitle="Help us personalize your running experience with some basic information."
            icon={<User size={28} color="#fff" />}
            onBack={handleBack}
          />

          <View style={styles.content}>
            {/* Basic Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <User size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>Basic Information</Text>
              </View>

              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <Text style={styles.inputLabel}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.firstName}
                    onChangeText={(text) =>
                      handleInputChange('firstName', text)
                    }
                    placeholder="John"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </View>

                <View style={styles.nameInput}>
                  <Text style={styles.inputLabel}>Last Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                    placeholder="Doe"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Calendar size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.age}
                    onChangeText={(text) => handleInputChange('age', text)}
                    placeholder="25"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <User size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Gender *</Text>
                  <View style={styles.genderOptions}>
                    {['male', 'female', 'non-binary', 'prefer-not-to-say'].map(
                      (gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.genderOption,
                            profileData.gender === gender &&
                              styles.genderOptionSelected,
                          ]}
                          onPress={() => handleInputChange('gender', gender)}
                        >
                          <Text
                            style={[
                              styles.genderOptionText,
                              profileData.gender === gender &&
                                styles.genderOptionTextSelected,
                            ]}
                          >
                            {gender.charAt(0).toUpperCase() +
                              gender.slice(1).replace('-', ' ')}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <MapPin size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Location (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                    placeholder="City, State/Country"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              </View>
            </View>

            {/* Running Experience */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Activity size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>Running Experience</Text>
              </View>

              <Text style={styles.sectionSubtitle}>
                Choose the level that best describes your current running
                experience
              </Text>

              <View style={styles.experienceContainer}>
                {experienceLevels.map((level) => (
                  <SelectionCard
                    key={level.id}
                    title={level.title}
                    description={level.description}
                    isSelected={profileData.experience === level.id}
                    onPress={() => handleInputChange('experience', level.id)}
                    color={level.color}
                  />
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Activity size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Distance Unit *</Text>
                  <View style={styles.unitOptions}>
                    {[
                      { id: 'miles', title: 'Miles' },
                      { id: 'kilometers', title: 'Kilometers' },
                    ].map((unit) => (
                      <TouchableOpacity
                        key={unit.id}
                        style={[
                          styles.unitOption,
                          profileData.distanceUnit === unit.id &&
                            styles.unitOptionSelected,
                        ]}
                        onPress={() =>
                          handleInputChange('distanceUnit', unit.id)
                        }
                      >
                        <Text
                          style={[
                            styles.unitOptionText,
                            profileData.distanceUnit === unit.id &&
                              styles.unitOptionTextSelected,
                          ]}
                        >
                          {unit.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Activity size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>
                    Current Weekly Distance *
                  </Text>
                  <View style={styles.mileageOptions}>
                    {weeklyMileageOptions[profileData.distanceUnit].map(
                      (option) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.mileageOption,
                            profileData.weeklyMileage === option.id &&
                              styles.mileageOptionSelected,
                          ]}
                          onPress={() =>
                            handleInputChange('weeklyMileage', option.id)
                          }
                        >
                          <Text
                            style={[
                              styles.mileageOptionText,
                              profileData.weeklyMileage === option.id &&
                                styles.mileageOptionTextSelected,
                            ]}
                          >
                            {option.title}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Injury History */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.sectionTitle}>
                  Injury History (Optional)
                </Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Select any current or recent injuries to help us create a safer
                training plan.
              </Text>

              <View style={styles.injuriesContainer}>
                {commonInjuries.map((injury) => (
                  <TouchableOpacity
                    key={injury}
                    style={[
                      styles.injuryOption,
                      profileData.injuries.includes(injury) &&
                        styles.injuryOptionSelected,
                    ]}
                    onPress={() => handleInjuryToggle(injury)}
                  >
                    <View style={styles.injuryCheckbox}>
                      {profileData.injuries.includes(injury) && (
                        <CheckCircle size={16} color="#22c55e" />
                      )}
                    </View>
                    <Text style={styles.injuryText}>{injury}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Profile Summary */}
            {profileData.firstName &&
              profileData.lastName &&
              profileData.experience && (
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <CheckCircle size={16} color="#22c55e" />
                    <Text style={styles.summaryTitle}>Profile Summary</Text>
                  </View>
                  <View style={styles.summaryContent}>
                    <Text style={styles.summaryText}>
                      <Text style={styles.summaryLabel}>Name:</Text>{' '}
                      {profileData.firstName} {profileData.lastName}
                      {profileData.age && `, ${profileData.age} years old`}
                    </Text>
                    <Text style={styles.summaryText}>
                      <Text style={styles.summaryLabel}>Experience:</Text>{' '}
                      {
                        experienceLevels.find(
                          (e) => e.id === profileData.experience,
                        )?.title
                      }
                    </Text>
                    {profileData.weeklyMileage && (
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>
                          Current Distance:
                        </Text>{' '}
                        {
                          weeklyMileageOptions[profileData.distanceUnit].find(
                            (m) => m.id === profileData.weeklyMileage,
                          )?.title
                        }
                      </Text>
                    )}
                    {profileData.location && (
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>Location:</Text>{' '}
                        {profileData.location}
                      </Text>
                    )}
                    {profileData.injuries.length > 0 && (
                      <Text style={styles.summaryText}>
                        <Text style={styles.summaryLabel}>
                          Injuries to consider:
                        </Text>{' '}
                        {profileData.injuries.join(', ')}
                      </Text>
                    )}
                  </View>
                </View>
              )}
          </View>

          <View style={styles.footer}>
            <OnboardingProgress currentStep={2} totalSteps={8} />

            <OnboardingButton
              title="Continue to Goals"
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderOptionSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  genderOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  experienceContainer: {
    gap: 12,
    marginBottom: 16,
  },
  unitOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  unitOption: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  unitOptionSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  unitOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  unitOptionTextSelected: {
    color: '#fff',
  },
  mileageOptions: {
    gap: 8,
  },
  mileageOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mileageOptionSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  mileageOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mileageOptionTextSelected: {
    color: '#fff',
  },
  injuriesContainer: {
    gap: 8,
  },
  injuryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  injuryOptionSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  injuryCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  injuryText: {
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
