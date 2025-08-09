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
  Eye,
  MessageSquare,
  Lock,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingHeader from '../../components/OnboardingHeader';

export default function OnboardingConnectStravaScreen() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [viewPrivate, setViewPrivate] = useState(true);
  const [writeRecommendations, setWriteRecommendations] = useState(false);

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
          <OnboardingHeader
            title="Connect with Strava"
            subtitle="Sync your activities and unlock advanced features"
            icon={<Link size={28} color="#fff" />}
            onBack={handleBack}
          />

          <View style={styles.content}>
            {!isConnected && (
              <View style={styles.section}>
                {/* Strava Connection Card */}
                <View style={styles.stravaCard}>
                  <View style={styles.stravaHeader}>
                    <View style={styles.stravaLogoContainer}>
                      <Image
                        source={{
                          uri: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.svg',
                        }}
                        style={styles.stravaLogo}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.stravaHeaderContent}>
                      <Text style={styles.stravaTitle}>
                        Connect with Strava
                      </Text>
                      <Text style={styles.stravaSubtitle}>
                        Sync your activities and unlock advanced features
                      </Text>
                    </View>
                  </View>

                  {/* Benefits List */}
                  <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>What you'll get:</Text>
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
                              <Text style={styles.benefitTitle}>
                                {benefit.title}
                              </Text>
                              <Text style={styles.benefitDescription}>
                                {benefit.description}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Strava Permissions */}
                  <View style={styles.permissionsSection}>
                    <Text style={styles.permissionsTitle}>Permissions</Text>

                    <View style={styles.permissionItem}>
                      <TouchableOpacity
                        style={styles.permissionCheckbox}
                        onPress={() => setViewPrivate(!viewPrivate)}
                      >
                        {viewPrivate && (
                          <CheckCircle size={16} color="#fc4c02" />
                        )}
                      </TouchableOpacity>
                      <View style={styles.permissionContent}>
                        <View style={styles.permissionHeader}>
                          <Eye size={16} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.permissionName}>
                            View private activities
                          </Text>
                        </View>
                        <Text style={styles.permissionDescription}>
                          Access your private activities to provide better
                          training insights
                        </Text>
                      </View>
                    </View>

                    <View style={styles.permissionItem}>
                      <TouchableOpacity
                        style={styles.permissionCheckbox}
                        onPress={() =>
                          setWriteRecommendations(!writeRecommendations)
                        }
                      >
                        {writeRecommendations && (
                          <CheckCircle size={16} color="#fc4c02" />
                        )}
                      </TouchableOpacity>
                      <View style={styles.permissionContent}>
                        <View style={styles.permissionHeader}>
                          <MessageSquare
                            size={16}
                            color="rgba(255, 255, 255, 0.8)"
                          />
                          <Text style={styles.permissionName}>
                            Write recommendations
                          </Text>
                        </View>
                        <Text style={styles.permissionDescription}>
                          Share training recommendations and insights to your
                          Strava feed
                        </Text>
                        <Text style={styles.permissionNote}>
                          Note: You can control this in your Strava settings
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Connect Button */}
                  <OnboardingButton
                    title="Connect with Strava"
                    onPress={handleConnectStrava}
                    disabled={isConnecting}
                    variant="primary"
                    showArrow={true}
                    arrowDirection="right"
                    style={styles.connectButton}
                  />

                  {/* Security Notice */}
                  <View style={styles.securityNotice}>
                    <View style={styles.securityHeader}>
                      <Lock size={16} color="rgba(255, 255, 255, 0.7)" />
                      <Text style={styles.securityTitle}>
                        Your Privacy is Protected
                      </Text>
                    </View>
                    <Text style={styles.securityText}>
                      • We only access your activity data to provide training
                      insights{'\n'}• Your personal information is never shared
                      with third parties{'\n'}• You can disconnect at any time
                      in your settings
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Connected - Success State */}
            {isConnected && (
              <View style={styles.successSection}>
                <View style={styles.successIcon}>
                  <CheckCircle size={40} color="#fff" />
                </View>
                <Text style={styles.successTitle}>Connected to Strava!</Text>
                <Text style={styles.successSubtitle}>
                  Your Strava account has been successfully connected. We'll now
                  sync your activities and provide personalized insights.
                </Text>

                <View style={styles.successCards}>
                  <View style={styles.successCard}>
                    <Text style={styles.successCardTitle}>
                      Connection Established
                    </Text>
                    <Text style={styles.successCardText}>
                      Your activities will now automatically sync to RunningMate
                    </Text>
                  </View>

                  <View style={styles.successCard}>
                    <Text style={styles.successCardTitle}>What's Next</Text>
                    <Text style={styles.successCardText}>
                      Complete your setup and start your personalized training
                      plan
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <OnboardingProgress currentStep={4} totalSteps={8} />

            {!isConnected && (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            )}
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
  stravaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stravaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stravaLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(252, 76, 2, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stravaLogo: {
    width: 32,
    height: 32,
    tintColor: '#fc4c02',
  },
  stravaHeaderContent: {
    flex: 1,
  },
  stravaTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  stravaSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 2,
  },
  benefitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  permissionsSection: {
    marginBottom: 24,
  },
  permissionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  permissionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(252, 76, 2, 0.5)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    flex: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  permissionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  permissionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
    marginLeft: 24,
  },
  permissionNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    marginLeft: 24,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: '#fc4c02',
    borderColor: '#fc4c02',
    marginBottom: 16,
  },
  securityNotice: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
  },
  securityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  successCards: {
    gap: 16,
    width: '100%',
  },
  successCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  successCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  successCardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
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
