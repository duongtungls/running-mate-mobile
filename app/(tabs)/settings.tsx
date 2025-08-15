import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Globe,
  CircleHelp as HelpCircle,
  Lock,
  LogOut,
  Mail,
  Moon,
  Shield,
  Smartphone,
  User,
  Vibrate,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import GradientBackground from '../../components/GradientBackground';
import { useI18n } from '@/hooks/useI18n';
import LanguageSelector from '@/components/LanguageSelector';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, getCurrentLanguage, getLanguageDisplayName } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [vibration, setVibration] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle = null,
    showToggle = false,
    toggleValue = false,
    onToggle = null,
    showChevron = true,
    color = '#666',
    onPress = null,
  }: {
    icon: React.ComponentType<any>;
    title: string;
    subtitle?: string | null;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: ((value: boolean) => void) | null;
    showChevron?: boolean;
    color?: string;
    onPress?: (() => void) | null;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}15` }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#10b981' }}
          thumbColor="#fff"
        />
      ) : showChevron ? (
        <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.appSettings')}</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.profile')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={User}
              title={t('profile.editProfile')}
              subtitle="Manage your personal information"
              onPress={() => router.push('/profile')}
            />
            <SettingItem
              icon={Mail}
              title={t('auth.email')}
              subtitle="Update your email address"
            />
            <SettingItem
              icon={Lock}
              title={t('auth.password')}
              subtitle="Change your password"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={Bell}
              title={t('settings.notifications')}
              subtitle="Manage notification preferences"
              showToggle={true}
              toggleValue={notifications}
              onToggle={setNotifications}
              showChevron={false}
              color="#10b981"
            />
            <SettingItem
              icon={Moon}
              title={t('settings.theme')}
              subtitle="Toggle dark mode"
              showToggle={true}
              toggleValue={darkMode}
              onToggle={setDarkMode}
              showChevron={false}
              color="#8b5cf6"
            />
            <SettingItem
              icon={Vibrate}
              title="Vibration"
              subtitle="Haptic feedback"
              showToggle={true}
              toggleValue={vibration}
              onToggle={setVibration}
              showChevron={false}
              color="#f59e0b"
            />
            <SettingItem
              icon={Globe}
              title={t('common.language')}
              subtitle={getLanguageDisplayName(getCurrentLanguage())}
              onPress={() => setShowLanguageModal(true)}
              color="#3b82f6"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={HelpCircle}
              title={t('common.help')}
              subtitle="Get help and support"
              color="#ef4444"
            />
            <SettingItem
              icon={Shield}
              title={t('settings.privacy')}
              subtitle="Privacy and data settings"
              color="#10b981"
            />
            <SettingItem
              icon={Smartphone}
              title={t('settings.aboutApp')}
              subtitle="App version and information"
              color="#8b5cf6"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={LogOut}
              title={t('auth.signOut')}
              subtitle="Sign out of your account"
              showChevron={false}
              color="#ef4444"
              onPress={() => {
                Alert.alert(
                  t('auth.signOut'),
                  'Are you sure you want to sign out?',
                  [
                    {
                      text: t('common.cancel'),
                      style: 'cancel',
                    },
                    {
                      text: t('auth.signOut'),
                      style: 'destructive',
                      onPress: () => {
                        // Handle logout logic here
                        // Logout pressed
                        router.replace('/(auth)/login');
                      },
                    },
                  ],
                );
              }}
            />
          </View>
        </View>

        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('common.language')}</Text>
                <TouchableOpacity
                  onPress={() => setShowLanguageModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <LanguageSelector
                onLanguageSelect={() => setShowLanguageModal(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
