import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { GoogleDriveIntegration } from "./google-drive-integration";

interface Integration {
  id: string;
  name: string;
  description: string;
  category:
    | "crm"
    | "accounting"
    | "email"
    | "storage"
    | "analytics"
    | "communication";
  status: "connected" | "disconnected" | "error" | "pending";
  icon: string;
  provider: string;
  lastSync?: string;
  features: string[];
  setupComplexity: "easy" | "medium" | "advanced";
  pricing: "free" | "paid" | "enterprise";
}

interface SystemIntegrationsProps {
  onNavigate?: (section: string) => void;
}

export const SystemIntegrations: React.FC<SystemIntegrationsProps> = ({
  onNavigate,
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeCategory, setActiveCategory] = useState<
    | "all"
    | "crm"
    | "accounting"
    | "email"
    | "storage"
    | "analytics"
    | "communication"
  >("all");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: "salesforce",
        name: "Salesforce",
        description:
          "Sync customers, leads, and opportunities with Salesforce CRM",
        category: "crm",
        status: "connected",
        icon: "simple-icons:salesforce",
        provider: "Salesforce Inc.",
        lastSync: "2024-12-01T10:30:00Z",
        features: [
          "Customer sync",
          "Lead management",
          "Opportunity tracking",
          "Activity logging",
        ],
        setupComplexity: "medium",
        pricing: "enterprise",
      },
      {
        id: "hubspot",
        name: "HubSpot",
        description:
          "Integrate with HubSpot CRM for seamless customer management",
        category: "crm",
        status: "disconnected",
        icon: "simple-icons:hubspot",
        provider: "HubSpot Inc.",
        features: [
          "Contact sync",
          "Deal tracking",
          "Email integration",
          "Marketing automation",
        ],
        setupComplexity: "easy",
        pricing: "free",
      },
      {
        id: "quickbooks",
        name: "QuickBooks",
        description:
          "Sync invoices, payments, and financial data with QuickBooks",
        category: "accounting",
        status: "connected",
        icon: "simple-icons:quickbooks",
        provider: "Intuit Inc.",
        lastSync: "2024-12-01T08:15:00Z",
        features: [
          "Invoice sync",
          "Payment tracking",
          "Financial reporting",
          "Tax management",
        ],
        setupComplexity: "medium",
        pricing: "paid",
      },
      {
        id: "xero",
        name: "Xero",
        description:
          "Connect with Xero for automated accounting and financial management",
        category: "accounting",
        status: "error",
        icon: "simple-icons:xero",
        provider: "Xero Limited",
        lastSync: "2024-11-28T14:20:00Z",
        features: [
          "Automated invoicing",
          "Expense tracking",
          "Bank reconciliation",
          "Financial reports",
        ],
        setupComplexity: "medium",
        pricing: "paid",
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Email marketing automation and customer communication",
        category: "email",
        status: "connected",
        icon: "simple-icons:mailchimp",
        provider: "Mailchimp",
        lastSync: "2024-12-01T12:00:00Z",
        features: [
          "Email campaigns",
          "Customer segmentation",
          "Automation workflows",
          "Analytics",
        ],
        setupComplexity: "easy",
        pricing: "free",
      },
      {
        id: "slack",
        name: "Slack",
        description: "Team communication and quotation notifications",
        category: "communication",
        status: "connected",
        icon: "simple-icons:slack",
        provider: "Slack Technologies",
        lastSync: "2024-12-01T15:45:00Z",
        features: [
          "Real-time notifications",
          "Team collaboration",
          "File sharing",
          "Workflow automation",
        ],
        setupComplexity: "easy",
        pricing: "free",
      },
      {
        id: "googledrive",
        name: "Google Drive",
        description: "Cloud storage for quotation documents and files",
        category: "storage",
        status: "disconnected",
        icon: "simple-icons:googledrive",
        provider: "Google LLC",
        features: [
          "Document storage",
          "File sharing",
          "Collaboration",
          "Version control",
        ],
        setupComplexity: "easy",
        pricing: "free",
      },
      {
        id: "googleanalytics",
        name: "Google Analytics",
        description: "Track customer portal usage and engagement metrics",
        category: "analytics",
        status: "pending",
        icon: "simple-icons:googleanalytics",
        provider: "Google LLC",
        features: [
          "Usage tracking",
          "Customer insights",
          "Conversion analytics",
          "Custom reports",
        ],
        setupComplexity: "medium",
        pricing: "free",
      },
    ];

    setIntegrations(mockIntegrations);
  }, []);

  const categories = [
    { id: "all", name: "All Integrations", icon: "lucide:grid-3x3" },
    { id: "crm", name: "CRM", icon: "lucide:users" },
    { id: "accounting", name: "Accounting", icon: "lucide:calculator" },
    { id: "email", name: "Email", icon: "lucide:mail" },
    { id: "storage", name: "Storage", icon: "lucide:hard-drive" },
    { id: "analytics", name: "Analytics", icon: "lucide:bar-chart" },
    {
      id: "communication",
      name: "Communication",
      icon: "lucide:message-circle",
    },
  ];

  const filteredIntegrations = integrations.filter(
    (integration) =>
      activeCategory === "all" || integration.category === activeCategory
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return "lucide:check-circle";
      case "disconnected":
        return "lucide:circle";
      case "error":
        return "lucide:alert-circle";
      case "pending":
        return "lucide:clock";
      default:
        return "lucide:circle";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleConnect = async (integration: Integration) => {
    // Special handling for Google Drive - navigate to dedicated page
    if (integration.id === "googledrive") {
      onNavigate?.("google-drive-integration");
      return;
    }

    // Special handling for Google Analytics - show setup instructions
    if (integration.id === "googleanalytics") {
      alert(
        "Google Analytics is already integrated! Check your dashboard for analytics data."
      );
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integration.id
            ? {
                ...int,
                status: "connected" as const,
                lastSync: new Date().toISOString(),
              }
            : int
        )
      );
      return;
    }

    // Simulate connection process for other integrations
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integration.id ? { ...int, status: "pending" as const } : int
      )
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update to connected
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integration.id
          ? {
              ...int,
              status: "connected" as const,
              lastSync: new Date().toISOString(),
            }
          : int
      )
    );

    alert(`${integration.name} connected successfully!`);
  };

  const handleDisconnect = (integrationId: string) => {
    if (
      window.confirm("Are you sure you want to disconnect this integration?")
    ) {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                status: "disconnected" as const,
                lastSync: undefined,
              }
            : integration
        )
      );
      alert("Integration disconnected successfully!");
    }
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowSetupModal(true);
  };

  const handleSync = async (integrationId: string) => {
    // Update to pending sync
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId ? { ...int, status: "pending" as const } : int
      )
    );

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update to connected with new sync time
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? {
              ...int,
              status: "connected" as const,
              lastSync: new Date().toISOString(),
            }
          : int
      )
    );

    alert("Sync completed successfully!");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getConnectedCount = () => {
    return integrations.filter((i) => i.status === "connected").length;
  };

  const getErrorCount = () => {
    return integrations.filter((i) => i.status === "error").length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate?.("integrations")}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  System Integrations
                </h1>
                <p className="text-sm text-gray-600">
                  Connect your quotation system with external services
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {getConnectedCount()} Connected
                </p>
                {getErrorCount() > 0 && (
                  <p className="text-sm text-red-600">
                    {getErrorCount()} Errors
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon
                  icon="lucide:check-circle"
                  className="text-2xl text-green-600"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getConnectedCount()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon icon="lucide:circle" className="text-2xl text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    integrations.filter((i) => i.status === "disconnected")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Icon
                  icon="lucide:alert-circle"
                  className="text-2xl text-red-600"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getErrorCount()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Icon
                  icon="lucide:clock"
                  className="text-2xl text-yellow-600"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter((i) => i.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id as any)}
              >
                <Icon icon={category.icon} className="text-sm" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon
                      icon={integration.icon}
                      className="text-2xl text-gray-600"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {integration.provider}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    integration.status
                  )}`}
                >
                  <Icon
                    icon={getStatusIcon(integration.status)}
                    className="mr-1 text-xs"
                  />
                  {integration.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {integration.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(
                      integration.setupComplexity
                    )}`}
                  >
                    {integration.setupComplexity}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPricingColor(
                      integration.pricing
                    )}`}
                  >
                    {integration.pricing}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Features:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.slice(0, 2).map((feature) => (
                    <span
                      key={feature}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{integration.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {integration.lastSync && (
                <p className="text-xs text-gray-500 mb-4">
                  Last sync: {formatDate(integration.lastSync)}
                </p>
              )}

              <div className="flex space-x-2">
                {integration.status === "connected" ? (
                  <>
                    <motion.button
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSync(integration.id)}
                    >
                      Sync Now
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfigure(integration)}
                    >
                      Configure
                    </motion.button>
                    <motion.button
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      <Icon icon="lucide:unplug" />
                    </motion.button>
                  </>
                ) : integration.status === "pending" ? (
                  <motion.button
                    className="w-full bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm cursor-not-allowed"
                    disabled
                  >
                    <Icon
                      icon="lucide:loader-2"
                      className="animate-spin inline mr-2"
                    />
                    Connecting...
                  </motion.button>
                ) : (
                  <motion.button
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(integration)}
                  >
                    Connect
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Setup Modal Placeholder */}
      {showSetupModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center py-8">
              <Icon
                icon={selectedIntegration.icon}
                className="text-6xl text-blue-400 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connect {selectedIntegration.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Integration setup wizard coming soon
              </p>
              <motion.button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSetupModal(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
