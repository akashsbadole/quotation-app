import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface CareersProps {
  onNavigate?: (section: string) => void;
}

export const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const benefits = [
    {
      icon: 'lucide:heart',
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, dental, vision, and mental health support.'
    },
    {
      icon: 'lucide:clock',
      title: 'Flexible Schedule',
      description: 'Work-life balance with flexible hours and unlimited PTO policy.'
    },
    {
      icon: 'lucide:home',
      title: 'Remote Work',
      description: 'Work from anywhere with our fully remote-friendly culture.'
    },
    {
      icon: 'lucide:graduation-cap',
      title: 'Learning & Development',
      description: '$2,000 annual learning budget and conference attendance support.'
    },
    {
      icon: 'lucide:dollar-sign',
      title: 'Competitive Salary',
      description: 'Market-leading compensation with equity participation for all employees.'
    },
    {
      icon: 'lucide:users',
      title: 'Team Events',
      description: 'Regular team building activities, company retreats, and social events.'
    }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Join our frontend team to build beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'UI/UX design sense'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Drive product positioning, messaging, and go-to-market strategies for our quotation management platform.',
      requirements: ['3+ years product marketing', 'B2B SaaS experience', 'Excellent communication'],
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Help our customers achieve success with QuoteManager through onboarding, training, and ongoing support.',
      requirements: ['2+ years customer success', 'SaaS experience', 'Problem-solving skills'],
      posted: '3 days ago'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Build and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems.',
      requirements: ['AWS/GCP experience', 'Kubernetes knowledge', 'Infrastructure as Code'],
      posted: '5 days ago'
    },
    {
      id: 5,
      title: 'Sales Development Representative',
      department: 'Sales',
      location: 'New York, NY',
      type: 'Full-time',
      experience: 'Entry',
      description: 'Generate qualified leads and build relationships with potential customers in our target market.',
      requirements: ['1+ years sales experience', 'Excellent communication', 'Goal-oriented mindset'],
      posted: '1 week ago'
    },
    {
      id: 6,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Design intuitive user experiences and beautiful interfaces for our web and mobile applications.',
      requirements: ['3+ years UX/UI design', 'Figma proficiency', 'User research experience'],
      posted: '4 days ago'
    }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Customer Success', 'Design'];
  const locations = ['all', 'Remote', 'San Francisco, CA', 'New York, NY'];

  const filteredJobs = jobOpenings.filter(job => {
    const departmentMatch = selectedDepartment === 'all' || job.department === selectedDepartment;
    const locationMatch = selectedLocation === 'all' || job.location === selectedLocation;
    return departmentMatch && locationMatch;
  });

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'Entry': return 'bg-green-100 text-green-800';
      case 'Mid': return 'bg-blue-100 text-blue-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const seoConfig = {
    title: "Careers - QuoteManager",
    description: "Join the QuoteManager team! Explore exciting career opportunities in engineering, marketing, sales, and more. Build the future of quotation management.",
    keywords: "careers, jobs, QuoteManager jobs, software engineer jobs, remote work, startup careers",
    url: "/careers"
  };

  return (
    <>
      <SEO {...seoConfig} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-blue-600">Amazing Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Help us revolutionize quotation management while building your career 
              in a fast-growing, innovative company that values creativity and collaboration.
            </p>
            <div className="flex justify-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                🌍 Remote-First Company
              </span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                📈 Fast Growing
              </span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                💡 Innovation Focused
              </span>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Work With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon icon={benefit.icon} className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Job Openings */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Open Positions
            </h2>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="flex items-center text-gray-600">
                              <Icon icon="lucide:building" className="mr-1 text-sm" />
                              {job.department}
                            </span>
                            <span className="flex items-center text-gray-600">
                              <Icon icon="lucide:map-pin" className="mr-1 text-sm" />
                              {job.location}
                            </span>
                            <span className="flex items-center text-gray-600">
                              <Icon icon="lucide:clock" className="mr-1 text-sm" />
                              {job.type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExperienceColor(job.experience)}`}>
                              {job.experience} Level
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{job.posted}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, reqIndex) => (
                            <span
                              key={reqIndex}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:ml-6 lg:flex-shrink-0">
                      <motion.button
                        className="w-full lg:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // In a real app, this would open an application form or redirect to an application page
                          alert(`Apply for ${job.title} position`);
                        }}
                      >
                        Apply Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Icon icon="lucide:search" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
              </div>
            )}
          </motion.div>

          {/* Culture Section */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Culture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Believe</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Diversity and inclusion make us stronger</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Continuous learning and growth are essential</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Work-life balance leads to better outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Transparency and open communication build trust</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Innovation comes from empowered teams</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Life at QuoteManager</h3>
                <p className="text-gray-600 mb-4">
                  We're building more than just software – we're creating a workplace where 
                  everyone can do their best work. Our team is passionate, collaborative, 
                  and committed to making a real impact.
                </p>
                <p className="text-gray-600">
                  Whether you're working from our offices or remotely, you'll be part of 
                  a culture that values your contributions, supports your growth, and 
                  celebrates your successes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="bg-blue-600 rounded-lg p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-xl mb-8 opacity-90">
              We're always looking for talented people to join our team. 
              Send us your resume and let's start a conversation.
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('contact')}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};
