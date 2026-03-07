import { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { places } from '../data/places.js';
import { useTripContext } from '../context/TripContext';

const ACCENT = '#2ecc71';
const CATEGORIES = ['All', 'History', 'Nature', 'City'];
const CARD_HEIGHT = 240;
const CARD_MARGIN = 16;
const CARD_SLOT = CARD_HEIGHT + CARD_MARGIN;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function PopularCard({ item }) {
  return (
    <ImageBackground source={{ uri: item.image }} style={styles.popCard}>
      <TouchableOpacity
        style={styles.popArrowBtn}
        onPress={() => Alert.alert(item.name, 'Coming soon!')}
      >
        <Text style={styles.popArrowText}>↗</Text>
      </TouchableOpacity>
      <Text style={styles.popName}>{item.name}</Text>
    </ImageBackground>
  );
}

function ListCard({ item, scale }) {
  const { toggleFavourite, isFavourite } = useTripContext();
  const fav = isFavourite(item.id);

  return (
    <Animated.View style={[styles.listCardWrapper, { transform: [{ scale }] }]}>
      <ImageBackground source={{ uri: item.image }} style={styles.listCard}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.listGradient}
        >
          <TouchableOpacity
            style={styles.listArrowBtn}
            onPress={() => Alert.alert(item.name, 'Coming soon!')}
          >
            <Text style={styles.listArrowText}>↗</Text>
          </TouchableOpacity>

          <View style={styles.listBottom}>
            <View style={styles.listText}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listDesc} numberOfLines={2}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavourite(item.id)} style={styles.listHeartBtn}>
              <Text style={styles.listHeart}>{fav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

export default function TripsScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [headerHeight, setHeaderHeight] = useState(600);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return places.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  // Per-card scale: each card grows to 1.0 as it enters the center of the screen
  const scaleInterpolations = useMemo(() => {
    return filtered.reduce((acc, item, i) => {
      const cardCenterY = headerHeight + i * CARD_SLOT + CARD_HEIGHT / 2;
      const scrollAtCenter = cardCenterY - SCREEN_HEIGHT / 2;
      acc[item.id] = scrollY.interpolate({
        inputRange: [
          scrollAtCenter - SCREEN_HEIGHT / 2,
          scrollAtCenter,
          scrollAtCenter + SCREEN_HEIGHT / 2,
        ],
        outputRange: [0.92, 1.0, 0.92],
        extrapolate: 'clamp',
      });
      return acc;
    }, {});
  }, [headerHeight, filtered]);

  return (
    <Animated.ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
    >
      {/* Header + Popular — measured so card Y positions are accurate */}
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Azerbaijan</Text>
          <Text style={styles.subtitle}>Where do you want to go?</Text>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.pill, activeCategory === cat && styles.pillActive]}
            >
              <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Popular Places</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularRow}
        >
          {filtered.map((item) => (
            <PopularCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>All Places</Text>
      </View>

      {/* All Places cards */}
      <View style={styles.listSection}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No places match your search.</Text>
        ) : (
          filtered.map((item) => (
            <ListCard
              key={item.id}
              item={item}
              scale={scaleInterpolations[item.id]}
            />
          ))
        )}
      </View>

      <View style={{ height: 32 }} />
    </Animated.ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  android: { elevation: 5 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111',
  },

  // Pills
  pillsRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  pillActive: {
    backgroundColor: ACCENT,
  },
  pillText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  // Popular cards
  popularRow: {
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 28,
  },
  popCard: {
    width: 180,
    height: 240,
    borderRadius: 20,
    justifyContent: 'space-between',
    padding: 12,
    overflow: 'hidden',
    ...cardShadow,
  },
  popArrowBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popArrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // List cards
  listSection: {
    paddingHorizontal: 20,
  },
  listCardWrapper: {
    height: CARD_HEIGHT,
    marginBottom: CARD_MARGIN,
    borderRadius: 20,
    overflow: 'hidden',
    ...cardShadow,
  },
  listCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  listGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  listArrowBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listArrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  listText: {
    flex: 1,
    marginRight: 10,
  },
  listName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  listDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
    marginTop: 3,
  },
  listHeartBtn: {
    padding: 4,
  },
  listHeart: {
    fontSize: 22,
  },

  // Empty
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
