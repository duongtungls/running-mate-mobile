import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  ArrowLeft,
  Link,
  Zap,
  Activity,
  Trophy,
  TrendingUp,
  CheckCircle,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

export default function OnboardingConnectStravaScreen() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const benefits = [
    {
      icon: Activity,
      title: 'Automatic Activity Sync',
      description: 'Your runs and workouts sync automatically to RunningMate',
      color: '#ef4444',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Get deeper insights into your performance trends',
      color: '#3b82f6',
    },
    {
      icon: Trophy,
      title: 'Achievement Tracking',
      description: 'Track your personal records and celebrate milestones',
      color: '#f59e0b',
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Get personalized coaching tips based on your data',
      color: '#10b981',
    },
  ];

  const handleConnectStrava = async () => {
    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      Alert.alert(
        'Success!',
        'Your Strava account has been connected successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.push('/onboarding/preferences' as any),
          },
        ],
      );
    }, 2000);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Strava Connection?',
      'You can always connect your Strava account later in settings. Continue without connecting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => router.push('/onboarding/preferences' as any),
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Link size={28} color="#fff" />
              </View>
              <Text style={styles.title}>Connect with Strava</Text>
              <Text style={styles.subtitle}>
                Sync your activities and unlock advanced features
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.stravaCard}>
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.svg',
                }}
                style={styles.stravaLogo}
                resizeMode="contain"
              />
              <Text style={styles.stravaText}>
                Connect your Strava account to automatically sync your
                activities and get personalized insights.
              </Text>
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>What you&apos;ll get:</Text>

              <View style={styles.benefitsList}>
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;

                  return (
                    <View key={index} style={styles.benefitCard}>
                      <View
                        style={[
                          styles.benefitIcon,
                          { backgroundColor: benefit.color + '20' },
                        ]}
                      >
                        <IconComponent size={20} color={benefit.color} />
                      </View>
                      <View style={styles.benefitContent}>
                        <Text style={styles.benefitTitle}>{benefit.title}</Text>
                        <Text style={styles.benefitDescription}>
                          {benefit.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.privacySection}>
              <View style={styles.privacyHeader}>
                <CheckCircle size={16} color="#10b981" />
                <Text style={styles.privacyTitle}>
                  Your Privacy is Protected
                </Text>
              </View>
              <Text style={styles.privacyText}>
                • We only access your activity data to provide training insights
                {'\n'}• Your personal information is never shared with third
                parties{'\n'}• You can disconnect at any time in your settings
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
              <Text style={styles.progressText}>Step 4 of 8</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.connectButton,
                isConnecting && styles.connectingButton,
                isConnected && styles.connectedButton,
              ]}
              onPress={handleConnectStrava}
              disabled={isConnecting || isConnected}
            >
              {isConnected ? (
                <>
                  <CheckCircle size={20} color="#fff" />
                  <Text style={styles.connectButtonText}>
                    Connected to Strava
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.connectButtonText}>
                    {isConnecting ? 'Connecting...' : 'Connect with Strava'}
                  </Text>
                  {!isConnecting && <ArrowRight size={20} color="#fff" />}
                </>
              )}
            </TouchableOpacity>

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
  stravaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stravaLogo: {
    width: 120,
    height: 40,
    marginBottom: 16,
    tintColor: '#fc4c02',
  },
  stravaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  privacySection: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#10b981',
    marginLeft: 8,
  },
  privacyText: {
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
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fc4c02',
    borderRadius: 16,
    height: 56,
    marginBottom: 16,
    gap: 8,
  },
  connectingButton: {
    backgroundColor: 'rgba(252, 76, 2, 0.7)',
  },
  connectedButton: {
    backgroundColor: '#10b981',
  },
  connectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
