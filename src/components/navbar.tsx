import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes

  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "lucide:layout-dashboard",
      description: "Overview and analytics",
    },
    {
      id: "quotations",
      name: "Quotations",
      icon: "lucide:file-text",
      description: "Create and manage quotations",
      submenu: [
        { id: "quotations-list", name: "All Quotations", icon: "lucide:list" },
        { id: "quotations-create", name: "Create New", icon: "lucide:plus" },
        {
          id: "quotations-templates",
          name: "Templates",
          icon: "lucide:layout-template",
        },
        {
          id: "quotations-approval",
          name: "Approvals",
          icon: "lucide:check-circle",
        },
      ],
    },
    {
      id: "customers",
      name: "Customers",
      icon: "lucide:users",
      description: "Customer relationship management",
      submenu: [
        { id: "customers-list", name: "All Customers", icon: "lucide:users" },
        { id: "customers-segments", name: "Segments", icon: "lucide:target" },
        {
          id: "customers-portal",
          name: "Customer Portal",
          icon: "lucide:external-link",
        },
      ],
    },
    {
      id: "products",
      name: "Products",
      icon: "lucide:package",
      description: "Product and service catalog",
      submenu: [
        {
          id: "products-catalog",
          name: "Product Catalog",
          icon: "lucide:package",
        },
        {
          id: "products-pricing",
          name: "Pricing Matrix",
          icon: "lucide:dollar-sign",
        },
        {
          id: "products-inventory",
          name: "Inventory",
          icon: "lucide:warehouse",
        },
      ],
    },
    {
      id: "workflow",
      name: "Workflow",
      icon: "lucide:workflow",
      description: "Approval workflows",
      submenu: [
        {
          id: "workflow-approvals",
          name: "Pending Approvals",
          icon: "lucide:clock",
        },
        {
          id: "workflow-rules",
          name: "Workflow Rules",
          icon: "lucide:settings",
        },
        {
          id: "workflow-history",
          name: "Approval History",
          icon: "lucide:history",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: "lucide:bar-chart-3",
      description: "Reports and insights",
      submenu: [
        {
          id: "analytics-performance",
          name: "Performance",
          icon: "lucide:trending-up",
        },
        {
          id: "analytics-financial",
          name: "Financial Reports",
          icon: "lucide:dollar-sign",
        },
        {
          id: "analytics-forecasting",
          name: "Forecasting",
          icon: "lucide:crystal-ball",
        },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      icon: "lucide:settings",
      description: "System configuration",
      submenu: [
        {
          id: "integrations",
          name: "Integrations",
          icon: "lucide:plug",
        },
        {
          id: "settings-general",
          name: "General Settings",
          icon: "lucide:settings",
        },
        {
          id: "settings-users",
          name: "User Management",
          icon: "lucide:users",
        },
        {
          id: "settings-security",
          name: "Security",
          icon: "lucide:shield",
        },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon
                  icon="lucide:file-text"
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <div className="ml-2 sm:ml-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  QuoteManager
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Professional Quotation System
                </p>
              </div>
            </div>
          </div>

          {/* Mobile menu button and user menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile User Menu Button */}
            <div className="relative">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title="User Menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:user" className="text-white text-sm" />
                </div>
              </motion.button>

              {/* Mobile User Dropdown */}
              {isUserMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Icon icon="lucide:user" className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Admin User
                        </p>
                        <p className="text-xs text-gray-500">
                          admin@company.com
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          <Icon
                            icon="lucide:circle"
                            className="w-2 h-2 mr-1 fill-current"
                          />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:user" className="text-gray-500" />
                      <span>Profile Settings</span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:bell" className="text-gray-500" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        3
                      </span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:settings" className="text-gray-500" />
                      <span>Account Settings</span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon
                        icon="lucide:help-circle"
                        className="text-gray-500"
                      />
                      <span>Help & Support</span>
                    </motion.button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsUserMenuOpen(false);
                        // Add logout logic here
                      }}
                    >
                      <Icon icon="lucide:log-out" className="text-red-500" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile hamburger menu button */}
            <motion.button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon
                icon={isMenuOpen ? "lucide:x" : "lucide:menu"}
                className="text-xl"
              />
            </motion.button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigationItems.map((item) => (
                <div key={item.id} className="relative group">
                  <motion.button
                    className={`px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeSection.startsWith(item.id)
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveSection(
                        item.submenu ? `${item.id}-list` : item.id
                      )
                    }
                    title={item.description}
                  >
                    <Icon icon={item.icon} className="text-lg" />
                    <span>{item.name}</span>
                    {item.submenu && (
                      <Icon icon="lucide:chevron-down" className="text-xs" />
                    )}
                  </motion.button>

                  {/* Dropdown Menu */}
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <motion.button
                            key={subItem.id}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                              activeSection === subItem.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            whileHover={{ x: 4 }}
                            onClick={() => setActiveSection(subItem.id)}
                          >
                            <Icon icon={subItem.icon} className="text-lg" />
                            <span>{subItem.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            <motion.button
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Notifications"
            >
              <Icon icon="lucide:bell" className="text-xl" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Search */}
            <motion.button
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Search"
            >
              <Icon icon="lucide:search" className="text-xl" />
            </motion.button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title="User Menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:user" className="text-white text-sm" />
                </div>
              </motion.button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Icon icon="lucide:user" className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Admin User
                        </p>
                        <p className="text-xs text-gray-500">
                          admin@company.com
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          <Icon
                            icon="lucide:circle"
                            className="w-2 h-2 mr-1 fill-current"
                          />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:user" className="text-gray-500" />
                      <span>Profile Settings</span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:bell" className="text-gray-500" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        3
                      </span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon icon="lucide:settings" className="text-gray-500" />
                      <span>Account Settings</span>
                    </motion.button>
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon
                        icon="lucide:help-circle"
                        className="text-gray-500"
                      />
                      <span>Help & Support</span>
                    </motion.button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <motion.button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsUserMenuOpen(false);
                        // Add logout logic here
                      }}
                    >
                      <Icon icon="lucide:log-out" className="text-red-500" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <motion.button
                  className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                    activeSection.startsWith(item.id)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveSection(
                      item.submenu ? `${item.id}-list` : item.id
                    );
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon icon={item.icon} className="text-lg" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.submenu && (
                    <Icon icon="lucide:chevron-right" className="text-sm" />
                  )}
                </motion.button>

                {/* Mobile Submenu */}
                {item.submenu && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <motion.button
                        key={subItem.id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center space-x-3 ${
                          activeSection === subItem.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setActiveSection(subItem.id);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Icon icon={subItem.icon} className="text-base" />
                        <span>{subItem.name}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:user" className="text-white text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@company.com</p>
                </div>
              </div>
              <div className="flex space-x-2 px-3 py-2">
                <motion.button
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="lucide:bell" className="text-sm" />
                  <span>Notifications</span>
                </motion.button>
                <motion.button
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon icon="lucide:search" className="text-sm" />
                  <span>Search</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
