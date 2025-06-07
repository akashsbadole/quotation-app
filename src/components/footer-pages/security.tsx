import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SecurityProps {
  onNavigate?: (section: string) => void;
}

export const Security: React.FC<SecurityProps> = ({ onNavigate }) => {
  const securityFeatures = [
    {
      icon: 'lucide:shield',
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit and at rest using AES-256 encryption standards.',
      details: ['TLS 1.3 for data in transit', 'AES-256 encryption at rest', 'Zero-knowledge architecture']
    },
    {
      icon: 'lucide:key',
      title: 'Multi-Factor Authentication',
      description: 'Secure your account with multiple layers of authentication.',
      details: ['SMS verification', 'Authenticator apps', 'Hardware security keys']
    },
    {
      icon: 'lucide:eye',
      title: 'Access Controls',
      description: 'Granular permissions and role-based access control for your team.',
      details: ['Role-based permissions', 'IP whitelisting', 'Session management']
    },
    {
      icon: 'lucide:activity',
      title: 'Real-time Monitoring',
      description: 'Continuous monitoring and threat detection to protect your data.',
      details: ['24/7 security monitoring', 'Anomaly detection', 'Automated threat response']
    },
    {
      icon: 'lucide:database',
      title: 'Data Backup & Recovery',
      description: 'Regular backups and disaster recovery procedures ensure data availability.',
      details: ['Daily automated backups', 'Point-in-time recovery', 'Geographic redundancy']
    },
    {
      icon: 'lucide:check-circle',
      title: 'Compliance Standards',
      description: 'We meet industry-leading security and compliance standards.',
      details: ['SOC 2 Type II certified', 'GDPR compliant', 'ISO 27001 aligned']
    }
  ];

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Audited security controls and procedures',
      icon: 'lucide:shield-check',
      status: 'Certified'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management system',
      icon: 'lucide:award',
      status: 'Aligned'
    },
    {
      name: 'GDPR',
      description: 'European data protection regulation',
      icon: 'lucide:globe',
      status: 'Compliant'
    },
    {
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      icon: 'lucide:flag',
      status: 'Compliant'
    }
  ];

  const securityPractices = [
    {
      category: 'Infrastructure Security',
      practices: [
        'Cloud infrastructure with AWS/Azure security best practices',
        'Network segmentation and firewalls',
        'Intrusion detection and prevention systems',
        'Regular security assessments and penetration testing'
      ]
    },
    {
      category: 'Application Security',
      practices: [
        'Secure coding practices and code reviews',
        'Regular security updates and patches',
        'Input validation and sanitization',
        'SQL injection and XSS protection'
      ]
    },
    {
      category: 'Data Protection',
      practices: [
        'Data encryption at rest and in transit',
        'Regular data backups and recovery testing',
        'Data retention and deletion policies',
        'Privacy by design principles'
      ]
    },
    {
      category: 'Access Management',
      practices: [
        'Multi-factor authentication enforcement',
        'Role-based access controls',
        'Regular access reviews and audits',
        'Secure password policies'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Icon icon="lucide:shield" className="text-5xl text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">Security</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data security is our top priority. We implement enterprise-grade security measures 
            to protect your information and ensure business continuity.
          </p>
        </motion.div>

        {/* Security Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon icon={feature.icon} className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Icon icon="lucide:check" className="text-green-500 text-xs" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Certifications & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon={cert.icon} className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {cert.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Practices */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Security Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityPractices.map((practice, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{practice.category}</h3>
                <ul className="space-y-3">
                  {practice.practices.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Icon icon="lucide:shield-check" className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Stats */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Security by the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '99.9%', label: 'Uptime SLA' },
              { number: '256-bit', label: 'Encryption Standard' },
              { number: '24/7', label: 'Security Monitoring' },
              { number: '< 1 min', label: 'Incident Response Time' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Incident Response */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Incident Response</h2>
              <p className="text-gray-600 mb-6">
                Our dedicated security team follows a comprehensive incident response plan to quickly 
                identify, contain, and resolve any security incidents.
              </p>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Detection', description: 'Automated monitoring detects potential threats' },
                  { step: '2', title: 'Assessment', description: 'Security team evaluates the incident severity' },
                  { step: '3', title: 'Containment', description: 'Immediate action to prevent further damage' },
                  { step: '4', title: 'Resolution', description: 'Fix the issue and restore normal operations' },
                  { step: '5', title: 'Communication', description: 'Notify affected customers and stakeholders' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Icon icon="lucide:shield-alert" className="text-8xl text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Contact */}
        <motion.div
          className="bg-gray-900 text-white rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Icon icon="lucide:mail" className="text-4xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Security Questions?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have security concerns or want to report a vulnerability, 
            our security team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.a
              href="mailto:security@quotemanager.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="lucide:mail" />
              <span>security@quotemanager.com</span>
            </motion.a>
            <motion.button
              className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('contact')}
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
