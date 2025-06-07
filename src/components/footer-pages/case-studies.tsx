import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface CaseStudiesProps {
  onNavigate?: (section: string) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onNavigate }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'technology', name: 'Technology' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'construction', name: 'Construction' },
    { id: 'healthcare', name: 'Healthcare' }
  ];

  const companySizes = [
    { id: 'all', name: 'All Sizes' },
    { id: 'startup', name: 'Startup (1-10)' },
    { id: 'small', name: 'Small (11-50)' },
    { id: 'medium', name: 'Medium (51-200)' },
    { id: 'enterprise', name: 'Enterprise (200+)' }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'TechFlow Solutions Increases Quote Conversion by 45%',
      client: 'TechFlow Solutions',
      industry: 'technology',
      size: 'medium',
      logo: '💻',
      challenge: 'TechFlow was losing potential customers due to slow quotation processes and inconsistent pricing. Their manual system took 3-5 days to generate quotes, leading to lost opportunities.',
      solution: 'Implemented QuoteManager with automated pricing rules, template customization, and real-time collaboration features. Integrated with their existing CRM system for seamless workflow.',
      results: [
        'Quote generation time reduced from 5 days to 2 hours',
        '45% increase in quote-to-sale conversion rate',
        '60% reduction in pricing errors',
        '$2.3M additional revenue in first year'
      ],
      metrics: {
        timeReduction: '95%',
        conversionIncrease: '45%',
        revenueGrowth: '$2.3M',
        errorReduction: '60%'
      },
      testimonial: {
        quote: "QuoteManager transformed our sales process. We're now closing deals faster than ever and our customers love the professional quotations.",
        author: 'Sarah Chen',
        position: 'VP of Sales'
      },
      implementationTime: '2 weeks',
      featured: true
    },
    {
      id: 2,
      title: 'BuildRight Construction Streamlines Complex Project Quotes',
      client: 'BuildRight Construction',
      industry: 'construction',
      size: 'enterprise',
      logo: '🏗️',
      challenge: 'Managing complex construction quotes with multiple subcontractors, materials, and labor costs was overwhelming. Quotes often contained errors and took weeks to finalize.',
      solution: 'Deployed QuoteManager Enterprise with advanced product catalog, multi-level approval workflows, and subcontractor collaboration tools. Custom integrations with project management software.',
      results: [
        'Quote accuracy improved by 80%',
        'Project bidding time reduced by 50%',
        '25% increase in successful bids',
        'Improved collaboration with 50+ subcontractors'
      ],
      metrics: {
        accuracyImprovement: '80%',
        timeReduction: '50%',
        bidSuccess: '25%',
        collaboration: '50+ partners'
      },
      testimonial: {
        quote: "The ability to collaborate with subcontractors in real-time and maintain accurate pricing has been a game-changer for our business.",
        author: 'Mike Rodriguez',
        position: 'Project Manager'
      },
      implementationTime: '4 weeks',
      featured: true
    },
    {
      id: 3,
      title: 'HealthTech Innovations Scales Quote Volume by 300%',
      client: 'HealthTech Innovations',
      industry: 'healthcare',
      size: 'startup',
      logo: '🏥',
      challenge: 'Rapid growth meant handling 10x more quote requests with the same team. Manual processes couldn\'t scale, leading to delayed responses and missed opportunities.',
      solution: 'Implemented QuoteManager with automation workflows, template libraries, and team collaboration features. Added API integration for seamless data flow.',
      results: [
        'Handled 300% more quotes with same team size',
        'Response time improved from 48 hours to 4 hours',
        '35% increase in quote acceptance rate',
        'Reduced administrative overhead by 70%'
      ],
      metrics: {
        volumeIncrease: '300%',
        responseTime: '92%',
        acceptanceRate: '35%',
        overhead: '70%'
      },
      testimonial: {
        quote: "QuoteManager allowed us to scale our quoting process without hiring additional staff. It's been crucial to our growth.",
        author: 'Dr. Lisa Park',
        position: 'CEO'
      },
      implementationTime: '1 week',
      featured: false
    },
    {
      id: 4,
      title: 'Global Consulting Group Standardizes International Pricing',
      client: 'Global Consulting Group',
      industry: 'consulting',
      size: 'enterprise',
      logo: '📊',
      challenge: 'Inconsistent pricing across 15 global offices led to client confusion and internal conflicts. No centralized system for managing complex service packages.',
      solution: 'Rolled out QuoteManager Enterprise with centralized pricing controls, multi-currency support, and regional customization capabilities.',
      results: [
        'Standardized pricing across all 15 offices',
        '40% reduction in pricing disputes',
        'Improved profit margins by 15%',
        'Enhanced brand consistency globally'
      ],
      metrics: {
        standardization: '100%',
        disputeReduction: '40%',
        marginImprovement: '15%',
        offices: '15'
      },
      testimonial: {
        quote: "Finally, we have consistent pricing and professional quotations across all our global offices. Our clients notice the difference.",
        author: 'James Wilson',
        position: 'Global Operations Director'
      },
      implementationTime: '6 weeks',
      featured: false
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => {
    const industryMatch = selectedIndustry === 'all' || study.industry === selectedIndustry;
    const sizeMatch = selectedSize === 'all' || study.size === selectedSize;
    return industryMatch && sizeMatch;
  });

  const featuredStudies = caseStudies.filter(study => study.featured);

  const seoConfig = {
    title: "Case Studies - QuoteManager",
    description: "Read real customer success stories. See how businesses across industries use QuoteManager to improve their quotation processes and grow revenue.",
    keywords: "case studies, customer success, quotation management success, business growth, ROI, customer testimonials",
    url: "/case-studies"
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
              Customer Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how businesses across industries are transforming their quotation processes 
              and achieving remarkable results with QuoteManager.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { number: '50,000+', label: 'Happy Customers', icon: 'lucide:users' },
              { number: '85%', label: 'Average Time Savings', icon: 'lucide:clock' },
              { number: '40%', label: 'Conversion Improvement', icon: 'lucide:trending-up' },
              { number: '$50M+', label: 'Revenue Generated', icon: 'lucide:dollar-sign' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon icon={stat.icon} className="text-blue-600 text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Case Studies */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-4xl">{study.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{study.client}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="capitalize">{study.industry}</span>
                          <span>•</span>
                          <span className="capitalize">{study.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">{study.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Object.entries(study.metrics).slice(0, 4).map(([key, value], metricIndex) => (
                        <div key={metricIndex} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                      <p className="text-gray-700 italic mb-2">"{study.testimonial.quote}"</p>
                      <footer className="text-sm text-gray-600">
                        <strong>{study.testimonial.author}</strong>, {study.testimonial.position}
                      </footer>
                    </blockquote>
                    
                    <motion.button
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alert(`Reading full case study: ${study.title}`)}
                    >
                      Read Full Case Study
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Case Studies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {companySizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* All Case Studies */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              All Case Studies ({filteredCaseStudies.length})
            </h2>
            
            {filteredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-5xl">{study.logo}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{study.title}</h3>
                        <div className="flex items-center space-x-3 text-gray-600 mt-2">
                          <span className="flex items-center">
                            <Icon icon="lucide:building" className="mr-1" />
                            {study.client}
                          </span>
                          <span className="flex items-center">
                            <Icon icon="lucide:tag" className="mr-1" />
                            {study.industry}
                          </span>
                          <span className="flex items-center">
                            <Icon icon="lucide:users" className="mr-1" />
                            {study.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
                        <ul className="space-y-1">
                          {study.results.map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-start text-gray-600">
                              <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                      <div className="space-y-3">
                        {Object.entries(study.metrics).map(([key, value], metricIndex) => (
                          <div key={metricIndex} className="flex justify-between">
                            <span className="text-gray-600 text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-semibold text-blue-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-gray-700 italic mb-3">"{study.testimonial.quote}"</p>
                      <footer className="text-sm text-gray-600">
                        <strong>{study.testimonial.author}</strong><br />
                        {study.testimonial.position}
                      </footer>
                    </blockquote>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-3">
                        Implementation: {study.implementationTime}
                      </div>
                      <motion.button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => alert(`Downloading case study: ${study.title}`)}
                      >
                        Download PDF
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses that have transformed their quotation processes with QuoteManager.
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
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
