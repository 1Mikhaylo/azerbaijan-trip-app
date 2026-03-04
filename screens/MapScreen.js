import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
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

// Azerbaijan boundaries
const AZERBAIJAN_BOUNDS = {
  northEast: { latitude: 41.9, longitude: 50.6 },
  southWest: { latitude: 38.4, longitude: 44.8 },
};

// Only Baku locations for now
const bakuPlaces = places.filter((place) => place.city === 'Baku');

export default function MapScreen() {
  const mapRef = useRef(null);

  return (
    <View style={styles.container}>
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
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.city}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});