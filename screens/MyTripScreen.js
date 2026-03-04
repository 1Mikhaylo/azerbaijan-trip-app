import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { places } from '../data/places.js';
import { useTripContext } from '../context/TripContext';

export default function TripsScreen() {
  const { toggleFavourite, isFavourite } = useTripContext();
  const [filter, setFilter] = useState('All');

  const displayed = filter === 'Favourites' ? places.filter((p) => isFavourite(p.id)) : places;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trip</Text>

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
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
              <Text style={styles.heart}>{isFavourite(item.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No favourites yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterBtnActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemCategory: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  heart: {
    fontSize: 22,
    marginLeft: 12,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 15,
  },
});
