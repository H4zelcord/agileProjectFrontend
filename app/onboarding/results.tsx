import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ResultsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Temporary placeholder to simulate loading state
    const fetchRecommendations = async () => {
      setLoading(true);

      // 🚀 Later, replace this with a real API call to the backend
      setTimeout(() => {
        setRecommendations([]); // Keep empty for now until backend is ready
        setLoading(false);
      }, 1500);
    };

    fetchRecommendations();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Recommended Solutions</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#8A82E2" />
        ) : recommendations.length === 0 ? (
          <Text style={styles.placeholderText}>No recommendations yet. Please check back later.</Text>
        ) : (
          recommendations.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40, // ✅ Ensures the title is fully visible
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    color: '#E1E6F9',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#AEB4E8',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1A1F3D',
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    color: '#C0C6FF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#AEB4E8',
  },
  button: {
    backgroundColor: '#8A82E2',
    padding: 15,
    marginTop: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;
