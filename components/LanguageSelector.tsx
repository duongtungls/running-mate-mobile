import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/contexts/ThemeContext';
import { createRgbaColor, opacity } from '@/constants/designTokens';

interface LanguageSelectorProps {
  style?: object;
  textStyle?: object;
  onLanguageSelect?: () => void;
  showAsModal?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  style,
  textStyle,
  onLanguageSelect,
  showAsModal = true,
}) => {
  const {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageDisplayName,
  } = useI18n();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = getCurrentLanguage();
  const languages = getAvailableLanguages();

  const handleLanguageSelect = async (langCode: string) => {
    try {
      await changeLanguage(langCode);
      if (showAsModal) {
        setModalVisible(false);
      }
      if (onLanguageSelect) {
        onLanguageSelect();
      }
    } catch {
      Alert.alert(t('errors.error'), t('errors.somethingWentWrong'));
    }
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        {
          backgroundColor:
            item === currentLang
              ? createRgbaColor(theme.primary, 0.1)
              : 'transparent',
        },
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text
        style={[
          styles.languageText,
          {
            color: item === currentLang ? theme.primary : theme.cardForeground,
            fontFamily:
              item === currentLang ? 'Inter-SemiBold' : 'Inter-Regular',
          },
        ]}
      >
        {getLanguageDisplayName(item)}
      </Text>
      {item === currentLang && (
        <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
      )}
    </TouchableOpacity>
  );

  // If not showing as modal, return just the list
  if (!showAsModal) {
    return (
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item}
        style={[styles.languageList, style]}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  // Otherwise return the original modal version with theme support
  return (
    <View style={style}>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: createRgbaColor(theme.foreground, opacity[1]),
            borderColor: createRgbaColor(theme.foreground, opacity[2]),
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.selectorText, { color: theme.foreground }, textStyle]}
        >
          {t('common.language')}: {getLanguageDisplayName(currentLang)}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor: createRgbaColor(
                    theme.cardForeground,
                    opacity[1],
                  ),
                },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: theme.cardForeground }]}
              >
                {t('common.language')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: createRgbaColor(
                      theme.cardForeground,
                      opacity[1],
                    ),
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.closeButtonText,
                    { color: theme.cardForeground },
                  ]}
                >
                  ✕
                </Text>
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
  selector: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
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

export default LanguageSelector;
