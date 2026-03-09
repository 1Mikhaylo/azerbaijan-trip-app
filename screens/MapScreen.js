import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
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

// Colors
const COLORS = {
  primary: '#1E3A5F',
  accent: '#E63946',
  green: '#00A651',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  darkCard: '#2A2A2A',
  textLight: '#E0E0E0',
  textGray: '#999999',
};

// Marker with Simple Callout (STEP 1 - Testing)
function PlaceMarker({ place, onCalloutPress, onMarkerPress }) {
  return (
    <Marker
      identifier={`place-${place.id}`}
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      onPress={() => onMarkerPress(place)}
    >
      {/* Circle Photo Marker */}
      <View style={styles.markerContainer}>
        <Image
          source={place.photo}
          style={styles.markerImage}
          resizeMode="cover"
        />
      </View>

      {/* Callout - Minimal (Tripomatic Style) */}
      <Callout
        tooltip
        onPress={() => onCalloutPress(place)}
      >
        <View style={styles.calloutContainer}>
          
          {/* Content */}
          <View style={styles.calloutContent}>
            
            {/* Photo */}
            <Image
              source={place.photo}
              style={styles.calloutPhoto}
              resizeMode="cover"
            />

            {/* Info */}
            <View style={styles.calloutInfo}>
              <Text style={styles.calloutName} numberOfLines={2}>
                {place.name}
              </Text>
              <Text style={styles.calloutCity}>
                📍 {place.city}
              </Text>
            </View>

          </View>

        </View>
      </Callout>

    </Marker>
  );
}

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Animate floating card
  useEffect(() => {
    if (selectedPlace) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedPlace]);

  const handleMarkerPress = (place) => {
    console.log('🎯 Marker pressed:', place.name);
    setSelectedPlace(place); // Update bottom sheet immediately
  };

  const handleCalloutPress = (place) => {
    console.log('📍 Callout pressed:', place.name);
    setSelectedPlace(place); // Also update when callout pressed
  };

  const handleFavorite = () => {
    console.log('❤️ Favorite:', selectedPlace.name);
    Alert.alert('Saved!', `${selectedPlace.name} added to favorites`);
  };

  const handleNavigate = () => {
    console.log('🧭 Navigate:', selectedPlace.name);
    Alert.alert('Navigate', `Opening navigation to ${selectedPlace.name}`);
  };

  const handleDetails = () => {
    console.log('➡️ Details:', selectedPlace.name);
    navigation.navigate('PlaceDetail', { place: selectedPlace });
  };

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
          console.log('✅ Map ready');
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
            onMarkerPress={handleMarkerPress}
            onCalloutPress={handleCalloutPress}
          />
        ))}
      </MapView>

      {/* Floating Card with Smooth Animation */}
      {selectedPlace && (
        <Animated.View 
          style={[
            styles.floatingCard,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              console.log('❌ Close pressed');
              setSelectedPlace(null);
            }}
          >
            <Feather name="x" size={20} color={COLORS.textGray} />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.sheetContent}>
            
            {/* Photo */}
            <Image
              source={selectedPlace.photo}
              style={styles.sheetPhoto}
              resizeMode="cover"
            />

            {/* Info */}
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetName} numberOfLines={2}>
                {selectedPlace.name}
              </Text>
              <Text style={styles.sheetCity}>
                📍 {selectedPlace.city}
              </Text>
            </View>

          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleFavorite}
              activeOpacity={0.7}
            >
              <Feather name="heart" size={22} color={COLORS.accent} />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={handleNavigate}
              activeOpacity={0.7}
            >
              <Feather name="navigation" size={22} color={COLORS.green} />
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.detailsBtn]}
              onPress={handleDetails}
              activeOpacity={0.7}
            >
              <Feather name="arrow-right" size={22} color={COLORS.white} />
              <Text style={[styles.buttonText, { color: COLORS.white }]}>Details</Text>
            </TouchableOpacity>

          </View>

        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  
  // Marker
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.white,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  markerImage: {
    width: 50,
    height: 50,
  },

  // Callout - Minimal Tripomatic Style
  calloutContainer: {
    width: 240,
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    padding: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#404040',
  },
  calloutContent: {
    flexDirection: 'row',
    gap: 10,
  },
  calloutPhoto: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  calloutInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  calloutName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 3,
    lineHeight: 16,
  },
  calloutCity: {
    fontSize: 10,
    color: COLORS.textGray,
  },

  // Floating Card - Center (Above Tab Bar)
  floatingCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: COLORS.dark,
    borderRadius: 20,
    padding: 16,
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
  },
  sheetContent: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 14,
    paddingRight: 28,
  },
  sheetPhoto: {
    width: 80,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sheetInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  sheetName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
    lineHeight: 21,
  },
  sheetCity: {
    fontSize: 13,
    color: COLORS.textGray,
    fontWeight: '500',
  },

  // Buttons - Compact
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkCard,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  detailsBtn: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
});