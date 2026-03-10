import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import places from '../data/places';

const { width } = Dimensions.get('window');

// ─── Design System ────────────────────────────────────────────────────────────
const COLORS = {
  primary:    '#1A56DB',   // Azerbaijan blue
  accent:     '#E63946',
  green:      '#00A651',
  white:      '#FFFFFF',
  dark:       '#111111',
  card:       '#1C1C1E',
  border:     '#2C2C2E',
  textLight:  '#F2F2F7',
  textGray:   '#8E8E93',
};

// ─── Map Style ────────────────────────────────────────────────────────────────
const darkMapStyle = [
  { elementType: 'geometry',            stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill',    stylers: [{ color: '#6b6b6b' }] },
  { elementType: 'labels.text.stroke',  stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
  { featureType: 'road',  elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'poi',   elementType: 'geometry', stylers: [{ color: '#222222' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ffffff' }, { weight: 1.5 }],
  },
];

const AZERBAIJAN_BOUNDS = {
  northEast: { latitude: 41.9, longitude: 50.6 },
  southWest: { latitude: 38.4, longitude: 44.8 },
};

const bakuPlaces = places.filter(p => p.city === 'Baku');

// ─── Marker Component ─────────────────────────────────────────────────────────
function PlaceMarker({ place, isSelected, onPress }) {
  const [tracks, setTracks] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Marker
      identifier={`place-${place.id}`}
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={() => onPress(place)}
      onSelect={() => onPress(place)}
      tracksViewChanges={tracks}
    >
      <View style={[styles.marker, isSelected && styles.markerSelected]}>
        <Image source={place.photo} style={styles.markerImage} resizeMode="cover" />
      </View>
      <Callout tooltip>
        <View style={{ width: 1, height: 1 }} />
      </Callout>
    </Marker>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedPlace) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedPlace]);

  const [saved, setSaved]       = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleMarkerPress = (place) => {
    setSaved(false);
    setBookmarked(false);
    setSelectedPlace(place);
  };
  const handleClose = () => setSelectedPlace(null);

  const handleDetailPanel = () =>
    navigation.navigate('PlaceDetail', { place: selectedPlace });

  const handleSave = () => setSaved(v => !v);
  const handleBookmark = () => setBookmarked(v => !v);
  const handleExpand = () =>
    navigation.navigate('PlaceDetail', { place: selectedPlace });
  const handleMore = () => {
    // Placeholder — More options sheet (Sprint 3)
  };

  return (
    <View style={styles.container}>

      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        minZoomLevel={7}
        maxZoomLevel={18}
        initialRegion={{
          latitude: 40.37,
          longitude: 49.84,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        onMapReady={() =>
          mapRef.current?.setMapBoundaries(
            AZERBAIJAN_BOUNDS.northEast,
            AZERBAIJAN_BOUNDS.southWest,
          )
        }
        onPress={handleClose}
      >
        {bakuPlaces.map(place => (
          <PlaceMarker
            key={place.id}
            place={place}
            isSelected={selectedPlace?.id === place.id}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* ── Floating Card ── */}
      {selectedPlace && (
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Photo + Blue Arrow */}
          <View style={styles.photoWrapper}>
            <Image
              source={selectedPlace.photo}
              style={styles.photo}
              resizeMode="cover"
            />

            {/* ↗ Blue arrow → Detail Panel */}
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handleDetailPanel}
              activeOpacity={0.85}
            >
              <Feather name="arrow-up-right" size={18} color={COLORS.white} />
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Feather name="x" size={16} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          {/* Place Info */}
          <View style={styles.info}>
            <Text style={styles.placeName} numberOfLines={1}>
              {selectedPlace.name}
            </Text>
            <Text style={styles.placeCity}>
              📍 {selectedPlace.city}
            </Text>
          </View>

          {/* Add to Trip — Primary CTA */}
          <TouchableOpacity style={styles.addTripBtn} activeOpacity={0.85}>
            <Feather name="plus-circle" size={18} color={COLORS.white} />
            <Text style={styles.addTripText}>Add to Trip</Text>
          </TouchableOpacity>

          {/* Icon Row */}
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleSave} activeOpacity={0.7}>
              <Feather name="heart" size={20} color={saved ? COLORS.accent : COLORS.textGray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleBookmark} activeOpacity={0.7}>
              <Feather name="bookmark" size={20} color={bookmarked ? COLORS.primary : COLORS.textGray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleExpand} activeOpacity={0.7}>
              <Feather name="minimize-2" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleMore} activeOpacity={0.7}>
              <Feather name="more-horizontal" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

        </Animated.View>
      )}

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  map:       { flex: 1 },

  // Marker
  marker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderColor: COLORS.white,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  markerSelected: {
    borderColor: COLORS.primary,
    borderWidth: 3,
    transform: [{ scale: 1.12 }],
  },
  markerImage: { width: 46, height: 46 },

  // Card
  card: {
    position: 'absolute',
    bottom: 105,
    left: 14,
    right: 14,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    // Android
    elevation: 30,
  },

  // Photo
  photoWrapper: {
    width: '100%',
    height: 180,
  },
  photo: {
    width: '100%',
    height: '100%',
  },

  // ↗ Blue Arrow Button
  arrowBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },

  // Close Button
  closeBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info
  info: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  placeCity: {
    fontSize: 13,
    color: COLORS.textGray,
  },

  // Add to Trip CTA
  addTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    marginBottom: 14,
  },
  addTripText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Icon Row
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  iconBtn: {
    width: 48,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});