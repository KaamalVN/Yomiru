import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { MangaSettings, SUPPORTED_LANGUAGES } from '@/types';
import { StorageService } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { Button } from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  settings: MangaSettings;
  onSave: (settings: MangaSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  visible,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<MangaSettings>(settings);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await StorageService.saveSettings(localSettings);
    if (success) {
      onSave(localSettings);
      Toast.show({
        type: 'success',
        text1: 'Settings Saved',
        text2: 'Your preferences have been saved successfully',
        position: 'top',
      });
      onClose();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not save settings. Please try again.',
        position: 'top',
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={[styles.panel, {paddingBottom: insets.bottom,maxHeight: `80%`}]}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={Colors.yomiru.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chapter URL</Text>
              <TextInput
                style={styles.input}
                value={localSettings.chapterUrl}
                onChangeText={(text) => setLocalSettings({ ...localSettings, chapterUrl: text })}
                placeholder="Enter chapter URL"
                placeholderTextColor={Colors.yomiru.textMuted}
                multiline
              />
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.sectionTitle}>Translation</Text>
                <Switch
                  value={localSettings.translationEnabled}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLocalSettings({ ...localSettings, translationEnabled: value });
                  }}
                  trackColor={{ false: Colors.yomiru.surface, true: Colors.yomiru.primary }}
                  thumbColor={Colors.yomiru.text}
                />
              </View>

              {localSettings.translationEnabled && (
                <>
                  <View style={styles.languageContainer}>
                    <View style={styles.languageBox}>
                      <Text style={styles.label}>Source Language</Text>
                      <View style={styles.pickerContainer}>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <TouchableOpacity
                            key={lang.code}
                            style={[
                              styles.languageChip,
                              localSettings.sourceLanguage === lang.code && styles.languageChipActive,
                            ]}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setLocalSettings({ ...localSettings, sourceLanguage: lang.code });
                            }}
                          >
                            <Text
                              style={[
                                styles.languageChipText,
                                localSettings.sourceLanguage === lang.code &&
                                  styles.languageChipTextActive,
                              ]}
                            >
                              {lang.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.languageBox}>
                      <Text style={styles.label}>Target Language</Text>
                      <View style={styles.pickerContainer}>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <TouchableOpacity
                            key={lang.code}
                            style={[
                              styles.languageChip,
                              localSettings.targetLanguage === lang.code && styles.languageChipActive,
                            ]}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setLocalSettings({ ...localSettings, targetLanguage: lang.code });
                            }}
                          >
                            <Text
                              style={[
                                styles.languageChipText,
                                localSettings.targetLanguage === lang.code &&
                                  styles.languageChipTextActive,
                              ]}
                            >
                              {lang.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.sectionTitle}>Colorization</Text>
                <Switch
                  value={localSettings.colorizationEnabled}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLocalSettings({ ...localSettings, colorizationEnabled: value });
                  }}
                  trackColor={{ false: Colors.yomiru.surface, true: Colors.yomiru.accent }}
                  thumbColor={Colors.yomiru.text}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Backend Configuration</Text>
              <Text style={styles.label}>API Key</Text>
              <TextInput
                style={styles.input}
                value={localSettings.apiKey}
                onChangeText={(text) => setLocalSettings({ ...localSettings, apiKey: text })}
                placeholder="Enter your API key"
                placeholderTextColor={Colors.yomiru.textMuted}
                secureTextEntry
              />
              <Text style={styles.label}>Backend Endpoint URL</Text>
              <TextInput
                style={styles.input}
                value={localSettings.backendEndpoint}
                onChangeText={(text) => setLocalSettings({ ...localSettings, backendEndpoint: text })}
                placeholder="https://your-backend.modal.run"
                placeholderTextColor={Colors.yomiru.textMuted}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Save Configuration" onPress={handleSave} variant="primary" />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.yomiru.overlayDark,
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    backgroundColor: Colors.yomiru.backgroundCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.yomiru.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.yomiru.text,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.yomiru.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.yomiru.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.yomiru.surface,
    borderRadius: 12,
    padding: 16,
    color: Colors.yomiru.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.yomiru.border,
    marginBottom: 12,
  },
  languageContainer: {
    gap: 16,
    marginTop: 8,
  },
  languageBox: {
    gap: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.yomiru.surface,
    borderWidth: 1,
    borderColor: Colors.yomiru.border,
  },
  languageChipActive: {
    backgroundColor: Colors.yomiru.primary,
    borderColor: Colors.yomiru.primary,
  },
  languageChipText: {
    color: Colors.yomiru.textSecondary,
    fontSize: 14,
  },
  languageChipTextActive: {
    color: Colors.yomiru.text,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.yomiru.border,
  },
});
