
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Check if user has completed sentiment assessment
        const sentimentScore = localStorage.getItem('sentimentScore');
        
        toast({
          title: "Welcome back!",
          description: sentimentScore 
            ? "Thank you for completing the assessment. Let's continue your mental wellness journey."
            : "You've successfully logged in.",
        });
        
        navigate('/home');
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MindCare AI
            </h1>
          </div>
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to continue your mental wellness journey
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to assessment
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
