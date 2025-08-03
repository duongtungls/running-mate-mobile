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
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  Activity,
  Weight,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

interface ProfileData {
  firstName: string;
  lastName: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

export default function OnboardingProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
  });

  const activityLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to running or just starting out',
      color: '#22c55e',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Regular runner with some experience',
      color: '#3b82f6',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Experienced runner or athlete',
      color: '#f59e0b',
    },
  ];

  const isFormValid = () => {
    return (
      profileData.firstName.trim() &&
      profileData.lastName.trim() &&
      profileData.age.trim() &&
      profileData.weight.trim() &&
      profileData.height.trim() &&
      profileData.activityLevel
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

    // Validate weight
    const weight = parseFloat(profileData.weight);
    if (isNaN(weight) || weight < 30 || weight > 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kg.');
      return;
    }

    // Validate height
    const height = parseFloat(profileData.height);
    if (isNaN(height) || height < 100 || height > 250) {
      Alert.alert('Invalid Height', 'Please enter a valid height in cm.');
      return;
    }

    router.push('/onboarding/goals' as any);
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
                <User size={28} color="#fff" />
              </View>
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                This helps us create a personalized training plan just for you
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Personal Information</Text>

              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.firstName}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, firstName: text })
                    }
                    placeholder="Enter first name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </View>

                <View style={styles.nameInput}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.lastName}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, lastName: text })
                    }
                    placeholder="Enter last name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Physical Details</Text>

              <View style={styles.inputGroup}>
                <Calendar size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.age}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, age: text })
                    }
                    placeholder="Enter your age"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Weight size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.weight}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, weight: text })
                    }
                    placeholder="Enter your weight"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Activity size={20} color="rgba(255, 255, 255, 0.8)" />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.height}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, height: text })
                    }
                    placeholder="Enter your height"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Running Experience</Text>
              <Text style={styles.labelSubtitle}>
                Choose the level that best describes your current running
                experience
              </Text>

              <View style={styles.activityLevelsContainer}>
                {activityLevels.map((level) => {
                  const isSelected = profileData.activityLevel === level.id;

                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.activityCard,
                        isSelected && {
                          backgroundColor: level.color + '20',
                          borderColor: level.color,
                        },
                      ]}
                      onPress={() =>
                        setProfileData({
                          ...profileData,
                          activityLevel: level.id as any,
                        })
                      }
                    >
                      <View style={styles.activityCardContent}>
                        <Text
                          style={[
                            styles.activityTitle,
                            isSelected && { color: level.color },
                          ]}
                        >
                          {level.title}
                        </Text>
                        <Text style={styles.activityDescription}>
                          {level.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedIndicator}>
                          <View
                            style={[
                              styles.selectedDot,
                              { backgroundColor: level.color },
                            ]}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '25%' }]} />
              </View>
              <Text style={styles.progressText}>Step 2 of 8</Text>
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
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
  activityLevelsContainer: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityCardContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  activityDescription: {
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
