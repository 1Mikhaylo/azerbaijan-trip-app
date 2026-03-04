import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { places } from '../data/places.js';
import { useTripContext } from '../context/TripContext';

const { height } = Dimensions.get('window');

function PlaceCard({ item }) {
  const { toggleFavourite, isFavourite } = useTripContext();
  const fav = isFavourite(item.id);

  return (
    <ImageBackground source={{ uri: item.image }} style={styles.card}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.gradient}
      >
        <View style={styles.cardBottom}>
          <View style={styles.cardText}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeCategory}>{item.category}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavourite(item.id)} style={styles.heartBtn}>
            <Text style={styles.heartIcon}>{fav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

export default function TripsScreen() {
  const { isFavourite } = useTripContext();
  const [filter, setFilter] = useState('All');

  const displayed = filter === 'Favourites' ? places.filter((p) => isFavourite(p.id)) : places;

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {['All', 'Favourites'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlaceCard item={item} />}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favourites yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  filters: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    zIndex: 10,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  card: {
    width: '100%',
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  cardText: {
    flex: 1,
    marginRight: 16,
  },
  placeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeCategory: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heartBtn: {
    padding: 8,
  },
  heartIcon: {
    fontSize: 32,
  },
  emptyContainer: {
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
