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
  ArrowLeft,
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
import GradientBackground from '../../../components/GradientBackground';
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('settings.appSettings')}</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={User}
              title={t('profile.personalInfo')}
              subtitle="Update your personal details"
              color="#3b82f6"
            />
            <SettingItem
              icon={Mail}
              title={t('auth.email')}
              subtitle="sarah.connor@example.com"
              color="#8b5cf6"
            />
            <SettingItem
              icon={Lock}
              title={t('auth.password')}
              subtitle="Last changed 3 months ago"
              color="#ef4444"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={Bell}
              title={t('settings.notifications')}
              showToggle={true}
              toggleValue={notifications}
              onToggle={setNotifications}
              showChevron={false}
              color="#f59e0b"
            />
            <SettingItem
              icon={Moon}
              title={t('settings.theme')}
              showToggle={true}
              toggleValue={darkMode}
              onToggle={setDarkMode}
              showChevron={false}
              color="#6366f1"
            />
            <SettingItem
              icon={Vibrate}
              title="Vibration"
              showToggle={true}
              toggleValue={vibration}
              onToggle={setVibration}
              showChevron={false}
              color="#ec4899"
            />
            <SettingItem
              icon={Globe}
              title={t('settings.language')}
              subtitle={getLanguageDisplayName(getCurrentLanguage())}
              color="#10b981"
              onPress={() => setShowLanguageModal(true)}
            />
            <SettingItem
              icon={Smartphone}
              title={t('settings.units')}
              subtitle={t('settings.kilometers')}
              color="#6366f1"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.privacy')} & Security
          </Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={Shield}
              title={t('settings.privacy')}
              subtitle="Manage your data and permissions"
              color="#0891b2"
            />
            <SettingItem
              icon={Lock}
              title="App Lock"
              subtitle="Require authentication to open"
              color="#dc2626"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="FAQs and support resources"
              color="#0d9488"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/onboarding/welcome')}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>{t('settings.version')} 1.0.0</Text>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <LanguageSelector
              style={styles.languageSelector}
              onLanguageChange={() => setShowLanguageModal(false)}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    padding: 8,
    alignSelf: 'flex-start',
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
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ef4444',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 32,
  },
});
