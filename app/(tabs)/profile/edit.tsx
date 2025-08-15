import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Save,
  Camera,
  User,
  MapPin,
  Calendar,
  Scale,
  Ruler,
  Target,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useI18n } from '../../../hooks/useI18n';
import GradientBackground from '../../../components/GradientBackground';
import { useProfile } from '../../../contexts/ProfileContext';
import { ProfileUpdateData } from '../../../types/profile';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { profile, updateProfile, uploadAvatar, profileLoading } = useProfile();

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    birth_date: '',
    gender: 'other' as 'male' | 'female' | 'other',
    height: '',
    weight: '',
    activity_level: 'moderately_active' as any,
    running_experience: 'intermediate' as any,
    preferred_units: 'metric' as 'metric' | 'imperial',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || 'other',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        activity_level: profile.activity_level || 'moderately_active',
        running_experience: profile.running_experience || 'intermediate',
        preferred_units: profile.preferred_units || 'metric',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (
      formData.height &&
      (isNaN(Number(formData.height)) ||
        Number(formData.height) < 50 ||
        Number(formData.height) > 300)
    ) {
      newErrors.height = 'Height must be between 50-300 cm';
    }

    if (
      formData.weight &&
      (isNaN(Number(formData.weight)) ||
        Number(formData.weight) < 20 ||
        Number(formData.weight) > 300)
    ) {
      newErrors.weight = 'Weight must be between 20-300 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData: ProfileUpdateData = {
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        birth_date: formData.birth_date || undefined,
        gender: formData.gender,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        activity_level: formData.activity_level,
        running_experience: formData.running_experience,
        preferred_units: formData.preferred_units,
      };

      const { success, error } = await updateProfile(updateData);

      if (success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', error?.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'We need camera roll permissions to upload your profile picture.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const asset = result.assets[0];
        const { success, error } = await uploadAvatar({
          uri: asset.uri,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });

        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully!');
        } else {
          Alert.alert('Error', error?.message || 'Failed to upload image');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Save size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
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
              style={styles.cameraButton}
              onPress={handleImagePicker}
              disabled={loading}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(value) => handleInputChange('full_name', value)}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                editable={!loading}
              />
            </View>
            {errors.full_name && (
              <Text style={styles.errorText}>{errors.full_name}</Text>
            )}
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder="Tell us about yourself..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="City, Country"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                editable={!loading}
              />
            </View>
          </View>

          {/* Physical Stats */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Height (cm)</Text>
              <View style={styles.inputContainer}>
                <Ruler size={20} color="rgba(255, 255, 255, 0.6)" />
                <TextInput
                  style={styles.input}
                  value={formData.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  placeholder="170"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <View style={styles.inputContainer}>
                <Scale size={20} color="rgba(255, 255, 255, 0.6)" />
                <TextInput
                  style={styles.input}
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  placeholder="70"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.segmentedControl}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.segmentButton,
                    formData.gender === gender && styles.segmentButtonActive,
                  ]}
                  onPress={() => handleInputChange('gender', gender)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      formData.gender === gender && styles.segmentTextActive,
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Activity Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.pickerContainer}>
              {[
                'sedentary',
                'lightly_active',
                'moderately_active',
                'very_active',
                'super_active',
              ].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.pickerOption,
                    formData.activity_level === level &&
                      styles.pickerOptionActive,
                  ]}
                  onPress={() => handleInputChange('activity_level', level)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      formData.activity_level === level &&
                        styles.pickerTextActive,
                    ]}
                  >
                    {level
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Running Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Running Experience</Text>
            <View style={styles.segmentedControl}>
              {['beginner', 'intermediate', 'advanced', 'professional'].map(
                (level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.segmentButton,
                      formData.running_experience === level &&
                        styles.segmentButtonActive,
                    ]}
                    onPress={() =>
                      handleInputChange('running_experience', level)
                    }
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        formData.running_experience === level &&
                          styles.segmentTextActive,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          {/* Units Preference */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Units</Text>
            <View style={styles.segmentedControl}>
              {['metric', 'imperial'].map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.segmentButton,
                    formData.preferred_units === unit &&
                      styles.segmentButtonActive,
                  ]}
                  onPress={() => handleInputChange('preferred_units', unit)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      formData.preferred_units === unit &&
                        styles.segmentTextActive,
                    ]}
                  >
                    {unit === 'metric'
                      ? 'Metric (km, kg)'
                      : 'Imperial (mi, lbs)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textAreaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
  },
  textArea: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  segmentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  segmentTextActive: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pickerTextActive: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});
