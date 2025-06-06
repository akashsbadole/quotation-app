import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
  expectedDate?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description,
  features = [],
  expectedDate = "Q2 2024",
  category = "Feature",
  priority = "medium"
}) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date("2024-06-01").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // In real app, this would send to backend
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'analytics': return 'lucide:bar-chart-3';
      case 'workflow': return 'lucide:workflow';
      case 'integration': return 'lucide:plug';
      case 'mobile': return 'lucide:smartphone';
      case 'ai': return 'lucide:brain';
      case 'security': return 'lucide:shield';
      default: return 'lucide:star';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Icon icon={getCategoryIcon()} className="text-white text-3xl" />
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor()}`}>
            <Icon icon="lucide:flag" className="w-4 h-4 mr-1" />
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <Icon icon="lucide:calendar" className="w-4 h-4 mr-1" />
            Expected: {expectedDate}
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Launch Countdown
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
            { label: 'Seconds', value: countdown.seconds }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="text-3xl font-bold">{item.value.toString().padStart(2, '0')}</div>
              <div className="text-sm opacity-80">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Preview */}
      {features.length > 0 && (
        <motion.div
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            What's Coming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:check" className="text-green-600 text-sm" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notification Signup */}
      <motion.div
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Get Notified When It's Ready</h2>
        <p className="text-blue-100 mb-6">
          Be the first to know when this feature launches. We'll send you an email notification.
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <motion.button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify Me
              </motion.button>
            </div>
          </form>
        ) : (
          <motion.div
            className="flex items-center justify-center space-x-2 text-green-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Icon icon="lucide:check-circle" className="text-2xl" />
            <span className="text-lg font-semibold">Thanks! We'll notify you when it's ready.</span>
          </motion.div>
        )}
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Development Progress
        </h2>
        <div className="space-y-4">
          {[
            { phase: 'Planning & Design', progress: 100, status: 'completed' },
            { phase: 'Backend Development', progress: 75, status: 'in-progress' },
            { phase: 'Frontend Development', progress: 45, status: 'in-progress' },
            { phase: 'Testing & QA', progress: 0, status: 'pending' },
            { phase: 'Deployment', progress: 0, status: 'pending' }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{item.phase}</span>
                <span className="text-sm text-gray-500">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ delay: 1 + index * 0.2, duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <motion.button
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
};
