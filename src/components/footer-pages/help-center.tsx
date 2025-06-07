import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface HelpCenterProps {
  onNavigate?: (section: string) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'lucide:grid-3x3', count: 45 },
    { id: 'getting-started', name: 'Getting Started', icon: 'lucide:play-circle', count: 8 },
    { id: 'quotations', name: 'Quotations', icon: 'lucide:file-text', count: 12 },
    { id: 'customers', name: 'Customers', icon: 'lucide:users', count: 7 },
    { id: 'products', name: 'Products', icon: 'lucide:package', count: 6 },
    { id: 'billing', name: 'Billing & Plans', icon: 'lucide:credit-card', count: 5 },
    { id: 'integrations', name: 'Integrations', icon: 'lucide:link', count: 4 },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: 'lucide:wrench', count: 3 }
  ];

  const articles = [
    {
      id: 1,
      title: 'Getting Started with QuoteManager',
      category: 'getting-started',
      excerpt: 'Learn the basics of setting up your account and creating your first quotation.',
      readTime: 5,
      difficulty: 'Beginner',
      views: 2450,
      helpful: 89,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'How to Create Professional Quotations',
      category: 'quotations',
      excerpt: 'Step-by-step guide to creating beautiful, professional quotations that win deals.',
      readTime: 8,
      difficulty: 'Beginner',
      views: 1890,
      helpful: 95,
      lastUpdated: '2024-01-12'
    },
    {
      id: 3,
      title: 'Managing Customer Information',
      category: 'customers',
      excerpt: 'Best practices for organizing and managing your customer database effectively.',
      readTime: 6,
      difficulty: 'Intermediate',
      views: 1234,
      helpful: 78,
      lastUpdated: '2024-01-10'
    },
    {
      id: 4,
      title: 'Setting Up Product Catalogs',
      category: 'products',
      excerpt: 'Learn how to organize your products and services for quick quotation creation.',
      readTime: 7,
      difficulty: 'Intermediate',
      views: 987,
      helpful: 82,
      lastUpdated: '2024-01-08'
    },
    {
      id: 5,
      title: 'Understanding Billing and Subscriptions',
      category: 'billing',
      excerpt: 'Everything you need to know about plans, billing cycles, and payment methods.',
      readTime: 4,
      difficulty: 'Beginner',
      views: 756,
      helpful: 91,
      lastUpdated: '2024-01-05'
    },
    {
      id: 6,
      title: 'Integrating with CRM Systems',
      category: 'integrations',
      excerpt: 'Connect QuoteManager with your existing CRM for seamless data synchronization.',
      readTime: 10,
      difficulty: 'Advanced',
      views: 543,
      helpful: 87,
      lastUpdated: '2024-01-03'
    },
    {
      id: 7,
      title: 'Troubleshooting Common Issues',
      category: 'troubleshooting',
      excerpt: 'Solutions to the most frequently encountered problems and error messages.',
      readTime: 6,
      difficulty: 'Intermediate',
      views: 432,
      helpful: 76,
      lastUpdated: '2024-01-01'
    },
    {
      id: 8,
      title: 'Advanced Quotation Templates',
      category: 'quotations',
      excerpt: 'Create custom templates with advanced formatting and conditional logic.',
      readTime: 12,
      difficulty: 'Advanced',
      views: 321,
      helpful: 93,
      lastUpdated: '2023-12-28'
    }
  ];

  const popularTopics = [
    'How to create a quotation',
    'Adding customers to your account',
    'Setting up payment methods',
    'Customizing quotation templates',
    'Exporting quotations to PDF',
    'Managing user permissions'
  ];

  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const seoConfig = {
    title: "Help Center - QuoteManager",
    description: "Find answers to your questions about QuoteManager. Browse our comprehensive help articles, tutorials, and troubleshooting guides.",
    keywords: "help center, support, tutorials, QuoteManager help, documentation, FAQ",
    url: "/help-center"
  };

  return (
    <>
      <SEO {...seoConfig} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to your questions and learn how to get the most out of QuoteManager.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <Icon 
                icon="lucide:search" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
              />
            </div>
          </motion.div>

          {/* Popular Topics */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Popular Topics</h2>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  className="bg-white text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSearchQuery(topic)}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon icon={category.icon} className="text-lg" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Need More Help?</h4>
                  <div className="space-y-3">
                    <motion.button
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate?.('contact')}
                    >
                      Contact Support
                    </motion.button>
                    <motion.button
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Schedule a Demo
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                className="mb-6 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' 
                    ? 'All Articles' 
                    : categories.find(c => c.id === selectedCategory)?.name
                  }
                </h2>
                <span className="text-gray-600">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </span>
              </motion.div>

              {/* Articles Grid */}
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      // In a real app, this would navigate to the full article
                      alert(`Opening article: ${article.title}`);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Icon icon="lucide:clock" className="mr-1" />
                            {article.readTime} min read
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                          <span className="flex items-center">
                            <Icon icon="lucide:eye" className="mr-1" />
                            {article.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center">
                            <Icon icon="lucide:thumbs-up" className="mr-1" />
                            {article.helpful}% helpful
                          </span>
                        </div>
                      </div>
                      <Icon icon="lucide:chevron-right" className="text-gray-400 ml-4 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon icon="lucide:search" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or browse different categories.
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Contact Support Section */}
          <motion.div
            className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you 
                get the most out of QuoteManager.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon icon="lucide:message-circle" className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Get instant help from our support team
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Start Chat
                  </button>
                </motion.div>
                
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon icon="lucide:mail" className="text-green-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Send us a detailed message
                  </p>
                  <button 
                    className="text-green-600 hover:text-green-700 font-medium"
                    onClick={() => onNavigate?.('contact')}
                  >
                    Send Email
                  </button>
                </motion.div>
                
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon icon="lucide:video" className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video Call</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Schedule a personalized demo
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Book Call
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
