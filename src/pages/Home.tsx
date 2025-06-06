
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mic, MicOff, Send, Volume2, VolumeX, Menu, User, Moon, Sun, Home as HomeIcon, MessageCircle, Users, Star, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Navigation from '@/components/Navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [currentMood, setCurrentMood] = useState<string>('neutral');
  const [showDistressModal, setShowDistressModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSpokenWelcome = useRef(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Critical distress phrases to detect
  const distressPhrases = [
    "I'm tired of everything",
    "I feel empty", 
    "What's the point?",
    "I'm broken",
    "I don't care anymore",
    "No one understands me",
    "I just want it all to stop",
    "I'm worthless",
    "I hate myself",
    "It hurts too much"
  ];

  const detectDistressPhrase = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return distressPhrases.some(phrase => 
      lowerMessage.includes(phrase.toLowerCase())
    );
  };

  const handleDistressDetection = () => {
    // Log the distress detection for counselor analysis
    const distressLog = {
      userId: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      triggerMessage: inputValue,
      redirected: true
    };
    
    // Store in localStorage for now (in real app, would send to backend)
    const existingLogs = JSON.parse(localStorage.getItem('distressLogs') || '[]');
    existingLogs.push(distressLog);
    localStorage.setItem('distressLogs', JSON.stringify(existingLogs));

    setShowDistressModal(true);
    
    // Redirect after modal is shown
    setTimeout(() => {
      navigate('/counselor');
    }, 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Optimized voice welcome message - only plays once per session
  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello ${user?.name || 'there'}! I'm your AI mental health companion. How are you feeling today? Feel free to share what's on your mind, and I'll do my best to support you.`,
      sender: 'ai',
      timestamp: new Date(),
      sentiment: 'positive'
    };
    setMessages([welcomeMessage]);

    // Speak welcome message only once per session
    if (speechEnabled && !hasSpokenWelcome.current) {
      setTimeout(() => {
        speakText(welcomeMessage.text);
        hasSpokenWelcome.current = true;
      }, 500);
    }

    // Cleanup function to stop any ongoing speech
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [user?.name, speechEnabled]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      // Add error handling
      utterance.onerror = (event) => {
        console.log('Speech synthesis error:', event);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'excited', 'joy', 'love', 'fantastic', 'excellent', 'better', 'improvement'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'depressed', 'anxious', 'worried', 'stressed', 'hurt', 'pain', 'cry', 'hopeless', 'alone', 'scared'];
    
    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  };

  const generateAIResponse = (userMessage: string, sentiment: 'positive' | 'neutral' | 'negative'): string => {
    const responses = {
      positive: [
        "That's wonderful to hear! I'm so glad you're feeling good. What's been helping you feel this way?",
        "It sounds like you're in a really positive space right now. That's amazing! Keep embracing those good feelings.",
        "I love hearing that you're doing well! Your positive energy is contagious."
      ],
      neutral: [
        "Thank you for sharing that with me. Can you tell me more about what's on your mind?",
        "I hear you. Sometimes it's okay to feel neutral - it's all part of the human experience. What would help you feel a bit better?",
        "I appreciate you opening up to me. What's one small thing that might brighten your day?"
      ],
      negative: [
        "I'm really sorry you're going through a difficult time. Your feelings are valid, and I'm here to support you. What's been weighing on your mind?",
        "It sounds like you're struggling right now, and that must be really hard. Remember, you're not alone in this. Would you like to talk about what's been difficult?",
        "Thank you for trusting me with how you're feeling. It takes courage to share when we're struggling. How can I best support you right now?"
      ]
    };

    // Check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'disappear', 'hopeless', 'can\'t go on'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
    
    if (hasCrisisKeyword) {
      // Store flag for potential counselor referral
      localStorage.setItem('needsCounselor', 'true');
      return "I'm very concerned about what you've shared with me. Your life has value, and there are people who want to help. Would you like me to connect you with a professional counselor who can provide immediate support? You don't have to go through this alone.";
    }

    const responseArray = responses[sentiment];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Check for distress phrases before processing
    if (detectDistressPhrase(inputValue)) {
      handleDistressDetection();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const sentiment = analyzeSentiment(inputValue);
    setCurrentMood(sentiment);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: generateAIResponse(inputValue, sentiment),
      sender: 'ai',
      timestamp: new Date(),
      sentiment
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    
    // Speak AI response with delay
    setTimeout(() => {
      if (speechEnabled) {
        speakText(aiResponse.text);
      }
    }, 500);

    setInputValue('');
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const getMoodBadge = () => {
    const moodConfig = {
      positive: { color: 'bg-green-500', text: 'Positive', emoji: '😊' },
      neutral: { color: 'bg-blue-500', text: 'Neutral', emoji: '😐' },
      negative: { color: 'bg-orange-500', text: 'Needs Support', emoji: '🤗' }
    };

    const config = moodConfig[currentMood as keyof typeof moodConfig] || moodConfig.neutral;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.emoji} {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <Navigation />
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:block">
              <Navigation />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindCare AI
              </div>
              {getMoodBadge()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title={speechEnabled ? 'Disable speech' : 'Enable speech'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="w-full h-[600px] flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                  AI
                </AvatarFallback>
              </Avatar>
              <span>AI Mental Health Companion</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gray-500 text-white text-sm">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share what's on your mind..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={isListening ? 'bg-red-500 text-white' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {localStorage.getItem('needsCounselor') === 'true' && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  className="w-full bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
                  onClick={() => navigate('/counselor')}
                >
                  🤝 Connect with a Professional Counselor
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Distress Detection Modal */}
        <Dialog open={showDistressModal} onOpenChange={setShowDistressModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>We're Here to Help</span>
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                <p>We've detected that you may be going through a difficult time.</p>
                <p className="font-semibold">Connecting you to a professional counselor...</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
