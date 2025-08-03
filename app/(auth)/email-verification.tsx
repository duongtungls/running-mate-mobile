import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  CheckCircle,
  ArrowRight,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);

    try {
      // TODO: Implement actual resend verification email logic
      // Example: await resendVerificationEmail(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Email Sent!',
        "We've sent another verification email to your inbox.",
        [{ text: 'OK' }],
      );

      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      Alert.alert(
        'Error',
        'Failed to send verification email. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    Alert.alert(
      'Account Verified!',
      'Your account has been successfully verified. You can now sign in.',
      [
        {
          text: 'Sign In',
          onPress: () => router.replace('/login'),
        },
      ],
    );
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Verification?',
      'You can verify your email later in settings. Some features may be limited until verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => router.replace('/(tabs)'),
        },
      ],
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Mail size={64} color="#fff" />
          </View>

          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a verification link to:
          </Text>

          <Text style={styles.email}>{email || 'your email address'}</Text>

          <Text style={styles.instruction}>
            Click the link in your email to verify your account. If you
            don&apos;t see it, check your spam folder.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.resendButton,
                (loading || resendCooldown > 0) && styles.buttonDisabled,
              ]}
              onPress={handleResendEmail}
              disabled={loading || resendCooldown > 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <RefreshCw size={18} color="#fff" />
                  <Text style={styles.resendButtonText}>
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Email'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.verifiedButton}
              onPress={handleVerificationComplete}
            >
              <CheckCircle size={18} color="#fff" />
              <Text style={styles.verifiedButtonText}>I&apos;ve Verified</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipForNow}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
            <ArrowRight size={16} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact support at{' '}
            <Text style={styles.supportLink}>support@runningmate.com</Text>
          </Text>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  instruction: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  actions: {
    width: '100%',
    marginBottom: 24,
  },
  resendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  verifiedButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  verifiedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 6,
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  supportLink: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});
