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
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    {
      id: 'first-5k',
      title: 'Run my first 5K',
      description: 'Perfect for beginners starting their running journey',
      icon: Target,
      color: '#22c55e',
    },
    {
      id: 'improve-time',
      title: 'Improve my time',
      description: 'Get faster and beat your personal records',
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      id: 'half-marathon',
      title: 'Train for half marathon',
      description: 'Build endurance for longer distance races',
      icon: Activity,
      color: '#f59e0b',
    },
    {
      id: 'stay-fit',
      title: 'Stay fit & healthy',
      description: 'Maintain fitness with regular running routine',
      icon: User,
      color: '#8b5cf6',
    },
  ];

  const handleContinue = () => {
    // Pass selected goal to next screen or store in context
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
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Zap size={32} color="#fff" />
            </View>
            <Text style={styles.title}>Welcome to RunningMate</Text>
            <Text style={styles.subtitle}>
              Let&apos;s create a personalized training plan that fits your
              goals and lifestyle
            </Text>
          </View>

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
                Personalized training plans powered by artificial intelligence
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>What&apos;s your main goal?</Text>
            <Text style={styles.sectionSubtitle}>
              Choose what you&apos;d like to achieve first. You can always
              change this later.
            </Text>

            <View style={styles.goalsContainer}>
              {goals.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = selectedGoal === goal.id;

                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      isSelected && {
                        backgroundColor: goal.color + '20',
                        borderColor: goal.color,
                      },
                    ]}
                    onPress={() => setSelectedGoal(goal.id)}
                  >
                    <View
                      style={[
                        styles.goalIcon,
                        { backgroundColor: goal.color + '20' },
                      ]}
                    >
                      <IconComponent
                        size={24}
                        color={
                          isSelected ? goal.color : 'rgba(255,255,255,0.8)'
                        }
                      />
                    </View>
                    <View style={styles.goalContent}>
                      <Text
                        style={[
                          styles.goalTitle,
                          isSelected && { color: goal.color },
                        ]}
                      >
                        {goal.title}
                      </Text>
                      <Text style={styles.goalDescription}>
                        {goal.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <View
                          style={[
                            styles.selectedDot,
                            { backgroundColor: goal.color },
                          ]}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.features}>
              <Text style={styles.featuresTitle}>What you&apos;ll get:</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    AI-powered training plans
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Real-time progress tracking
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Personalized insights & tips
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>Community support</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '12.5%' }]} />
              </View>
              <Text style={styles.progressText}>Step 1 of 8</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedGoal && styles.continueButtonActive,
              ]}
              onPress={handleContinue}
              disabled={!selectedGoal}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedGoal && styles.continueButtonTextActive,
                ]}
              >
                Continue
              </Text>
              <ArrowRight
                size={20}
                color={selectedGoal ? '#fff' : 'rgba(255,255,255,0.5)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push('/onboarding/profile' as any)}
            >
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  heroImage: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 30,
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
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
    marginBottom: 32,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  goalDescription: {
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
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  featuresTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 12,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    marginBottom: 16,
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
