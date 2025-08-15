import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';

interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
}

const getPasswordRequirements = (t: any): PasswordRequirement[] => [
  {
    label: t('auth.signup.requirements.minLength'),
    check: (p) => p.length >= 8,
  },
  {
    label: t('auth.signup.requirements.uppercase'),
    check: (p) => /[A-Z]/.test(p),
  },
  {
    label: t('auth.signup.requirements.lowercase'),
    check: (p) => /[a-z]/.test(p),
  },
  { label: t('auth.signup.requirements.number'), check: (p) => /\d/.test(p) },
  {
    label: t('auth.signup.requirements.special'),
    check: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    signUp,
    signInWithGoogle,
    signInWithApple,
    isAppleAuthAvailable,
    loading: authLoading,
  } = useAuth();
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    isAppleAuthAvailable().then(setAppleAuthAvailable);
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
      general: '',
    };

    if (!name.trim()) {
      newErrors.name = t('auth.validation.nameRequired');
    } else if (name.trim().length < 2) {
      newErrors.name = t('auth.validation.nameTooShort');
    }

    if (!email.trim()) {
      newErrors.email = t('auth.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.validation.emailInvalid');
    }

    if (!password.trim()) {
      newErrors.password = t('auth.validation.passwordRequired');
    } else {
      const failedRequirements = getPasswordRequirements(t).filter(
        (req) => !req.check(password),
      );
      if (failedRequirements.length > 0) {
        newErrors.password = t('auth.validation.passwordRequirements');
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('auth.validation.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.validation.passwordsDoNotMatch');
    }

    if (!acceptedTerms) {
      newErrors.terms = t('auth.validation.termsRequired');
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const { error } = await signUp(email, password, {
        full_name: name,
      });

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || t('auth.signup.failedToCreate'),
        }));
      } else {
        Alert.alert(
          t('auth.signup.accountCreated'),
          t('auth.signup.checkEmailMessage'),
          [
            {
              text: t('common.ok'),
              onPress: () => router.replace('/login'),
            },
          ],
        );
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || t('auth.signup.failedToCreate'),
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || 'Google sign-up failed',
        }));
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Google sign-up failed',
      }));
    }
  };

  const handleAppleSignup = async () => {
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const { error } = await signInWithApple();

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || 'Apple sign-up failed',
        }));
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Apple sign-up failed',
      }));
    }
  };

  const getPasswordStrength = () => {
    const passedRequirements = getPasswordRequirements(t).filter((req) =>
      req.check(password),
    );
    const strength = passedRequirements.length;

    if (strength < 2)
      return {
        label: t('auth.signup.passwordStrength.weak'),
        color: '#ef4444',
      };
    if (strength < 4)
      return {
        label: t('auth.signup.passwordStrength.medium'),
        color: '#f59e0b',
      };
    if (strength < 5)
      return {
        label: t('auth.signup.passwordStrength.strong'),
        color: '#10b981',
      };
    return {
      label: t('auth.signup.passwordStrength.veryStrong'),
      color: '#10b981',
    };
  };

  const passwordStrength = password ? getPasswordStrength() : null;

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.signup.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.signup.subtitle')}</Text>
          </View>

          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&h=200&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraButton}>
              <Camera size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.form}>
            {errors.general ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#ef4444" />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <User size={20} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                style={styles.input}
                placeholder={t('auth.fullName')}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                autoComplete="name"
                editable={!loading}
              />
            </View>
            {errors.name ? (
              <Text style={styles.fieldError}>{errors.name}</Text>
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
                editable={!loading}
              />
            </View>
            {errors.email ? (
              <Text style={styles.fieldError}>{errors.email}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Lock size={20} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                style={styles.input}
                placeholder={t('auth.password')}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} color="rgba(255, 255, 255, 0.6)" />
                ) : (
                  <Eye size={20} color="rgba(255, 255, 255, 0.6)" />
                )}
              </TouchableOpacity>
            </View>

            {password && passwordStrength ? (
              <View style={styles.passwordStrengthContainer}>
                <Text
                  style={[
                    styles.passwordStrengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {t('auth.signup.passwordStrength.label')}:{' '}
                  {passwordStrength.label}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(getPasswordRequirements(t).filter((req) => req.check(password)).length / getPasswordRequirements(t).length) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : null}

            {password ? (
              <View style={styles.passwordRequirements}>
                {getPasswordRequirements(t).map((requirement, index) => {
                  const isValid = requirement.check(password);
                  return (
                    <View key={index} style={styles.requirementRow}>
                      {isValid ? (
                        <Check size={14} color="#10b981" />
                      ) : (
                        <X size={14} color="#ef4444" />
                      )}
                      <Text
                        style={[
                          styles.requirementText,
                          {
                            color: isValid
                              ? '#10b981'
                              : 'rgba(255, 255, 255, 0.6)',
                          },
                        ]}
                      >
                        {requirement.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {errors.password ? (
              <Text style={styles.fieldError}>{errors.password}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Lock size={20} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                style={styles.input}
                placeholder={t('auth.confirmPassword')}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="rgba(255, 255, 255, 0.6)" />
                ) : (
                  <Eye size={20} color="rgba(255, 255, 255, 0.6)" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => {
                setAcceptedTerms(!acceptedTerms);
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: '' }));
                }
              }}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && <Check size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text>{' '}
                and{' '}
                <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? (
              <Text style={styles.fieldError}>{errors.terms}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {t('auth.createAccount')}
                  </Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleSignup}
                disabled={loading || authLoading}
              >
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              {appleAuthAvailable && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={handleAppleSignup}
                  disabled={loading || authLoading}
                >
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/login')}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {t('auth.alreadyHaveAccount')}{' '}
                <Text style={styles.loginTextBold}>{t('auth.signIn')}</Text>
              </Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  eyeButton: {
    padding: 8,
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    marginLeft: 4,
  },
  passwordStrengthContainer: {
    marginBottom: 12,
    marginTop: 4,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordRequirements: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  termsLink: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
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
    marginBottom: 20,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  googleButton: {
    backgroundColor: '#db4437',
    borderColor: '#c23321',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#333',
  },
});
