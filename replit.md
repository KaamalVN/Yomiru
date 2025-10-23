# Yomiru - Manga Reader App

## Overview

Yomiru is a cross-platform manga reader application built with Expo and React Native. The app allows users to read manga chapters with advanced features including AI-powered translation, colorization, and an immersive reading experience with gesture controls. It supports iOS, Android, and web platforms through Expo's universal app architecture.

## Recent Changes

**October 23, 2025**
- ✅ Complete implementation of Yomiru manga reader app
- Created custom dark theme with deep purples (#8B5CF6), dark blues (#3B82F6), and charcoal grays (#0F0F1A)
- Built comprehensive type system for manga data, settings, and API responses
- Implemented AsyncStorage persistence for user settings and chapter data
- Created API service module for Flask backend integration on Modal Labs
- Developed all core UI components with animations and haptic feedback
- Implemented main manga reader screen with full feature set:
  - Auto clipboard URL detection on launch
  - Animated header showing manga title, chapter, and URL
  - Bottom controls panel with Translate, Colorizer, Execute, and Settings buttons
  - Settings panel with slide-up animation and full configuration options
  - Manga viewer with pinch-to-zoom, double-tap zoom, and vertical scrolling
  - Single-tap gesture to toggle header/controls visibility
  - Progress tracking and toast notifications
- Configured Expo Dev Server workflow on port 5000

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- Built on Expo SDK 54 with React Native 0.81.4
- Uses Expo Router for file-based navigation with typed routes
- Single-screen app structure optimized for manga reading experience
- React 19.1.0 for the latest concurrent features
- Always-on dark theme via custom ThemeProvider

**UI/UX Design Patterns**
- Dark theme-first design with custom color palette (Yomiru theme)
- Deep purples (#8B5CF6), dark blues (#3B82F6), charcoal grays (#0F0F1A)
- Gesture-based interactions using `react-native-gesture-handler` for pinch-to-zoom and pan controls
- Animated components using `react-native-reanimated` for smooth transitions and spring animations
- Glassmorphic UI elements with `expo-blur` for headers and controls
- Haptic feedback integration via `expo-haptics` for tactile user interactions
- Toast notifications using `react-native-toast-message` for user feedback
- Single-tap gesture to show/hide controls with smooth fade animations

**Component Architecture**
- Modular manga-specific components in `components/manga/`:
  - `MangaViewer`: Scrollable page display with pinch-to-zoom, double-tap zoom, and pan gestures
  - `Header`: Animated top bar with manga title, chapter name, and URL display
  - `BottomControls`: Action controls for translation, colorization, execution, and settings
  - `SettingsPanel`: Modal configuration interface with slide-up animation
  - `ProgressBar`: Animated processing progress indicator with spring animations
  - `LoadingIndicator`: Centered loading state display with fade transitions
  - `Button`: Reusable button with variants (primary, secondary, outline, ghost) and loading states
- Themed component system with `ThemedView` and `ThemedText` for consistent styling

**State Management**
- Local component state with React hooks (useState, useEffect, useCallback)
- AsyncStorage for persistent settings and chapter data via `StorageService` utility
- No external state management library (Redux/MobX) - uses lifted state pattern
- Clipboard integration on app launch to auto-populate chapter URLs

**Image Handling**
- `expo-image` for optimized image rendering with caching
- Local file system storage via `expo-file-system` for processed manga pages
- Downloads and caches processed images to device storage
- Support for both original and processed image URLs

### Backend Integration

**API Service Architecture**
- Axios-based HTTP client in `services/api.ts`
- `MangaAPIService` class handles manga processing requests
- Configurable backend endpoint and API key authentication
- Bearer token authentication in request headers
- 5-minute timeout for processing-heavy requests
- Progress callback support for real-time processing updates

**API Communication**
- RESTful endpoint: `/process` for chapter processing
- Request payload includes chapter URL, translation settings, and colorization options
- Response includes processed page URLs and metadata
- Error handling with user-friendly toast notifications
- Health check endpoint for backend validation

### Data Models

**Core Types** (defined in `types/index.ts`)
- `MangaSettings`: User preferences including API keys, language pairs, feature toggles
- `MangaChapter`: Chapter metadata with title, URL, and page array
- `MangaPage`: Individual page with original/processed URLs and loading states
- `ProcessingProgress`: Real-time status tracking for async operations
- `APIResponse`: Standardized API response wrapper
- `Language`: Supported language definitions

**Storage Schema**
- Settings stored under `@yomiru_settings` key
- Chapter data cached under `@yomiru_chapter_data` key
- JSON serialization for all stored data
- Default settings: Japanese→English translation, colorization off

**Supported Languages**
- Japanese (ja), English (en), Chinese (zh), Korean (ko)
- Spanish (es), French (fr), German (de), Italian (it)
- Portuguese (pt), Russian (ru)

### Cross-Platform Considerations

**Platform-Specific Implementations**
- iOS SF Symbols via `expo-symbols` with Material Icons fallback for Android/web
- Platform-specific padding for headers and controls (iOS notch support)
- Platform-specific blur effects (BlurView on iOS, opaque on Android/web)
- Conditional haptic feedback (iOS-only)

**Responsive Design**
- Dynamic screen width calculations using Dimensions API
- Adaptive layouts for different screen sizes
- Safe area context for notched devices

### Performance Optimizations

**Animation Performance**
- Worklet-based animations with `react-native-reanimated` for 60fps performance
- Shared values for gesture-driven animations
- Spring physics for natural motion in progress bars and gestures

**Image Optimization**
- Progressive image loading with placeholder support
- Automatic image caching via expo-image with memory-disk policy
- Local file system storage to reduce network requests
- High priority loading for visible pages

## External Dependencies

### Expo Ecosystem
- **expo**: Core framework (v54.0.9)
- **expo-router**: File-based navigation and routing
- **expo-image**: Optimized image component with caching
- **expo-file-system**: Local file storage and management
- **expo-blur**: Platform-native blur effects
- **expo-haptics**: Tactile feedback
- **expo-clipboard**: Clipboard operations for auto URL detection
- **expo-constants**: Device and app constants
- **expo-status-bar**: Status bar customization

### Navigation
- **@react-navigation/native**: Navigation container
- **@react-navigation/bottom-tabs**: Tab-based navigation (hidden in manga reader)

### UI Libraries
- **@expo/vector-icons**: Icon set including MaterialIcons
- **react-native-gesture-handler**: Advanced gesture recognition for zoom/pan
- **react-native-reanimated**: High-performance animations
- **react-native-safe-area-context**: Safe area handling
- **react-native-screens**: Native screen optimization
- **react-native-toast-message**: Toast notifications

### Storage & Networking
- **@react-native-async-storage/async-storage**: Persistent key-value storage
- **axios**: HTTP client for API requests

### Web Support
- **react-native-web**: React Native for web compilation
- **react-dom**: React DOM renderer for web platform

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code linting with Expo config
- **Jest**: Testing framework
- **@babel/core**: JavaScript transpilation

### Backend API (External Service)
- Custom manga processing API (endpoint configurable in settings)
- Requires API key for authentication (configured by user)
- Provides translation and colorization services
- Expected to handle manga chapter URLs via gallery-dl
- Processes images through zyddnys/manga-image-translator with Ollama LLM
- Returns processed image URLs for download and local caching

## Getting Started

1. **Configure Settings**: Tap the Settings button in the bottom controls
2. **Set Backend**: Enter your backend endpoint URL (e.g., `https://your-backend.modal.run`)
3. **Add API Key**: Enter your API key for backend authentication
4. **Paste URL**: Enter a manga chapter URL (or copy one to clipboard before opening the app)
5. **Choose Languages**: Select source and target languages for translation (default: Japanese→English)
6. **Enable Features**: Toggle translation and/or colorization as desired
7. **Execute**: Tap the Execute button to process the chapter
8. **Read**: Enjoy your manga with pinch-to-zoom, double-tap zoom, and single-tap to hide controls

## Features

✅ Auto clipboard URL detection on launch  
✅ Beautiful dark theme with deep purples and blues  
✅ Animated header with manga info  
✅ Bottom controls with language pair display  
✅ Settings panel with slide-up animation  
✅ Vertical scrolling manga viewer  
✅ Pinch-to-zoom gestures  
✅ Double-tap for quick zoom  
✅ Single-tap to toggle UI visibility  
✅ Haptic feedback throughout  
✅ Toast notifications  
✅ Progress tracking with animated indicators  
✅ AsyncStorage persistence  
✅ Image caching and local storage  
✅ Translation support (10 languages)  
✅ Colorization toggle  
✅ Configurable backend integration
