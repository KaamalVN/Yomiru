export interface MangaSettings {
  chapterUrl: string;
  translationEnabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  colorizationEnabled: boolean;
  apiKey: string;
  backendEndpoint: string;
}

export interface MangaChapter {
  title: string;
  chapterName: string;
  url: string;
  pages: MangaPage[];
}

export interface MangaPage {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  localPath?: string;
  isProcessed: boolean;
  isLoading: boolean;
  error?: string;
}

export interface ProcessingProgress {
  currentPage: number;
  totalPages: number;
  status: 'idle' | 'fetching' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface APIResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface TranslationOptions {
  sourceLanguage: string;
  targetLanguage: string;
  enabled: boolean;
}

export interface ColorizationOptions {
  enabled: boolean;
}

export interface ProcessRequest {
  chapterUrl: string;
  translation: TranslationOptions;
  colorization: ColorizationOptions;
}

export type Language = {
  code: string;
  name: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'ja', name: 'Japanese' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];
