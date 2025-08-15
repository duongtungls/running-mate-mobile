import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Mail, AlertCircle } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', general: '' });
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = () => {
    const newErrors = { email: '', general: '' };

    if (!email.trim()) {
      newErrors.email = t('auth.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.validation.emailInvalid');
    }

    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleSendResetLink = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({ email: '', general: '' });

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || t('auth.forgotPassword.sendError'),
        }));
      } else {
        setEmailSent(true);
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || t('auth.forgotPassword.sendError'),
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        Alert.alert(
          t('common.error'),
          error.message || t('auth.forgotPassword.resendError'),
          [{ text: t('common.ok') }],
        );
      } else {
        Alert.alert(
          t('auth.forgotPassword.emailSent'),
          t('auth.forgotPassword.resendSuccess'),
          [{ text: t('common.ok') }],
        );
      }
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('auth.forgotPassword.resendError'),
        [{ text: t('common.ok') }],
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Mail size={64} color="#fff" />
            </View>

            <Text style={styles.successTitle}>
              {t('auth.forgotPassword.checkEmail')}
            </Text>
            <Text style={styles.successSubtitle}>
              {t('auth.forgotPassword.sentInstructions')}
            </Text>

            <Text style={styles.emailAddress}>{email}</Text>

            <Text style={styles.successInstruction}>
              {t('auth.forgotPassword.instructions')}
            </Text>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResendEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {t('auth.forgotPassword.resendEmail')}
                  </Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.backToLoginText}>
                {t('auth.backTo')}{' '}
                <Text style={styles.backToLoginTextBold}>
                  {t('auth.signIn')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1616198814651-e71f960c3180?auto=format&fit=crop&w=400&h=250&q=80',
            }}
            style={styles.headerImage}
          />
          <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.forgotPassword.subtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          {errors.general ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#ef4444" />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Mail size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              autoFocus
              editable={!loading}
            />
          </View>
          {errors.email ? (
            <Text style={styles.fieldError}>{errors.email}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendResetLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {t('auth.forgotPassword.sendLink')}
                </Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {t('auth.forgotPassword.rememberPassword')}{' '}
              <Text style={styles.loginTextBold}>{t('auth.signIn')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 4,
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
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  // Success screen styles
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconContainer: {
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
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailAddress: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  successInstruction: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  backToLoginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToLoginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  backToLoginTextBold: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
});
