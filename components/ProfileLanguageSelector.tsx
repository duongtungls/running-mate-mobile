import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useI18n } from '@/hooks/useI18n';

interface ProfileLanguageSelectorProps {
  style?: object;
}

const ProfileLanguageSelector: React.FC<ProfileLanguageSelectorProps> = ({
  style,
}) => {
  const {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageDisplayName,
  } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = getCurrentLanguage();
  const languages = getAvailableLanguages();

  const handleLanguageSelect = async (langCode: string) => {
    try {
      await changeLanguage(langCode);
      setModalVisible(false);
    } catch {
      // Error handling - modal will still close
      setModalVisible(false);
    }
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item === currentLang && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text
        style={[
          styles.languageText,
          item === currentLang && styles.selectedLanguageText,
        ]}
      >
        {getLanguageDisplayName(item)}
      </Text>
      {item === currentLang && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.settingIcon, { backgroundColor: '#10b98115' }]}>
          <Text style={styles.iconText}>🌍</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{t('settings.language')}</Text>
          <Text style={styles.settingSubtitle}>
            {getLanguageDisplayName(currentLang)}
          </Text>
        </View>
        <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  iconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedLanguageItem: {
    backgroundColor: '#e3f2fd',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

export default ProfileLanguageSelector;
