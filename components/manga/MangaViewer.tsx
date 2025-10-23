import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { MangaPage } from '@/types';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MangaViewerProps {
  pages: MangaPage[];
  onTap: () => void;
}

export const MangaViewer: React.FC<MangaViewerProps> = ({ pages, onTap }) => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {pages.map((page, index) => (
          <MangaPageView key={page.id} page={page} index={index} onTap={onTap} />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

interface MangaPageViewProps {
  page: MangaPage;
  index: number;
  onTap: () => void;
}

const MangaPageView: React.FC<MangaPageViewProps> = ({ page, index, onTap }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (scale.value > 1) {
      scale.value = withSpring(1);
      savedScale.value = 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    } else {
      scale.value = withSpring(2);
      savedScale.value = 2;
    }
  };

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      const now = Date.now();
      if (now - lastTap < 300) {
        runOnJS(handleDoubleTap)();
      } else {
        runOnJS(setLastTap)(now);
        runOnJS(onTap)();
      }
    });

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > 4) {
        scale.value = withSpring(4);
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    });

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const imageUri = page.localPath || page.processedUrl || page.originalUrl;

  return (
    <View style={styles.pageContainer}>
      <GestureDetector gesture={Gesture.Exclusive(composed, singleTap)}>
        <Animated.View style={[styles.imageWrapper, animatedStyle]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="contain"
            placeholder={require('@/assets/images/partial-react-logo.png')}
            cachePolicy="memory-disk"
            priority="high"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yomiru.background,
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    minHeight: 600,
    backgroundColor: Colors.yomiru.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    aspectRatio: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
