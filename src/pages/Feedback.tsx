
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Send, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Your rating helps us improve our service.",
        variant: "destructive"
      });
      return;
    }

    const feedbackData = {
      rating,
      feedback,
      name,
      email,
      category,
      timestamp: new Date().toISOString()
    };

    // Store feedback (in real app, this would go to your backend)
    const existingFeedback = JSON.parse(localStorage.getItem('feedbackList') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('feedbackList', JSON.stringify(existingFeedback));

    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve MindCare AI for everyone.",
    });

    // Reset form
    setRating(0);
    setFeedback('');
    setName('');
    setEmail('');
    setCategory('general');
  };

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "MindCare AI has been a lifeline for me. Having someone to talk to 24/7 has made such a difference in my mental health journey.",
      location: "California"
    },
    {
      name: "Michael R.",
      rating: 5,
      text: "The AI is incredibly understanding and helped me realize when I needed professional help. The counselor referral was seamless.",
      location: "New York"
    },
    {
      name: "Emma L.",
      rating: 4,
      text: "I love the voice feature and how personalized the responses feel. It's like having a caring friend who's always there.",
      location: "Texas"
    },
    {
      name: "David K.",
      rating: 5,
      text: "As someone with social anxiety, being able to practice conversations with the AI has boosted my confidence tremendously.",
      location: "Florida"
    }
  ];

  const categories = [
    { value: 'general', label: 'General Experience' },
    { value: 'ai-responses', label: 'AI Responses' },
    { value: 'voice-features', label: 'Voice Features' },
    { value: 'counselor-referral', label: 'Counselor Referral' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'suggestion', label: 'Feature Suggestion' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Navigation />
          </div>
          
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                We Value Your Feedback
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Help us improve MindCare AI by sharing your experience and suggestions.
              </p>
            </div>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span>Share Your Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div className="text-center">
                    <label className="block text-lg font-medium mb-4">How would you rate your experience?</label>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none transform transition-transform hover:scale-110"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`w-12 h-12 ${
                              star <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Feedback Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tell us more about your experience
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What did you like? What could we improve? Any suggestions?"
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Contact Info (Optional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name (Optional)</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll only use this to follow up if needed</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>What Our Users Say</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {testimonial.location}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        - {testimonial.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>User Satisfaction Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Would Recommend</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
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

export default Feedback;
