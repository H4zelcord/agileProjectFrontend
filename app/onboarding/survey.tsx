import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { RadioButton, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const questions = [
  { question: "What type of home do you live in?", options: ["Apartment", "Detached house", "Villa", "Dormitory/Rented room", "Other"] },
  { question: "What is your primary smart home need?", options: ["Security", "Energy saving", "Comfort and automation", "Entertainment and multimedia", "Other"] },
  { question: "Which security features are most important to you?", options: ["Smart security cameras", "Smart locks and access control", "Motion sensors and alarm systems", "Smoke, gas, and water leak detectors", "Other"] },
  { question: "What are your lighting preferences?", options: ["Smart bulbs with color-changing options", "Motion-sensor lighting", "Lights that turn on/off automatically based on schedule", "Smart switches and dimmers", "Other"] },
  { question: "Which energy management solutions interest you the most?", options: ["Smart plugs and energy monitors", "Solar panels and battery systems", "Smart thermostats", "Smart irrigation systems", "Other"] },
  { question: "Which smart home devices do you already use?", options: ["Smart speakers (Alexa, Google Home, Siri)", "Smart TV", "Smart plugs and switches", "Smart security systems", "None"] },
  { question: "Do you use a voice assistant?", options: ["Yes, Alexa", "Yes, Google Assistant", "Yes, Siri", "No, I don’t use any"] },
  { question: "What type of connectivity do you prefer for your smart home system?", options: ["Wi-Fi", "Bluetooth", "Zigbee/Z-Wave", "Ethernet (Wired)", "I’m not sure"] },
  { question: "What is your budget for smart home solutions?", options: ["$0 - $50", "$50 - $250", "$250 - $500", "$500+"] },
  { question: "How do you prefer to control your smart home devices?", options: ["Mobile app", "Voice assistant", "Remote control", "Manual switches"] },
  { question: "Which devices do you want to use to manage your smart home system?", options: ["Smartphone", "Tablet", "Computer", "Smartwatch"] },
  { question: "What is the most important factor for you when choosing a smart home product?", options: ["Ease of use", "Wide device compatibility", "Energy efficiency", "Price-performance balance"] },
  { question: "Which brands do you currently own in your home?", options: ["Apple", "Samsung", "Xiaomi", "Philips Hue", "Other"] },
  { question: "Do you want to integrate a specific smart home system?", options: ["Google Home", "Apple HomeKit", "Amazon Alexa", "Samsung SmartThings", "I’m not sure"] }
];

const SurveyScreen = () => {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});
  const [animations] = useState(questions.map(() => new Animated.Value(1)));
  const [progress, setProgress] = useState(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const answered = Object.keys(selectedValues).length;
    const calculatedProgress = answered / questions.length;
    Animated.timing(animatedProgress, { toValue: calculatedProgress, duration: 500, useNativeDriver: false }).start();
  }, [selectedValues]);

  useEffect(() => {
    const listener = animatedProgress.addListener(({ value }) => setProgress(value));
    return () => animatedProgress.removeListener(listener);
  }, []);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedValues(prev => ({ ...prev, [questionIndex]: option }));
    Animated.sequence([
      Animated.timing(animations[questionIndex], { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(animations[questionIndex], { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedValues).length !== questions.length) {
      Alert.alert("Incomplete Survey", "Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await fetch("http://your-backend-url/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedValues),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();
      router.push({ pathname: "/onboarding/results", params: { recommendations: JSON.stringify(data.plans) } });

    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Backend Not Ready", "Using mock recommendations instead.");

      const mockData = [
        { name: "Smart Security Package", description: "Protect your home with these security essentials.", products: [{ name: "Ring Video Doorbell", price: 199 }, { name: "August Smart Lock", price: 149 }] },
        { name: "Energy Efficiency Plan", description: "Lower your energy bills with these smart devices.", products: [{ name: "Nest Smart Thermostat", price: 249 }, { name: "TP-Link Smart Plug", price: 25 }] }
      ];

      router.push({ pathname: "/onboarding/results", params: { recommendations: JSON.stringify(mockData) } });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.progressText}>{`Progress: ${(progress * 100).toFixed(0)}%`}</Text>
      <ProgressBar progress={progress} color="#8A82E2" style={styles.progressBar} />

      <ScrollView contentContainerStyle={styles.container}>
        {questions.map((q, index) => (
          <Animated.View key={index} style={[styles.questionContainer, { transform: [{ scale: animations[index] }] }]}>
            <Text style={styles.questionText}>{`${index + 1}. ${q.question}`}</Text>
            <RadioButton.Group onValueChange={(newValue) => handleOptionSelect(index, newValue)} value={selectedValues[index]}>
              {q.options.map((option, idx) => (
                <RadioButton.Item 
                  key={idx} 
                  label={option} 
                  value={option} 
                  labelStyle={styles.optionText} 
                  color="#8A82E2"
                  uncheckedColor="#555555" 
                  mode="android"
                />
              ))}
            </RadioButton.Group>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Survey</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0F24' },
  progressText: { fontSize: 16, color: '#E1E6F9', margin: 10, fontWeight: 'bold' },
  progressBar: { height: 8, marginHorizontal: 20, borderRadius: 5, backgroundColor: '#3A437E' },
  container: { padding: 20, paddingBottom: 100 },
  questionContainer: {
    backgroundColor: '#1A1F3D', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 20, 
    shadowColor: '#8A82E2',
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  questionText: { fontSize: 18, color: '#E1E6F9', fontWeight: 'bold' },
  optionText: { color: '#C0C6FF', fontSize: 16 },
  radioItem: {
    backgroundColor: '#2A2F4D',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5
  },
  submitButton: {
    backgroundColor: '#8A82E2', 
    padding: 15, 
    margin: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    shadowColor: '#8A82E2',
    shadowOpacity: 0.7,
    shadowRadius: 10
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});


export default SurveyScreen;
