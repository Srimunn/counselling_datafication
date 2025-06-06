
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Please accept terms",
        description: "You must agree to the terms and privacy policy to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to MindCare AI. Let's start your journey.",
        });
        navigate('/home');
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Registration error",
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
          <CardTitle className="text-xl">Create Your Account</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands who've taken control of their mental wellness
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign in
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

export default Register;
