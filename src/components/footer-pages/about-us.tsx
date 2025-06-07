import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface AboutUsProps {
  onNavigate?: (section: string) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  const stats = [
    { number: '50,000+', label: 'Active Users', icon: 'lucide:users' },
    { number: '2M+', label: 'Quotations Created', icon: 'lucide:file-text' },
    { number: '150+', label: 'Countries', icon: 'lucide:globe' },
    { number: '99.9%', label: 'Uptime', icon: 'lucide:shield-check' }
  ];

  const values = [
    {
      icon: 'lucide:target',
      title: 'Customer-Centric',
      description: 'We put our customers at the heart of everything we do, constantly innovating to meet their evolving needs.'
    },
    {
      icon: 'lucide:lightbulb',
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and creative solutions to simplify complex business processes.'
    },
    {
      icon: 'lucide:shield',
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data security and privacy to protect our customers\' business.'
    },
    {
      icon: 'lucide:heart',
      title: 'Passion',
      description: 'We are passionate about helping businesses grow and succeed through better quotation management.'
    }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'QuoteManager was founded with a vision to revolutionize quotation management for businesses worldwide.'
    },
    {
      year: '2020',
      title: 'First 1,000 Users',
      description: 'Reached our first milestone of 1,000 active users and launched our mobile applications.'
    },
    {
      year: '2021',
      title: 'Series A Funding',
      description: 'Secured $10M in Series A funding to accelerate product development and global expansion.'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries and launched multi-language support for international markets.'
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Introduced AI-powered features for smart quotation generation and predictive analytics.'
    },
    {
      year: '2024',
      title: 'Enterprise Focus',
      description: 'Launched enterprise-grade features and achieved SOC 2 Type II compliance.'
    }
  ];

  const leadership = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Co-Founder',
      bio: 'Former VP of Sales at Salesforce with 15+ years of experience in B2B software.',
      image: '👩‍💼',
      linkedin: '#'
    },
    {
      name: 'Michael Chen',
      position: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer with expertise in scalable systems and machine learning.',
      image: '👨‍💻',
      linkedin: '#'
    },
    {
      name: 'David Rodriguez',
      position: 'VP of Product',
      bio: 'Product leader with 12+ years building enterprise software at Microsoft and Adobe.',
      image: '👨‍💼',
      linkedin: '#'
    },
    {
      name: 'Emily Watson',
      position: 'VP of Marketing',
      bio: 'Growth marketing expert who scaled multiple SaaS companies from startup to IPO.',
      image: '👩‍💻',
      linkedin: '#'
    }
  ];

  const seoConfig = {
    title: "About Us - QuoteManager",
    description: "Learn about QuoteManager's mission to revolutionize quotation management. Meet our team and discover our journey from startup to global platform.",
    keywords: "about QuoteManager, company story, team, mission, values, leadership",
    url: "/about-us"
  };

  return (
    <>
      <SEO {...seoConfig} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionizing Business
              <span className="text-blue-600"> Quotations</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to simplify quotation management for businesses worldwide, 
              helping them close deals faster and grow more efficiently.
            </p>
            <div className="flex justify-center">
              <motion.button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('contact')}
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon={stat.icon} className="text-blue-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To empower businesses of all sizes with intelligent quotation management tools 
                  that streamline sales processes, improve accuracy, and accelerate growth.
                </p>
                <p className="text-gray-600">
                  We believe that every business deserves access to professional, efficient 
                  quotation management regardless of their size or technical expertise.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To become the global standard for quotation management, enabling millions 
                  of businesses to close deals faster and build stronger customer relationships.
                </p>
                <p className="text-gray-600">
                  We envision a world where creating, managing, and tracking quotations is 
                  seamless, intelligent, and accessible to everyone.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon icon={value.icon} className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leadership Team */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((leader, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="text-6xl mb-4">{leader.image}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{leader.position}</p>
                  <p className="text-gray-600 text-sm mb-4">{leader.bio}</p>
                  <motion.a
                    href={leader.linkedin}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon icon="lucide:linkedin" className="mr-1" />
                    LinkedIn
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="bg-blue-600 rounded-lg p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-xl mb-8 opacity-90">
              Ready to revolutionize your quotation process? Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('pricing')}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('contact')}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
