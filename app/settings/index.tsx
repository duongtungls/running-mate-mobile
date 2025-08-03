import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useI18n } from '@/hooks/useI18n';
import LanguageSelector from '@/components/LanguageSelector';

export default function SettingsScreen() {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.appSettings')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionDescription}>
            {t('common.language')} settings for the app
          </Text>
          <LanguageSelector style={styles.languageSelector} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <Text style={styles.sectionDescription}>
            Manage your notification preferences
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.units')}</Text>
          <Text style={styles.sectionDescription}>
            Choose between {t('settings.metric')} and {t('settings.imperial')}{' '}
            units
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          <Text style={styles.sectionDescription}>
            Switch between {t('settings.light')}, {t('settings.dark')}, or{' '}
            {t('settings.system')} theme
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.aboutApp')}</Text>
          <Text style={styles.sectionDescription}>
            {t('settings.version')}: 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  languageSelector: {
    marginTop: 8,
  },
});
