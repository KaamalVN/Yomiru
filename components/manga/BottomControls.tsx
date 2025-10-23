import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

interface BottomControlsProps {
  visible: boolean;
  translationEnabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  colorizationEnabled: boolean;
  onTranslatePress: () => void;
  onColorizePress: () => void;
  onExecutePress: () => void;
  onSettingsPress: () => void;
  isProcessing?: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  visible,
  translationEnabled,
  sourceLanguage,
  targetLanguage,
  colorizationEnabled,
  onTranslatePress,
  onColorizePress,
  onExecutePress,
  onSettingsPress,
  isProcessing = false,
}) => {
  if (!visible) return null;

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutDown.duration(300)} style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blur}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, translationEnabled && styles.buttonActive]}
            onPress={() => handlePress(onTranslatePress)}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="character.book.closed"
              size={24}
              color={translationEnabled ? Colors.yomiru.primary : Colors.yomiru.textSecondary}
            />
            <Text style={styles.buttonLabel}>Translate</Text>
            <Text style={styles.buttonSubLabel}>
              {sourceLanguage.toUpperCase()} → {targetLanguage.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, colorizationEnabled && styles.buttonActive]}
            onPress={() => handlePress(onColorizePress)}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="paintpalette"
              size={24}
              color={colorizationEnabled ? Colors.yomiru.accent : Colors.yomiru.textSecondary}
            />
            <Text style={styles.buttonLabel}>Colorizer</Text>
            <Text style={styles.buttonSubLabel}>{colorizationEnabled ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.executeButton, isProcessing && styles.buttonProcessing]}
            onPress={() => handlePress(onExecutePress)}
            activeOpacity={0.7}
            disabled={isProcessing}
          >
            <IconSymbol
              name="play.circle.fill"
              size={28}
              color={isProcessing ? Colors.yomiru.textMuted : Colors.yomiru.accentGreen}
            />
            <Text style={[styles.buttonLabel, isProcessing && styles.buttonLabelDisabled]}>
              {isProcessing ? 'Processing...' : 'Execute'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress(onSettingsPress)}
            activeOpacity={0.7}
          >
            <IconSymbol name="gearshape.fill" size={24} color={Colors.yomiru.textSecondary} />
            <Text style={styles.buttonLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
      android: {
        paddingBottom: 10,
      },
      default: {
        paddingBottom: 0,
      },
    }),
  },
  blur: {
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.yomiru.overlay,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  buttonActive: {
    backgroundColor: Colors.yomiru.surface,
  },
  executeButton: {
    backgroundColor: Colors.yomiru.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonProcessing: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: Colors.yomiru.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  buttonLabelDisabled: {
    color: Colors.yomiru.textMuted,
  },
  buttonSubLabel: {
    color: Colors.yomiru.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
