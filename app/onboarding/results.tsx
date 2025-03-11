import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Define types for Smart Home Plans and Products
type Product = {
  name: string;
  price: number;
};

type Plan = {
  name: string;
  description: string;
  products: Product[];
};

const ResultsScreen = () => {
  const router = useRouter();
  const { recommendations } = useLocalSearchParams();
  
  // ✅ Parse recommendations safely
  const parsedRecommendations: Plan[] = recommendations 
    ? JSON.parse(Array.isArray(recommendations) ? recommendations[0] : recommendations)
    : [];

  const [loading, setLoading] = useState<boolean>(false);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [filteredResults, setFilteredResults] = useState<Plan[]>(parsedRecommendations);

  // Save Plan Function
  const savePlan = (plan: Plan) => {
    if (!savedPlans.find(saved => saved.name === plan.name)) {
      setSavedPlans([...savedPlans, plan]);
    }
  };

  // Filter Function (Example: Show Only Security Plans)
  const filterSecurityPlans = () => {
    const filtered = parsedRecommendations.filter(plan => plan.name.includes("Security"));
    setFilteredResults(filtered);
  };

  // Reset Filter
  const resetFilter = () => {
    setFilteredResults(parsedRecommendations);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Recommended Smart Home Plans</Text>

        {/* ✅ Go Back to Survey Button - Fixed Style */}
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.replace('/onboarding/survey')}>
          <Text style={styles.goBackButtonText}>Go Back to Survey</Text>
        </TouchableOpacity>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={filterSecurityPlans}>
            <Text style={styles.filterButtonText}>Show Security Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={resetFilter}>
            <Text style={styles.filterButtonText}>Reset Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#8A82E2" />
        ) : filteredResults.length === 0 ? (
          <Text style={styles.placeholderText}>No recommendations available.</Text>
        ) : (
          filteredResults.map((plan: Plan, index: number) => (
            <View key={index} style={styles.planContainer}>
              <Text style={styles.planTitle}>{plan.name}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              {plan.products.map((product: Product, i: number) => (
                <View key={i} style={styles.productCard}>
                  <Text style={styles.productTitle}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
              ))}

              {/* ✅ Save Plan Button - Changed to Neon Pink */}
              <TouchableOpacity style={styles.saveButton} onPress={() => savePlan(plan)}>
                <Text style={styles.saveButtonText}>Save Plan</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Saved Plans Section */}
        {savedPlans.length > 0 && (
          <>
            <Text style={styles.heading}>Saved Plans</Text>
            {savedPlans.map((plan: Plan, index: number) => (
              <View key={index} style={styles.planContainer}>
                <Text style={styles.planTitle}>{plan.name}</Text>
              </View>
            ))}
          </>
        )}

        {/* Button to Go Back to Home */}
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F24' },

  container: { flex: 1 },

  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 40 },

  heading: { 
    fontSize: 24, 
    color: '#E1E6F9',
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15, 
  },

  placeholderText: { 
    fontSize: 18, 
    color: '#AEB4E8',
    textAlign: 'center', 
    marginTop: 20,
  },

  planContainer: { 
    backgroundColor: '#1A1F3D', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 20,
    shadowColor: '#8A82E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },

  planTitle: { fontSize: 20, color: '#C0C6FF', fontWeight: 'bold' },

  planDescription: { color: '#AEB4E8', marginBottom: 10 },

  productCard: { 
    backgroundColor: '#2A2F4D', 
    padding: 10, 
    marginTop: 10, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0, 
    shadowRadius: 0,
    elevation: 0,
  },

  productTitle: { color: '#FFF', fontWeight: 'bold' },

  productPrice: { color: '#8A82E2', fontWeight: 'bold' },

  /* ✅ Fix: Added "button" and "buttonText" styles */
  button: { 
    backgroundColor: '#8A82E2', 
    padding: 15, 
    marginTop: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    shadowColor: '#8A82E2', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },

  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold',
  },

  goBackButton: { 
    backgroundColor: '#3A437E', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 15,
    shadowColor: '#8A82E2', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 7,
  },

  goBackButtonText: { 
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  filterContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },

  filterButton: { 
    backgroundColor: '#3A437E', 
    padding: 8, 
    borderRadius: 8, 
    marginHorizontal: 5,
    shadowColor: '#8A82E2', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 7,
  },

  filterButtonText: { color: '#FFFFFF' },

  saveButton: { 
    backgroundColor: '#FF007F', 
    padding: 10, 
    borderRadius: 10, 
    marginTop: 10, 
    alignItems: 'center',
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },

  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
});

export default ResultsScreen;
