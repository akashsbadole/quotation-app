import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO, seoConfigs } from './seo';

interface LoginPageProps {
  onLogin?: (userData: any) => void;
  onNavigate?: (section: string) => void;
}

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  name: string;
  avatar: string;
  description: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Predefined demo accounts
  const demoAccounts: DemoAccount[] = [
    {
      email: 'admin@quotemanager.com',
      password: 'admin123',
      role: 'Administrator',
      name: 'John Admin',
      avatar: '👨‍💼',
      description: 'Full system access with all permissions'
    },
    {
      email: 'manager@quotemanager.com', 
      password: 'manager123',
      role: 'Sales Manager',
      name: 'Sarah Manager',
      avatar: '👩‍💼',
      description: 'Manage quotations, customers, and team performance'
    },
    {
      email: 'sales@quotemanager.com',
      password: 'sales123', 
      role: 'Sales Representative',
      name: 'Mike Sales',
      avatar: '👨‍💻',
      description: 'Create quotations and manage customer relationships'
    },
    {
      email: 'demo@quotemanager.com',
      password: 'demo123',
      role: 'Demo User',
      name: 'Demo User',
      avatar: '🎭',
      description: 'Limited access for demonstration purposes'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if credentials match any demo account
      const account = demoAccounts.find(
        acc => acc.email === email && acc.password === password
      );

      if (account) {
        // Successful login
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email: account.email,
          name: account.name,
          role: account.role,
          avatar: account.avatar,
          loginTime: new Date().toISOString(),
          permissions: getPermissionsByRole(account.role)
        };

        onLogin?.(userData);
        onNavigate?.('dashboard');
      } else {
        setError('Invalid email or password. Please try one of the demo accounts.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionsByRole = (role: string) => {
    switch (role) {
      case 'Administrator':
        return ['all'];
      case 'Sales Manager':
        return ['quotations', 'customers', 'products', 'analytics', 'team'];
      case 'Sales Representative':
        return ['quotations', 'customers', 'products'];
      case 'Demo User':
        return ['quotations:read', 'customers:read', 'products:read'];
      default:
        return ['quotations:read'];
    }
  };

  const handleDemoLogin = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowDemoAccounts(false);
  };

  return (
    <>
      <SEO {...seoConfigs.login} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Icon icon="lucide:file-text" className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                <a href="/" className="hover:text-blue-600 transition-colors duration-200">
                  QuoteManager
                </a>
              </h1>
            </div>
            <p className="text-gray-600">
              Professional Quotation Management System
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center">
                  <Icon icon="lucide:alert-circle" className="mr-2" />
                  {error}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="Enter your email"
                    required
                  />
                  <Icon 
                    icon="lucide:mail" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <Icon 
                    icon="lucide:lock" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
                disabled={isLoading}
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Icon icon="lucide:loader-2" className="animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Demo Accounts Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <motion.button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="lucide:users" className="mr-2" />
                Try Demo Accounts
                <Icon 
                  icon={showDemoAccounts ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                  className="ml-2"
                />
              </motion.button>

              <AnimatePresence>
                {showDemoAccounts && (
                  <motion.div
                    className="mt-4 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {demoAccounts.map((account, index) => (
                      <motion.button
                        key={account.email}
                        onClick={() => handleDemoLogin(account)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{account.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{account.name}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {account.role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{account.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {account.email} / {account.password}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Don't have an account?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Start Free Trial
                </a>
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600">Terms of Service</a>
                <a href="#" className="hover:text-blue-600">Support</a>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="mt-8 text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p>🔒 Your data is secure and encrypted</p>
            <p className="mt-2">
              Need help? Contact us at{' '}
              <a href="mailto:support@quotemanager.com" className="text-blue-600 hover:text-blue-500">
                support@quotemanager.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
