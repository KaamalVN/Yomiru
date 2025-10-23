import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Header } from '@/components/manga/Header';
import { BottomControls } from '@/components/manga/BottomControls';
import { SettingsPanel } from '@/components/manga/SettingsPanel';
import { MangaViewer } from '@/components/manga/MangaViewer';
import { LoadingIndicator } from '@/components/manga/LoadingIndicator';
import { ProgressBar } from '@/components/manga/ProgressBar';
import { MangaSettings, MangaPage, MangaChapter, ProcessingProgress } from '@/types';
import { StorageService } from '@/utils/storage';
import { createAPIService, MangaAPIService } from '@/services/api';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

export default function MangaReaderScreen() {
  const [settings, setSettings] = useState<MangaSettings>({
    chapterUrl: '',
    translationEnabled: true,
    sourceLanguage: 'ja',
    targetLanguage: 'en',
    colorizationEnabled: false,
    apiKey: '',
    backendEndpoint: '',
  });

  const [chapter, setChapter] = useState<MangaChapter>({
    title: 'Yomiru',
    chapterName: '',
    url: '',
    pages: [],
  });

  const [controlsVisible, setControlsVisible] = useState(true);
  const [settingsPanelVisible, setSettingsPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    currentPage: 0,
    totalPages: 0,
    status: 'idle',
  });
  const [apiService, setApiService] = useState<MangaAPIService | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      
      const clipboardText = await Clipboard.getStringAsync();
      if (clipboardText && clipboardText.startsWith('http')) {
        savedSettings.chapterUrl = clipboardText;
        await StorageService.saveSettings(savedSettings);
        
        Toast.show({
          type: 'info',
          text1: 'URL Detected',
          text2: 'Clipboard URL loaded into settings',
          position: 'top',
          visibilityTime: 3000,
        });
      }

      setSettings(savedSettings);

      if (savedSettings.backendEndpoint && savedSettings.apiKey) {
        const service = createAPIService(savedSettings.backendEndpoint, savedSettings.apiKey);
        setApiService(service);
      }

      setChapter((prev) => ({
        ...prev,
        url: savedSettings.chapterUrl,
      }));
    } catch (error) {
      console.error('Error initializing app:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: 'Failed to initialize app',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleControls = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setControlsVisible(!controlsVisible);
  };

  const handleToggleTranslation = () => {
    const newSettings = { ...settings, translationEnabled: !settings.translationEnabled };
    setSettings(newSettings);
    StorageService.updateSettings({ translationEnabled: newSettings.translationEnabled });
  };

  const handleToggleColorization = () => {
    const newSettings = { ...settings, colorizationEnabled: !settings.colorizationEnabled };
    setSettings(newSettings);
    StorageService.updateSettings({ colorizationEnabled: newSettings.colorizationEnabled });
  };

  const handleSaveSettings = (newSettings: MangaSettings) => {
    setSettings(newSettings);
    
    if (newSettings.backendEndpoint && newSettings.apiKey) {
      const service = createAPIService(newSettings.backendEndpoint, newSettings.apiKey);
      setApiService(service);
    }

    setChapter((prev) => ({
      ...prev,
      url: newSettings.chapterUrl,
    }));
  };

  const handleExecute = async () => {
    if (!settings.chapterUrl) {
      Toast.show({
        type: 'error',
        text1: 'No URL',
        text2: 'Please enter a chapter URL in settings',
        position: 'top',
      });
      return;
    }

    if (!apiService) {
      Toast.show({
        type: 'error',
        text1: 'Not Configured',
        text2: 'Please configure backend endpoint and API key',
        position: 'top',
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress({
        currentPage: 0,
        totalPages: 0,
        status: 'fetching',
        message: 'Fetching chapter...',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const processedPages = await apiService.processChapter(
        {
          chapterUrl: settings.chapterUrl,
          translation: {
            sourceLanguage: settings.sourceLanguage,
            targetLanguage: settings.targetLanguage,
            enabled: settings.translationEnabled,
          },
          colorization: {
            enabled: settings.colorizationEnabled,
          },
        },
        (progressUpdate) => {
          setProgress({
            currentPage: progressUpdate.current,
            totalPages: progressUpdate.total,
            status: 'processing',
            message: progressUpdate.message,
          });
        }
      );

      setChapter((prev) => ({
        ...prev,
        pages: processedPages,
      }));

      setProgress({
        currentPage: processedPages.length,
        totalPages: processedPages.length,
        status: 'completed',
        message: 'Processing complete!',
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Processed ${processedPages.length} pages`,
        position: 'top',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error processing chapter:', error);
      setProgress({
        currentPage: 0,
        totalPages: 0,
        status: 'error',
        message: error instanceof Error ? error.message : 'Processing failed',
      });

      Toast.show({
        type: 'error',
        text1: 'Processing Failed',
        text2: error instanceof Error ? error.message : 'An error occurred',
        position: 'top',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading Yomiru..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.yomiru.background} />

      {chapter.pages.length > 0 ? (
        <MangaViewer pages={chapter.pages} onTap={handleToggleControls} />
      ) : (
        <View style={styles.emptyState}>
          <LoadingIndicator message="No manga loaded. Configure settings and tap Execute to start." />
        </View>
      )}

      <Header
        title={chapter.title}
        chapterName={chapter.chapterName}
        url={chapter.url}
        visible={controlsVisible}
      />

      <BottomControls
        visible={controlsVisible}
        translationEnabled={settings.translationEnabled}
        sourceLanguage={settings.sourceLanguage}
        targetLanguage={settings.targetLanguage}
        colorizationEnabled={settings.colorizationEnabled}
        onTranslatePress={handleToggleTranslation}
        onColorizePress={handleToggleColorization}
        onExecutePress={handleExecute}
        onSettingsPress={() => setSettingsPanelVisible(true)}
        isProcessing={isProcessing}
      />

      <SettingsPanel
        visible={settingsPanelVisible}
        onClose={() => setSettingsPanelVisible(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {isProcessing && progress.totalPages > 0 && (
        <View style={styles.progressContainer}>
          <ProgressBar
            current={progress.currentPage}
            total={progress.totalPages}
            message={progress.message}
          />
        </View>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yomiru.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: Colors.yomiru.backgroundCard,
    padding: 16,
    borderRadius: 12,
    zIndex: 50,
  },
});
