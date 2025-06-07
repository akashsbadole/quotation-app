import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface ContactProps {
  onNavigate?: (section: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inquiryTypes = [
    { value: 'sales', label: 'Sales Inquiry', icon: 'lucide:shopping-cart' },
    { value: 'support', label: 'Technical Support', icon: 'lucide:headphones' },
    { value: 'partnership', label: 'Partnership', icon: 'lucide:handshake' },
    { value: 'general', label: 'General Question', icon: 'lucide:help-circle' }
  ];

  const contactMethods = [
    {
      icon: 'lucide:mail',
      title: 'Email Us',
      description: 'Send us a detailed message',
      contact: 'hello@quotemanager.com',
      action: 'mailto:hello@quotemanager.com'
    },
    {
      icon: 'lucide:phone',
      title: 'Call Us',
      description: 'Speak with our team directly',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: 'lucide:message-circle',
      title: 'Live Chat',
      description: 'Get instant help',
      contact: 'Available 24/7',
      action: '#'
    },
    {
      icon: 'lucide:calendar',
      title: 'Schedule Demo',
      description: 'Book a personalized demo',
      contact: 'Free consultation',
      action: '#'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive\nSan Francisco, CA 94105\nUnited States',
      phone: '+1 (555) 123-4567',
      email: 'sf@quotemanager.com'
    },
    {
      city: 'New York',
      address: '456 Business Avenue\nNew York, NY 10001\nUnited States',
      phone: '+1 (555) 987-6543',
      email: 'ny@quotemanager.com'
    },
    {
      city: 'London',
      address: '789 Tech Street\nLondon EC1A 1BB\nUnited Kingdom',
      phone: '+44 20 7123 4567',
      email: 'london@quotemanager.com'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send the form data to your backend
      console.log('Contact form submitted:', formData);
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoConfig = {
    title: "Contact Us - QuoteManager",
    description: "Get in touch with QuoteManager. Contact our sales team, get support, or schedule a demo. We're here to help you succeed.",
    keywords: "contact QuoteManager, sales inquiry, support, demo, customer service",
    url: "/contact"
  };

  if (submitted) {
    return (
      <>
        <SEO {...seoConfig} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
          <motion.div
            className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="lucide:check" className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </motion.button>
          </motion.div>
        </div>
      </>
    );
  }

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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about QuoteManager? We're here to help. Reach out to our team 
              and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon icon={method.icon} className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {method.description}
                </p>
                <p className="text-blue-600 font-medium">
                  {method.contact}
                </p>
              </motion.a>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          formData.inquiryType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type.value}
                          checked={formData.inquiryType === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Icon icon={type.icon} className="mr-2 text-lg" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Company and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  whileHover={isSubmitting ? {} : { scale: 1.02 }}
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Icon icon="lucide:loader-2" className="animate-spin mr-2" />
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
              
              {offices.map((office, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {office.city}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Icon icon="lucide:map-pin" className="text-gray-400 mt-1" />
                      <div className="text-gray-600 whitespace-pre-line">
                        {office.address}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon icon="lucide:phone" className="text-gray-400" />
                      <a href={`tel:${office.phone}`} className="text-blue-600 hover:text-blue-700">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon icon="lucide:mail" className="text-gray-400" />
                      <a href={`mailto:${office.email}`} className="text-blue-600 hover:text-blue-700">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* FAQ Link */}
              <motion.div
                className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Looking for Quick Answers?
                </h3>
                <p className="text-blue-800 mb-4">
                  Check out our Help Center for instant answers to common questions.
                </p>
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate?.('help-center')}
                >
                  Visit Help Center
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
