import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Play,
  Target,
  TrendingUp,
  User,
  Zap,
  Calendar,
  Settings,
  Activity,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useI18n } from '../../hooks/useI18n';

const { height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ComponentType<any>;  
  color: string;
  route?: string; // Reference to actual onboarding pages
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to RunningMate',
    subtitle: 'Your AI Running Coach',
    description:
      'Start your personalized running journey with AI-powered training plans and real-time insights.',
    image:
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&h=600&q=80',
    icon: Zap,
    color: '#22c55e',
    route: '/onboarding/welcome',
  },
  {
    id: 2,
    title: 'Set Up Your Profile',
    subtitle: 'Tell Us About Yourself',
    description:
      'Share your running experience, fitness level, and personal details to get customized recommendations.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=600&q=80',
    icon: User,
    color: '#3b82f6',
    route: '/onboarding/profile',
  },
  {
    id: 3,
    title: 'Define Your Goals',
    subtitle: 'What Do You Want to Achieve?',
    description:
      'Set your running goals, target distances, and timeline to create a personalized training plan.',
    image:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&h=600&q=80',
    icon: Target,
    color: '#f59e0b',
    route: '/onboarding/goals',
  },
  {
    id: 4,
    title: 'Connect with Strava',
    subtitle: 'Sync Your Activities',
    description:
      'Link your Strava account to automatically import your running history and track progress.',
    image:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=400&h=600&q=80',
    icon: Activity,
    color: '#ef4444',
    route: '/onboarding/connect-strava',
  },
  {
    id: 5,
    title: 'Choose Your Plan',
    subtitle: 'AI-Generated Training',
    description:
      'Get a personalized training plan based on your goals, experience, and available time.',
    image:
      'https://images.unsplash.com/photo-1594736797933-d0d32bf80863?auto=format&fit=crop&w=400&h=600&q=80',
    icon: Calendar,
    color: '#8b5cf6',
    route: '/onboarding/plan-selection',
  },
  {
    id: 6,
    title: 'Customize Preferences',
    subtitle: 'Make It Yours',
    description:
      'Set your notification preferences, training days, and other settings to optimize your experience.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=600&q=80',
    icon: Settings,
    color: '#10b981',
    route: '/onboarding/preferences',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleNext = () => {
    setAutoPlay(false);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/signup');
    }
  };

  const handleSkip = () => {
    setAutoPlay(false);
    router.push('/login');
  };

  const handleStartOnboarding = () => {
    setAutoPlay(false);
    // Navigate to the actual onboarding flow
    // For now, navigate to signup since mobile onboarding screens need to be created
    router.push('/signup');
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.skipContainer}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>{t('auth.welcome.skip')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.slideContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: currentSlideData.image }}
                style={styles.slideImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <View style={styles.iconContainer}>
                <IconComponent size={32} color="#fff" />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.indicatorContainer}>
                {slides.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentSlide && styles.activeIndicator,
                    ]}
                    onPress={() => {
                      setAutoPlay(false);
                      setCurrentSlide(index);
                    }}
                  />
                ))}
              </View>

              <Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
              <Text style={styles.title}>{currentSlideData.title}</Text>
              <Text style={styles.description}>
                {currentSlideData.description}
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${((currentSlide + 1) / slides.length) * 100}%`,
                        backgroundColor: currentSlideData.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {currentSlide + 1} of {slides.length}
                </Text>
              </View>

              {/* Onboarding Steps Preview */}
              <View style={styles.stepsPreview}>
                <Text style={styles.stepsTitle}>Complete Setup:</Text>
                <View style={styles.stepsList}>
                  {['Profile', 'Goals', 'Strava', 'Plan', 'Preferences'].map(
                    (step, index) => (
                      <View key={step} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepDot,
                            index <= currentSlide && styles.stepDotActive,
                            {
                              backgroundColor:
                                index <= currentSlide
                                  ? currentSlideData.color
                                  : 'rgba(255,255,255,0.3)',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.stepText,
                            index <= currentSlide && styles.stepTextActive,
                          ]}
                        >
                          {step}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setAutoPlay(!autoPlay)}
            >
              <Play size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.playButtonText}>
                {autoPlay ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1
                  ? t('auth.welcome.getStarted')
                  : t('common.next')}
              </Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[
                styles.startButton,
                { backgroundColor: currentSlideData.color + '40' },
              ]}
              onPress={handleStartOnboarding}
            >
              <TrendingUp size={20} color="#fff" />
              <Text style={styles.startButtonText}>
                {t('auth.welcome.getStarted')}
              </Text>
            </TouchableOpacity>

            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.signupButtonText}>
                  {t('auth.createAccount')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Text style={styles.loginButtonTextBold}>
                    {t('auth.signIn')}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  slideContainer: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.35,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 20,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: 100,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  stepsPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  stepsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  stepDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  stepTextActive: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    gap: 6,
  },
  playButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  bottomActions: {
    gap: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  authButtons: {
    gap: 12,
  },
  signupButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  loginButtonTextBold: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
});
