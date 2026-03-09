import { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

const splashImage = require('../assets/bakugo-splash.png');

export default function SplashScreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Phase 1: fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Phase 2: hold
      Animated.delay(1000),
      // Phase 3: fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={splashImage} style={styles.logo} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
