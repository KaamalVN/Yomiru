import React, { useEffect } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import { SystemBars } from 'react-native-edge-to-edge';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/Manrope-Regular.ttf'),
  });



  if (!loaded) {
    return null;
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.yomiru.primary,
      background: Colors.yomiru.background,
      card: Colors.yomiru.backgroundCard,
      text: Colors.yomiru.text,
      border: Colors.yomiru.border,
      notification: Colors.yomiru.accent,
    },
  };

  return (
    <SafeAreaProvider>
      <SystemBars style="light" />
      <ThemeProvider value={customDarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
