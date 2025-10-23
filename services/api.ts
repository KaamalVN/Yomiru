import axios, { AxiosInstance } from 'axios';
import * as FileSystem from 'expo-file-system';
import { ProcessRequest, APIResponse, MangaPage } from '@/types';

export class MangaAPIService {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 300000,
    });
  }

  updateConfig(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 300000,
    });
  }

  async processChapter(
    request: ProcessRequest,
    onProgress?: (progress: { current: number; total: number; message: string }) => void
  ): Promise<MangaPage[]> {
    try {
      const response = await this.client.post<APIResponse>('/process', request);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to process chapter');
      }

      const pages: MangaPage[] = response.data.data?.pages || [];
      const processedPages: MangaPage[] = [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: pages.length,
            message: `Processing page ${i + 1} of ${pages.length}`,
          });
        }

        if (page.processedUrl) {
          const localPath = await this.downloadImage(page.processedUrl, page.id);
          processedPages.push({
            ...page,
            localPath,
            isProcessed: true,
            isLoading: false,
          });
        } else {
          processedPages.push({
            ...page,
            isProcessed: false,
            isLoading: false,
          });
        }
      }

      return processedPages;
    } catch (error) {
      console.error('Error processing chapter:', error);
      throw error;
    }
  }

  async downloadImage(url: string, pageId: string): Promise<string> {
    try {
      const fileUri = `${FileSystem.documentDirectory}manga_${pageId}.jpg`;
      
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      
      if (downloadResult.status === 200) {
        return downloadResult.uri;
      } else {
        throw new Error(`Failed to download image: ${downloadResult.status}`);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  async fetchChapterInfo(chapterUrl: string): Promise<any> {
    try {
      const response = await this.client.post<APIResponse>('/chapter-info', {
        url: chapterUrl,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch chapter info');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching chapter info:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get<APIResponse>('/health');
      return response.data.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const createAPIService = (baseURL: string, apiKey: string): MangaAPIService => {
  return new MangaAPIService(baseURL, apiKey);
};
