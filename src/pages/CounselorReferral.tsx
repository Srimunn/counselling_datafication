import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Calendar, Clock, Heart, AlertTriangle, Mic, MicOff, Send, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useVoiceToText } from '@/hooks/useVoiceToText';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'counselor';
  timestamp: Date;
}

const CounselorReferral = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    urgency: 'normal',
    message: ''
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceToText({
    continuous: true,
    interimResults: true,
    autoStart: false
  });

  useEffect(() => {
    // Check if user was redirected due to distress
    const distressLogs = JSON.parse(localStorage.getItem('distressLogs') || '[]');
    if (distressLogs.length > 0) {
      setShowChat(true);
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: "Hello, I'm here to listen and support you. Please take your time and share what's on your mind. You can speak or type your message.",
        sender: 'counselor',
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Update text input with voice transcript
    if (transcript) {
      setTextInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store referral request
    const referralData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    // In a real app, this would be sent to your backend
    localStorage.setItem('counselorReferral', JSON.stringify(referralData));
    
    toast({
      title: "Referral Request Submitted",
      description: "A professional counselor will contact you within 24 hours. If this is an emergency, please call 988 (Suicide & Crisis Lifeline).",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredTime: '',
      urgency: 'normal',
      message: ''
    });
  };

  const handleSendMessage = () => {
    if (!textInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textInput,
      sender: 'user',
      timestamp: new Date()
    };

    // Auto-response from counselor (in real app, this would be live chat)
    const counselorResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: "Thank you for sharing that with me. I hear you, and your feelings are completely valid. Can you tell me more about what led to these feelings?",
      sender: 'counselor',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage, counselorResponse]);
    
    // Store chat history
    const chatHistory = {
      messages: [...chatMessages, userMessage, counselorResponse],
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('counselorChat', JSON.stringify(chatHistory));

    setTextInput('');
    resetTranscript();
    if (isListening) {
      stopListening();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "24/7 text-based crisis support"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Mental health and substance abuse support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Navigation />
          </div>
          
          <div className="flex-1 space-y-6">
            {/* Emergency Alert */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">If you're in immediate danger or having suicidal thoughts, please call 988 now.</span>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Connect with a Professional Counselor
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Sometimes talking to a human professional is the best next step. We're here to help you connect.
              </p>
            </div>

            {/* Voice Chat Interface */}
            {showChat && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Live Support Chat</span>
                    {!isSupported && (
                      <Badge variant="outline" className="text-xs">Voice not supported</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Chat Messages */}
                  <div className="h-64 overflow-y-auto mb-4 space-y-3 p-2 border rounded">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          {message.sender === 'counselor' && (
                            <Avatar className="w-8 h-8 mt-1">
                              <AvatarFallback className="bg-green-500 text-white text-sm">
                                C
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
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
                  </div>

                  {/* Voice/Text Input */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={isListening ? "Listening... Speak now" : "Type your message or use voice input..."}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                        disabled={isListening}
                      />
                      
                      {isSupported && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={toggleVoiceInput}
                          className={isListening ? 'bg-red-500 text-white' : ''}
                          title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      )}
                      
                      <Button onClick={handleSendMessage} disabled={!textInput.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {isListening && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        🎤 Listening... Your speech will appear in the text box above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Referral Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Request Professional Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preferred Contact Time</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      >
                        <option value="">Select a time</option>
                        <option value="morning">Morning (8 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                        <option value="evening">Evening (5 PM - 8 PM)</option>
                        <option value="flexible">I'm flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Urgency Level</label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'normal', label: 'Normal', color: 'bg-green-500' },
                        { value: 'urgent', label: 'Urgent', color: 'bg-yellow-500' },
                        { value: 'emergency', label: 'Emergency', color: 'bg-red-500' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={formData.urgency === option.value ? 'default' : 'outline'}
                          className={formData.urgency === option.value ? option.color : ''}
                          onClick={() => setFormData({...formData, urgency: option.value})}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us briefly what you'd like to discuss..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Referral Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {contact.phone}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Response Time</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      A licensed counselor will contact you within 24 hours during business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Initial Contact</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll call or email you to schedule your first session at a convenient time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Confidential Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All conversations are confidential and conducted by licensed professionals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorReferral;
