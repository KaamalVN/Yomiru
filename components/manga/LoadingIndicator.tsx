import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, size = 'large' }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={Colors.yomiru.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.yomiru.background,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  message: {
    color: Colors.yomiru.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});
