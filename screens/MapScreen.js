import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import places from '../data/places';

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#383838' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#ffffff' }, { weight: 1.5 }] },
];

const AZERBAIJAN_BOUNDS = {
  northEast: { latitude: 41.9, longitude: 50.6 },
  southWest: { latitude: 38.4, longitude: 44.8 },
};

const bakuPlaces = places.filter((place) => place.city === 'Baku');

// Separate component for each marker so it manages its own loaded state
function PlaceMarker({ place, isSelected, onPress }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Marker
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={!loaded}
    >
      <View style={[
        styles.markerContainer,
        isSelected && styles.markerSelected
      ]}>
        <Image
          source={place.photo}
          style={styles.markerImage}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
        />
      </View>
    </Marker>
  );
}

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <View style={styles.container}>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        minZoomLevel={7}
        maxZoomLevel={18}
        initialRegion={{
          latitude: 40.3700,
          longitude: 49.8400,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        onMapReady={() => {
          mapRef.current.setMapBoundaries(
            AZERBAIJAN_BOUNDS.northEast,
            AZERBAIJAN_BOUNDS.southWest
          );
        }}
      >
        {bakuPlaces.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            isSelected={selectedPlace?.id === place.id}
            onPress={() => setSelectedPlace(place)}
          />
        ))}
      </MapView>

      {/* Mini Card */}
      {selectedPlace && (
        <View style={styles.card}>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPlace(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Photo + Info Row */}
          <View style={styles.cardRow}>
            <Image
              source={selectedPlace.photo}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{selectedPlace.name}</Text>
              <Text style={styles.cardCity}>📍 {selectedPlace.city}</Text>
            </View>
          </View>

          {/* Buttons Row */}
          <View style={styles.cardButtons}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>❤️ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate('PlaceDetail', { place: selectedPlace })}
            >
              <Text style={styles.seeMoreButtonText}>See More →</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerSelected: {
    borderColor: '#e63946',
    borderWidth: 3,
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 1,
  },
  closeText: {
    color: '#aaaaaa',
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardCity: {
    color: '#aaaaaa',
    fontSize: 13,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#e63946',
    fontWeight: 'bold',
  },
  seeMoreButton: {
    flex: 1,
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  seeMoreButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});