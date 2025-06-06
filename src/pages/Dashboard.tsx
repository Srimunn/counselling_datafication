
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, MessageCircle, Heart, Brain } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageMood: 0,
    streakDays: 0,
    improvement: 0
  });

  useEffect(() => {
    // Generate mock mood tracking data
    const generateMoodData = () => {
      const data = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: Math.floor(Math.random() * 5) + 1,
          sessions: Math.floor(Math.random() * 3) + 1
        });
      }
      
      return data;
    };

    const data = generateMoodData();
    setMoodData(data);
    
    // Calculate stats
    const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0);
    const averageMood = data.reduce((sum, day) => sum + day.mood, 0) / data.length;
    const streakDays = 15; // Mock streak
    const improvement = 23; // Mock improvement percentage
    
    setStats({
      totalSessions,
      averageMood: Math.round(averageMood * 10) / 10,
      streakDays,
      improvement
    });
  }, []);

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😊'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    return labels[mood - 1] || 'Neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Navigation />
          </div>
          
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Wellness Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Track your mental health journey and see your progress over time.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.averageMood}/5</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.streakDays}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">+{stats.improvement}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Improvement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mood Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Mood Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip 
                        formatter={(value: number) => [getMoodLabel(value), 'Mood']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moodData.slice(-5).reverse().map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getMoodEmoji(session.mood)}</span>
                        <div>
                          <p className="font-medium">{session.date}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.sessions} session{session.sessions > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {getMoodLabel(session.mood)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Wellness Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Daily Check-ins</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">15/30 days</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Mood Improvement</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">23% increase</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Stress Management</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">8/10 techniques tried</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">Positive Trend</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Your mood has been consistently improving over the past week. Keep up the great work!
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">Recommendation</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    You seem most positive during afternoon sessions. Consider scheduling important activities then.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Suggestion</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Try the breathing exercises we discussed when you notice stress levels rising.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
