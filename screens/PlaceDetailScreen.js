import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';

export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;

  // Split description into paragraphs
  const paragraphs = place.detailedDescription
    ? place.detailedDescription.split('\n\n')
    : [place.description];

  const openWikipedia = () => {
    if (place.wikipediaLink) {
      Linking.openURL(place.wikipediaLink);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Place Photo */}
      <Image
        source={place.photo}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Place Name */}
      <Text style={styles.name}>{place.name}</Text>

      {/* City */}
      <Text style={styles.city}>📍 {place.city}</Text>

      {/* Paragraphs */}
      {paragraphs.map((para, index) => (
        <Text key={index} style={styles.paragraph}>{para}</Text>
      ))}

      {/* Wikipedia Button */}
      {place.wikipediaLink && (
        <TouchableOpacity
          style={styles.wikiButton}
          onPress={openWikipedia}
        >
          <Text style={styles.wikiButtonText}>📖 Read on Wikipedia</Text>
        </TouchableOpacity>
      )}

      {/* Save to My Trip Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>❤️ Save to My Trip</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
  },
  photo: {
    width: '100%',
    height: 250,
  },
  name: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 20,
  },
  city: {
    color: '#aaaaaa',
    fontSize: 15,
    marginTop: 6,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  paragraph: {
    color: '#cccccc',
    fontSize: 15,
    lineHeight: 26,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  wikiButton: {
    backgroundColor: '#2a2a2a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  wikiButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});