
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Shield, Users, Star, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist & Co-Founder",
      image: "👩‍⚕️",
      bio: "15+ years of experience in mental health, specializing in anxiety and depression treatment."
    },
    {
      name: "Alex Rodriguez",
      role: "AI Engineer & Co-Founder",
      image: "👨‍💻",
      bio: "Former Google AI researcher, passionate about using technology to improve mental health accessibility."
    },
    {
      name: "Dr. Maya Patel",
      role: "Head of Clinical Operations",
      image: "👩‍🔬",
      bio: "Licensed therapist with expertise in trauma-informed care and crisis intervention."
    },
    {
      name: "Jordan Kim",
      role: "Product Designer",
      image: "🎨",
      bio: "UX designer focused on creating empathetic and accessible digital health experiences."
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Compassionate Care",
      description: "Every interaction is designed with empathy and understanding at its core."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: "Evidence-Based Approach",
      description: "Our AI is trained on clinically validated therapeutic techniques and practices."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Privacy & Security",
      description: "Your conversations are encrypted and never shared without your explicit consent."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Human Connection",
      description: "AI supports, but never replaces, the irreplaceable value of human professional care."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Users Supported" },
    { number: "1M+", label: "Conversations" },
    { number: "24/7", label: "Availability" },
    { number: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Navigation />
          </div>
          
          <div className="flex-1 space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                About MindCare AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're on a mission to make mental health support accessible, immediate, and compassionate for everyone, everywhere.
              </p>
            </div>

            {/* Mission Statement */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Mental health challenges affect millions worldwide, yet access to professional support remains limited. 
                    MindCare AI bridges this gap by providing immediate, intelligent, and empathetic support while connecting 
                    users with human professionals when needed. We believe that everyone deserves compassionate mental health care.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-3xl font-bold text-purple-600">{stat.number}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Our Values */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Our Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Meet Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-6xl mb-4">{member.image}</div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <span>Recognition & Partnerships</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold">Featured in TechCrunch</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">"Revolutionary approach to mental health"</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold">HIPAA Compliant</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Certified for healthcare data protection</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-semibold">APA Partnership</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Endorsed by mental health professionals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Have questions about our mission or want to learn more about our approach to AI-powered mental health support?
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Badge variant="outline" className="p-2">
                    📧 hello@mindcareai.com
                  </Badge>
                  <Badge variant="outline" className="p-2">
                    📱 1-800-MINDCARE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
