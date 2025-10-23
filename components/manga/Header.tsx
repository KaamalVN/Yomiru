import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

interface HeaderProps {
  title: string;
  chapterName: string;
  url: string;
  visible: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, chapterName, url, visible }) => {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(300)} style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title || 'Yomiru'}
          </Text>
          {chapterName && (
            <Text style={styles.chapter} numberOfLines={1}>
              {chapterName}
            </Text>
          )}
          {url && (
            <Text style={styles.url} numberOfLines={1}>
              {url}
            </Text>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 40,
      },
      default: {
        paddingTop: 0,
      },
    }),
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    backgroundColor: Colors.yomiru.overlay,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.yomiru.text,
    marginBottom: 4,
  },
  chapter: {
    fontSize: 14,
    color: Colors.yomiru.textSecondary,
    marginBottom: 2,
  },
  url: {
    fontSize: 12,
    color: Colors.yomiru.textMuted,
  },
});
