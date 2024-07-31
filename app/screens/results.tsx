import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface QuizResult {
  flagUrl: string;
  correctAnswer: string;
  userAnswer: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { score, results } = useLocalSearchParams<{ score: string, results: string }>();
  const quizResults: QuizResult[] = JSON.parse(results || '[]');

  const handlePlayAgain = () => {
    router.replace({
      pathname: '/screens/quiz',
      params: { restart: 'true' }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Quiz Results</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Your score: {score} / 10</Text>
        </View>
       
        {quizResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <Image source={{ uri: result.flagUrl }} style={styles.flagImage} />
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Correct: {result.correctAnswer}</Text>
              <Text style={[styles.answerText, { color: result.userAnswer === result.correctAnswer ? '#4CAF50' : '#F44336' }]}>
                Your answer: {result.userAnswer}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePlayAgain}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF713E',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#118DF0',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  flagImage: {
    width: 80,
    height: 48,
    marginRight: 15,
    borderRadius: 5,
  },
  answerContainer: {
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#118DF0',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});