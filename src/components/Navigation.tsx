
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Users, Star, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: MessageCircle, label: 'Counselor', path: '/counselor' },
    { icon: Users, label: 'About Us', path: '/about' },
    { icon: Star, label: 'Feedback', path: '/feedback' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <nav className="space-y-2">
        <div className="flex items-center gap-2 mb-6">
          <img 
            src="/logo.png" 
            alt="MindCare AI Logo" 
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MindCare AI
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Your Mental Health Companion</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="space-y-2">
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/logo.png" 
          alt="MindCare AI Logo" 
          className="w-10 h-10 object-contain"
        />
        <div className="flex flex-col">
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MindCare AI
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Your Mental Health Companion</span>
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
        Welcome, {user?.name || 'Guest'}
      </div>
      
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={location.pathname === item.path ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate(item.path)}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {item.label}
        </Button>
      ))}
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
