import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Brain, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ParticlesBackground from '@/components/ParticlesBackground';

interface Question {
  id: number;
  text: string;
  emoji: string;
  options: { text: string; value: number; emoji: string }[];
}

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const questions: Question[] = [
    {
      id: 1,
      text: "How are you feeling overall today?",
      emoji: "🌅",
      options: [
        { text: "Great", value: 5, emoji: "😊" },
        { text: "Good", value: 4, emoji: "🙂" },
        { text: "Okay", value: 3, emoji: "😐" },
        { text: "Not good", value: 2, emoji: "😔" },
        { text: "Terrible", value: 1, emoji: "😢" }
      ]
    },
    {
      id: 2,
      text: "How well did you sleep last night?",
      emoji: "🌙",
      options: [
        { text: "Very well", value: 5, emoji: "😴" },
        { text: "Well", value: 4, emoji: "😊" },
        { text: "Okay", value: 3, emoji: "😐" },
        { text: "Poorly", value: 2, emoji: "😪" },
        { text: "Very poorly", value: 1, emoji: "😵" }
      ]
    },
    {
      id: 3,
      text: "How is your energy level?",
      emoji: "⚡",
      options: [
        { text: "Very high", value: 5, emoji: "🚀" },
        { text: "High", value: 4, emoji: "💪" },
        { text: "Normal", value: 3, emoji: "😐" },
        { text: "Low", value: 2, emoji: "😴" },
        { text: "Very low", value: 1, emoji: "🪫" }
      ]
    },
    {
      id: 4,
      text: "How stressed do you feel?",
      emoji: "🎯",
      options: [
        { text: "Not at all", value: 5, emoji: "😌" },
        { text: "A little", value: 4, emoji: "🙂" },
        { text: "Moderately", value: 3, emoji: "😐" },
        { text: "Very", value: 2, emoji: "😰" },
        { text: "Extremely", value: 1, emoji: "😱" }
      ]
    },
    {
      id: 5,
      text: "How connected do you feel to others?",
      emoji: "🤝",
      options: [
        { text: "Very connected", value: 5, emoji: "🥰" },
        { text: "Connected", value: 4, emoji: "😊" },
        { text: "Neutral", value: 3, emoji: "😐" },
        { text: "Disconnected", value: 2, emoji: "😔" },
        { text: "Very isolated", value: 1, emoji: "😢" }
      ]
    },
    {
      id: 6,
      text: "How hopeful do you feel about the future?",
      emoji: "🌟",
      options: [
        { text: "Very hopeful", value: 5, emoji: "✨" },
        { text: "Hopeful", value: 4, emoji: "😊" },
        { text: "Neutral", value: 3, emoji: "😐" },
        { text: "Pessimistic", value: 2, emoji: "😟" },
        { text: "Hopeless", value: 1, emoji: "😰" }
      ]
    },
    {
      id: 7,
      text: "How is your appetite?",
      emoji: "🍎",
      options: [
        { text: "Very good", value: 5, emoji: "😋" },
        { text: "Good", value: 4, emoji: "😊" },
        { text: "Normal", value: 3, emoji: "😐" },
        { text: "Poor", value: 2, emoji: "😔" },
        { text: "Very poor", value: 1, emoji: "😰" }
      ]
    },
    {
      id: 8,
      text: "How well can you concentrate?",
      emoji: "🧠",
      options: [
        { text: "Very well", value: 5, emoji: "🎯" },
        { text: "Well", value: 4, emoji: "😊" },
        { text: "Okay", value: 3, emoji: "😐" },
        { text: "Poorly", value: 2, emoji: "😵‍💫" },
        { text: "Very poorly", value: 1, emoji: "😴" }
      ]
    },
    {
      id: 9,
      text: "How much do you enjoy activities you used to love?",
      emoji: "🎨",
      options: [
        { text: "Just as much", value: 5, emoji: "🥰" },
        { text: "Quite a bit", value: 4, emoji: "😊" },
        { text: "Somewhat", value: 3, emoji: "😐" },
        { text: "Very little", value: 2, emoji: "😔" },
        { text: "Not at all", value: 1, emoji: "😢" }
      ]
    },
    {
      id: 10,
      text: "How would you rate your overall mental wellbeing?",
      emoji: "💚",
      options: [
        { text: "Excellent", value: 5, emoji: "🌟" },
        { text: "Good", value: 4, emoji: "😊" },
        { text: "Fair", value: 3, emoji: "😐" },
        { text: "Poor", value: 2, emoji: "😔" },
        { text: "Very poor", value: 1, emoji: "😰" }
      ]
    }
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      const averageScore = totalScore / questions.length;
      
      // Store sentiment score in localStorage
      const sentimentData = {
        score: averageScore,
        totalScore,
        timestamp: new Date().toISOString(),
        answers: newAnswers
      };
      
      localStorage.setItem('sentimentScore', JSON.stringify(sentimentData));
      setIsCompleted(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const getSentimentLevel = (score: number) => {
    if (score >= 4) return { level: 'Positive', color: 'bg-green-500', emoji: '😊' };
    if (score >= 3) return { level: 'Neutral', color: 'bg-blue-500', emoji: '😐' };
    return { level: 'Needs Support', color: 'bg-orange-500', emoji: '🤗' };
  };

  const progress = ((currentQuestion + (isCompleted ? 1 : 0)) / questions.length) * 100;

  if (isCompleted) {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const averageScore = totalScore / questions.length;
    const sentiment = getSentimentLevel(averageScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="MindCare AI Logo" 
                  className="w-12 h-12 object-contain mr-3"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Assessment Complete
                </h1>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl">{sentiment.emoji}</div>
              <Badge className={`${sentiment.color} text-white text-lg px-4 py-2`}>
                {sentiment.level}
              </Badge>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for completing the assessment. We're now connecting you to our platform.
              </p>
              <div className="text-sm text-gray-500">
                Redirecting to login...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="absolute top-4 right-4"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="MindCare AI Logo" 
              className="w-12 h-12 object-contain mr-3"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MindCare AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI-powered mental health companion. Let's start with a quick assessment to understand how you're feeling.
          </p>
        </div>

        <Card className="w-full max-w-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">Mental Health Assessment</CardTitle>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-4xl mb-4">{question.emoji}</span>
              <h3 className="text-xl font-semibold mt-2">{question.text}</h3>
            </div>
            
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswer(option.value)}
                  className="p-4 h-auto text-left justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="text-lg">{option.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
