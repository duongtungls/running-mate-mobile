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
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
} from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';

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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
      general: '',
    };

    const passwordRequirements = getPasswordRequirements(t);

    if (!password.trim()) {
      newErrors.password = t('auth.validation.passwordRequired');
    } else {
      const failedRequirements = passwordRequirements.filter(
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

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || t('auth.resetPassword.failedToReset'),
        }));
      } else {
        Alert.alert(
          t('auth.resetPassword.passwordReset'),
          t('auth.resetPassword.successMessage'),
          [
            {
              text: t('auth.signIn'),
              onPress: () => router.replace('/login'),
            },
          ],
        );
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || t('auth.resetPassword.failedToReset'),
      }));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const passwordRequirements = getPasswordRequirements(t);
    const passedRequirements = passwordRequirements.filter((req) =>
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
              uri: 'https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?auto=format&fit=crop&w=400&h=250&q=80',
            }}
            style={styles.headerImage}
          />
          <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.resetPassword.subtitle')}
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
            <Lock size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.input}
              placeholder={t('auth.newPassword')}
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
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
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
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {t('auth.resetPassword.title')}
                </Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
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
  requirements: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  requirementsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 8,
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
});
