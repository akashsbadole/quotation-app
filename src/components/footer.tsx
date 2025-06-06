import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "API Documentation", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Mobile Apps", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "User Guide", href: "#" },
        { name: "Webinars", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR Compliance", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: "lucide:twitter", href: "#" },
    { name: "LinkedIn", icon: "lucide:linkedin", href: "#" },
    { name: "Facebook", icon: "lucide:facebook", href: "#" },
    { name: "YouTube", icon: "lucide:youtube", href: "#" },
    { name: "GitHub", icon: "lucide:github", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon
                  icon="lucide:file-text"
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-lg sm:text-xl font-bold">
                  QuoteManager Pro
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Professional Quotation System
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md">
              Streamline your quotation process with our comprehensive
              management system. Create, manage, and track quotations with ease
              while maintaining professional standards.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.name}
                >
                  <Icon
                    icon={social.icon}
                    className="text-gray-400 hover:text-white text-sm sm:text-base"
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      whileHover={{ x: 4 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-2">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-sm">
                Get the latest updates, tips, and insights delivered to your
                inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm sm:text-base"
              />
              <motion.button
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} QuoteManager Pro. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <Icon icon="lucide:shield-check" className="text-green-500" />
                <span>SOC 2 Compliant</span>
              </span>
              <span className="flex items-center space-x-2">
                <Icon icon="lucide:lock" className="text-blue-500" />
                <span>256-bit SSL</span>
              </span>
              <span className="flex items-center space-x-2">
                <Icon icon="lucide:globe" className="text-purple-500" />
                <span>GDPR Ready</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
      >
        <Icon icon="lucide:arrow-up" className="text-sm sm:text-base" />
      </motion.button>
    </footer>
  );
};
