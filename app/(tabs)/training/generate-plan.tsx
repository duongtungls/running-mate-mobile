import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Brain,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  User,
  Zap,
  CheckCircle,
  Play,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import GradientBackground from '../../../components/GradientBackground';
import { useI18n } from '@/hooks/useI18n';

export default function GeneratePlanScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    currentFitness: '',
    experience: '',
    timeAvailable: '',
    preferredDays: '',
    targetDistance: '',
    targetTime: '',
  });

  const goals = [
    { id: '5k', label: '5K Race', icon: Target },
    { id: '10k', label: '10K Race', icon: Target },
    { id: 'half', label: 'Half Marathon', icon: Target },
    { id: 'marathon', label: 'Marathon', icon: Target },
    { id: 'improve', label: 'Improve Speed', icon: TrendingUp },
    { id: 'endurance', label: 'Build Endurance', icon: TrendingUp },
    { id: 'weight', label: 'Weight Loss', icon: TrendingUp },
    { id: 'general', label: 'General Fitness', icon: TrendingUp },
  ];

  const fitnessLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to running' },
    {
      id: 'intermediate',
      label: 'Intermediate',
      description: 'Some running experience',
    },
    { id: 'advanced', label: 'Advanced', description: 'Regular runner' },
    { id: 'expert', label: 'Expert', description: 'Competitive runner' },
  ];

  const handleGeneratePlan = () => {
    if (!formData.goal || !formData.currentFitness) {
      Alert.alert(
        'Missing Information',
        'Please fill in your goal and current fitness level.',
      );
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 3000);
  };

  const handleStartPlan = () => {
    router.push('/training/program');
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const SelectionCard = ({
    title,
    options,
    selected,
    onSelect,
    icon: Icon,
  }) => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <Icon size={20} color="#10b981" />
        <Text style={styles.selectionTitle}>{title}</Text>
      </View>
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selected === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option.id && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
            {option.description && (
              <Text
                style={[
                  styles.optionDescription,
                  selected === option.id && styles.selectedOptionDescription,
                ]}
              >
                {option.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (planGenerated) {
    return (
      <GradientBackground>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPlanGenerated(false)}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Your AI Training Plan</Text>
            <Text style={styles.subtitle}>Personalized for your goals</Text>
          </View>

          <View style={styles.successCard}>
            <CheckCircle size={48} color="#10b981" />
            <Text style={styles.successTitle}>
              Plan Generated Successfully!
            </Text>
            <Text style={styles.successSubtitle}>
              Your personalized training plan is ready to start
            </Text>
          </View>

          <View style={styles.planPreview}>
            <Text style={styles.previewTitle}>Plan Overview</Text>

            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Brain size={24} color="#10b981" />
                <Text style={styles.previewCardTitle}>5K Improvement Plan</Text>
              </View>
              <View style={styles.previewDetails}>
                <View style={styles.previewItem}>
                  <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.previewText}>8 weeks</Text>
                </View>
                <View style={styles.previewItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.previewText}>4 workouts/week</Text>
                </View>
                <View style={styles.previewItem}>
                  <Target size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.previewText}>Target: 25min 5K</Text>
                </View>
              </View>
            </View>

            <View style={styles.previewCard}>
              <Text style={styles.previewCardTitle}>Weekly Structure</Text>
              <View style={styles.weekStructure}>
                <View style={styles.dayItem}>
                  <Text style={styles.dayLabel}>Mon</Text>
                  <Text style={styles.dayWorkout}>Easy Run</Text>
                </View>
                <View style={styles.dayItem}>
                  <Text style={styles.dayLabel}>Wed</Text>
                  <Text style={styles.dayWorkout}>Intervals</Text>
                </View>
                <View style={styles.dayItem}>
                  <Text style={styles.dayLabel}>Fri</Text>
                  <Text style={styles.dayWorkout}>Long Run</Text>
                </View>
                <View style={styles.dayItem}>
                  <Text style={styles.dayLabel}>Sun</Text>
                  <Text style={styles.dayWorkout}>Recovery</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPlan}
          >
            <Play size={20} color="#fff" />
            <Text style={styles.startButtonText}>Start Training Plan</Text>
          </TouchableOpacity>
        </ScrollView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>AI Training Plan</Text>
          <Text style={styles.subtitle}>
            Let AI create your personalized plan
          </Text>
        </View>

        <View style={styles.content}>
          <SelectionCard
            title="What's your main goal?"
            options={goals}
            selected={formData.goal}
            onSelect={(goal) => setFormData({ ...formData, goal })}
            icon={Target}
          />

          <SelectionCard
            title="Current fitness level"
            options={fitnessLevels}
            selected={formData.currentFitness}
            onSelect={(level) =>
              setFormData({ ...formData, currentFitness: level })
            }
            icon={User}
          />

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Additional Details</Text>

            <InputField
              label="Running Experience"
              value={formData.experience}
              onChangeText={(text) =>
                setFormData({ ...formData, experience: text })
              }
              placeholder="How long have you been running?"
            />

            <InputField
              label="Time Available"
              value={formData.timeAvailable}
              onChangeText={(text) =>
                setFormData({ ...formData, timeAvailable: text })
              }
              placeholder="How much time can you dedicate per week?"
            />

            <InputField
              label="Preferred Training Days"
              value={formData.preferredDays}
              onChangeText={(text) =>
                setFormData({ ...formData, preferredDays: text })
              }
              placeholder="e.g., Monday, Wednesday, Friday"
            />

            <InputField
              label="Target Distance/Time"
              value={formData.targetDistance}
              onChangeText={(text) =>
                setFormData({ ...formData, targetDistance: text })
              }
              placeholder="e.g., 25min 5K, 2hr half marathon"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              isGenerating && styles.generateButtonDisabled,
            ]}
            onPress={handleGeneratePlan}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Brain size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Generate AI Plan</Text>
              </>
            )}
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  selectionContainer: {
    marginBottom: 30,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: '48%',
  },
  selectedOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  optionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#10b981',
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectedOptionDescription: {
    color: 'rgba(16, 185, 129, 0.8)',
  },
  inputSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: 'rgba(16, 185, 129, 0.5)',
  },
  generateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  successCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#10b981',
    marginTop: 15,
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  planPreview: {
    padding: 20,
  },
  previewTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  previewDetails: {
    gap: 10,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weekStructure: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  dayWorkout: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
