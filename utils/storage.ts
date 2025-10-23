import AsyncStorage from '@react-native-async-storage/async-storage';
import { MangaSettings } from '@/types';

const STORAGE_KEYS = {
  SETTINGS: '@yomiru_settings',
  CHAPTER_DATA: '@yomiru_chapter_data',
};

const DEFAULT_SETTINGS: MangaSettings = {
  chapterUrl: '',
  translationEnabled: true,
  sourceLanguage: 'ja',
  targetLanguage: 'en',
  colorizationEnabled: false,
  apiKey: '',
  backendEndpoint: '',
};

export const StorageService = {
  async getSettings(): Promise<MangaSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsJson) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: MangaSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  async updateSettings(partialSettings: Partial<MangaSettings>): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...partialSettings };
      return await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  },

  async clearSettings(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return true;
    } catch (error) {
      console.error('Error clearing settings:', error);
      return false;
    }
  },

  async saveChapterData(data: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAPTER_DATA, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving chapter data:', error);
      return false;
    }
  },

  async getChapterData(): Promise<any | null> {
    try {
      const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.CHAPTER_DATA);
      return dataJson ? JSON.parse(dataJson) : null;
    } catch (error) {
      console.error('Error loading chapter data:', error);
      return null;
    }
  },
};
