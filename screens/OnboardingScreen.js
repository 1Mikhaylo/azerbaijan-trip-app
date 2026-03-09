import { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { places } from '../data/places.js';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Discover Azerbaijan',
    description: 'Explore ancient cities, stunning nature and rich culture',
  },
  {
    id: '2',
    image: places[1].image,
    title: 'Plan Your Trip',
    description: 'Save your favourite places and build your perfect journey',
  },
  {
    id: '3',
    image: places[2].image,
    title: 'Your Adventure Awaits',
    description: "From Baku's skyline to mountain villages — it's all here",
  },
];

// ─── Shared bottom section ────────────────────────────────────────────────────

function SlideBottom({ title, description, isLast, currentIndex, onFinish }) {
  return (
    <View style={styles.bottom}>
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideDesc}>{description}</Text>

      {isLast && (
        <TouchableOpacity style={styles.startBtn} onPress={onFinish} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Let's Go 🔥</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Slide 1 — Two-column photo grid ─────────────────────────────────────────

const cardShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 },
  android: { elevation: 4 },
});

const LEFT_CARDS = [
  { place: places[0], height: 155, rotate: '-3deg', marginBottom: 10 },
  { place: places[2], height: 145, rotate: '-2deg', marginBottom: 10 },
  { place: places[4], height: 140, rotate: '-4deg' },
];

const RIGHT_CARDS = [
  { place: places[1], height: 150, rotate: '3deg',  marginBottom: 10 },
  { place: places[3], height: 155, rotate: '2deg',  marginBottom: 10 },
  { place: places[0], height: 140, rotate: '4deg'  },
];

function PhotoCard({ place, height: cardHeight, rotate, marginBottom = 0 }) {
  return (
    <View style={[styles.photoCard, cardShadow, { height: cardHeight, marginBottom, transform: [{ rotate }] }]}>
      <Image source={{ uri: place.image }} style={styles.photoCardImage} />
      <Text style={styles.photoCardName} numberOfLines={1}>{place.name}</Text>
    </View>
  );
}

function CollageSlide({ currentIndex, onFinish }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.slide}>
      <View style={[styles.collageGrid, { paddingTop: insets.top + 16 }]}>
        <View style={styles.collageCol}>
          {LEFT_CARDS.map((c, i) => <PhotoCard key={i} {...c} />)}
        </View>
        <View style={[styles.collageCol, { marginTop: 30 }]}>
          {RIGHT_CARDS.map((c, i) => <PhotoCard key={i} {...c} />)}
        </View>
      </View>

      <SlideBottom
        title={SLIDES[0].title}
        description={SLIDES[0].description}
        isLast={false}
        currentIndex={currentIndex}
        onFinish={onFinish}
      />
    </View>
  );
}

// ─── Slides 2 & 3 — Image top + light bottom ─────────────────────────────────

function ImageSlide({ item, index, currentIndex, onFinish }) {
  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.slide}>
      <View style={styles.imageTop}>
        <Image source={{ uri: item.image }} style={styles.slideImage} />
        <LinearGradient
          colors={['transparent', '#EAF3FD']}
          style={styles.imageFade}
          pointerEvents="none"
        />
      </View>

      <SlideBottom
        title={item.title}
        description={item.description}
        isLast={isLast}
        currentIndex={currentIndex}
        onFinish={onFinish}
      />
    </View>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    setCurrentIndex(index);
  };

  return (
    <FlatList
      data={SLIDES}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      style={{ backgroundColor: '#EAF3FD' }}
      renderItem={({ item, index }) =>
        index === 0
          ? <CollageSlide currentIndex={currentIndex} onFinish={onFinish} />
          : <ImageSlide item={item} index={index} currentIndex={currentIndex} onFinish={onFinish} />
      }
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  slide: {
    width: W,
    height: H,
    backgroundColor: '#EAF3FD',
    flexDirection: 'column',
  },

  // Two-column grid (slide 1)
  collageGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 10,
  },
  collageCol: {
    flex: 1,
    gap: 10,
  },
  photoCard: {
    width: W * 0.44,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 5,
  },
  photoCardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  photoCardName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
    paddingTop: 4,
    paddingLeft: 2,
  },

  // Image slides (2 & 3)
  imageTop: {
    flex: 1,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  // Shared bottom section
  bottom: {
    flex: 1,
    backgroundColor: '#EAF3FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#4A8FE7',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginTop: 12,
  },
  slideDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#4A8FE7',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
