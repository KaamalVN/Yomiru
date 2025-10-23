import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface ProgressBarProps {
  current: number;
  total: number;
  message?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, message }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress}%`, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>
          {current} / {total}
        </Text>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, progressStyle]} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: Colors.yomiru.text,
    fontSize: 14,
    fontWeight: '600',
  },
  percentage: {
    color: Colors.yomiru.textSecondary,
    fontSize: 14,
  },
  track: {
    height: 8,
    backgroundColor: Colors.yomiru.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.yomiru.primary,
    borderRadius: 4,
  },
  message: {
    color: Colors.yomiru.textSecondary,
    fontSize: 12,
  },
});
