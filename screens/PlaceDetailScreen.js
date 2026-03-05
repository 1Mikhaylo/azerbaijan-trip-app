import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;

  return (
    <ScrollView style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Place Name */}
      <Text style={styles.name}>{place.name}</Text>

      {/* City */}
      <Text style={styles.city}>📍 {place.city}</Text>

      {/* Description */}
      <Text style={styles.description}>{place.description}</Text>

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
    padding: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
  },
  name: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  city: {
    color: '#aaaaaa',
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    color: '#cccccc',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});