import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { RadioButton } from 'react-native-paper';

const SurveyScreen = () => {
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
    { question: "Do you want to integrate a specific smart home system?", options: ["Google Home", "Apple HomeKit", "Amazon Alexa", "Samsung SmartThings", "I’m not sure"] },
    { question: "Where do you usually get information about smart home products?", options: ["Online reviews and ratings", "YouTube videos", "Recommendations from friends/family", "In-store advisors", "Other"] }
  ];
  
  const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});
  const [animations] = useState(questions.map(() => new Animated.Value(1)));

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedValues(prev => ({ ...prev, [questionIndex]: option }));

    Animated.sequence([
      Animated.timing(animations[questionIndex], { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(animations[questionIndex], { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const handleSubmit = () => {
    console.log('Survey Submitted:', selectedValues);
  };

  const progress = Object.keys(selectedValues).length / questions.length;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Progress Bar */}
        <View style={styles.header}>
          <Text style={styles.progressText}>{`Progress: ${Math.round(progress * 100)}%`}</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Questions */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {questions.map((q, index) => (
            <Animated.View
              key={index}
              style={[
                styles.questionContainer,
                { transform: [{ scale: animations[index] }] }
              ]}
            >
              <Text style={styles.questionText}>{`${index + 1}. ${q.question}`}</Text>
              <RadioButton.Group
                onValueChange={(newValue) => handleOptionSelect(index, newValue)}
                value={selectedValues[index]}
              >
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

        {/* Fixed Submit Button */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Survey</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#0A0F24',
  },
  progressText: {
    color: '#E1E6F9',
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#1A1F3D',
    borderRadius: 5,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#8A82E2',
    borderRadius: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 200, // More space at the bottom so nothing is squished
},
  questionContainer: {
    marginBottom: 20,
    backgroundColor: '#1A1F3D',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#E1E6F9',
    fontWeight: 'bold',
  },
  optionText: {
    color: '#C0C6FF',
    fontSize: 16,
  },
  submitButtonContainer: {
    padding: 20,
    paddingBottom: 70, // Increase this to lift it higher above the tab bar
    backgroundColor: '#0A0F24',
},
  submitButton: {
    backgroundColor: '#8A82E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SurveyScreen;
