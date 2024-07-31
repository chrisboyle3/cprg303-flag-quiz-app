import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Country {
  name: {common: string;};
  flags: {png: string;};
}

interface QuizQuestion {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
}

interface QuizResult {
  flagUrl: string;
  correctAnswer: string;
  userAnswer: string;
}

export default function QuizScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]|null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const router = useRouter();
  const { restart } = useLocalSearchParams<{ restart: string }>();

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      resetQuiz();
    }
  }, [countries, restart]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizResults([]);
    generateQuiz();
  };

  const handleStartOver = () => {
    resetQuiz();
  };

  const handleBackToIndex = () => {
    router.replace('/screens/index');
  }

  const fetchCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setLoading(false);
      });
  };

  const generateQuiz = () => {
    const quiz: QuizQuestion[] = [];
    const usedCountries = new Set<string>();

    for (let i = 0; i < 10; i++) {
      let correctCountry: Country;
      do { correctCountry = countries[Math.floor(Math.random() * countries.length)]; } 
      while (usedCountries.has(correctCountry.name.common));

      usedCountries.add(correctCountry.name.common);

      const options = [correctCountry.name.common];
      while (options.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry.name.common)) {
          options.push(randomCountry.name.common);
        }
      }

      quiz.push({
        flagUrl: correctCountry.flags.png,
        options: shuffleArray(options),
        correctAnswer: correctCountry.name.common,
      });
    }

    setCurrentQuiz(quiz);
  };

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentQuiz) {
      const currentQuizQuestion = currentQuiz[currentQuestion];
      const isCorrect = selectedAnswer === currentQuizQuestion.correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
      }

      setQuizResults([...quizResults, {
        flagUrl: currentQuizQuestion.flagUrl,
        correctAnswer: currentQuizQuestion.correctAnswer,
        userAnswer: selectedAnswer
      }]);

      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1);
      } 
      else {
        router.push({
          pathname: '/screens/results',
          params: {
            score: (score + (isCorrect ? 1 : 0)).toString(),
            results: JSON.stringify([...quizResults, {
              flagUrl: currentQuizQuestion.flagUrl,
              correctAnswer: currentQuizQuestion.correctAnswer,
              userAnswer: selectedAnswer
            }])
          }
        });
      }
    }
  };

  if (loading || !currentQuiz) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#118DF0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.quizContainer}>
        <Text style={styles.questionNumber}>Question {currentQuestion + 1} / 10</Text>
        <View style={styles.flagContainer}>
          <Image source={{ uri: currentQuiz[currentQuestion].flagUrl }} style={styles.flagImage} />
        </View>
        {currentQuiz[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}>
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>        
        <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
          <Text style={styles.buttonText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF713E',
  },
  quizContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  questionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#118DF0',
    marginBottom: 20,
  },
  flagContainer: {
    borderWidth: 3,
    borderColor: '#118DF0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  flagImage: {
    width: 250,
    height: 150,
  },
  optionButton: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#118DF0',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {    
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },  
  startOverButton: {
    backgroundColor: '#FFA03E',
    padding: 15,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    elevation: 3,
  },
});