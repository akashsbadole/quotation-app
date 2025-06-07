import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface QuotationsPageProps {
  onNavigate?: (section: string) => void;
}

export const QuotationsPage: React.FC<QuotationsPageProps> = ({
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const quotations = [
    {
      id: "Q-2024-001",
      client: "Acme Corporation",
      amount: 15000,
      status: "pending",
      date: "2024-01-15",
      items: 5,
      validUntil: "2024-02-15",
    },
    {
      id: "Q-2024-002",
      client: "Tech Solutions Inc",
      amount: 8500,
      status: "approved",
      date: "2024-01-14",
      items: 3,
      validUntil: "2024-02-14",
    },
    {
      id: "Q-2024-003",
      client: "Global Industries",
      amount: 22000,
      status: "draft",
      date: "2024-01-13",
      items: 8,
      validUntil: "2024-02-13",
    },
    {
      id: "Q-2024-004",
      client: "StartUp Co",
      amount: 5200,
      status: "rejected",
      date: "2024-01-12",
      items: 2,
      validUntil: "2024-02-12",
    },
    {
      id: "Q-2024-005",
      client: "Enterprise Ltd",
      amount: 35000,
      status: "approved",
      date: "2024-01-11",
      items: 12,
      validUntil: "2024-02-11",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "lucide:check-circle";
      case "pending":
        return "lucide:clock";
      case "draft":
        return "lucide:edit";
      case "rejected":
        return "lucide:x-circle";
      default:
        return "lucide:file";
    }
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewQuotation = (quotation: any) => {
    setSelectedQuotation(quotation);
    setShowViewModal(true);
  };

  const handleEditQuotation = (quotation: any) => {
    setSelectedQuotation(quotation);
    // Navigate to edit page with quotation data
    onNavigate?.(`quotations-edit-${quotation.id}`);
  };

  const handleMoreActions = (quotation: any) => {
    // Show dropdown menu with more actions
    console.log("More actions for quotation:", quotation.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your quotations
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <motion.button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.("quotations-create")}
            >
              <Icon icon="lucide:plus" />
              <span>New Quotation</span>
            </motion.button>
            <motion.button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="lucide:download" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="lucide:search" className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotations.map((quotation, index) => (
          <motion.div
            key={quotation.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {quotation.id}
                </h3>
                <p className="text-gray-600">{quotation.client}</p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  quotation.status
                )}`}
              >
                <Icon
                  icon={getStatusIcon(quotation.status)}
                  className="w-3 h-3 mr-1"
                />
                {quotation.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="text-lg font-bold text-gray-900">
                  ${quotation.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Items:</span>
                <span className="text-sm text-gray-900">
                  {quotation.items} items
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">{quotation.date}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Valid until:</span>
                <span className="text-sm text-gray-900">
                  {quotation.validUntil}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <motion.button
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewQuotation(quotation)}
              >
                View
              </motion.button>
              <motion.button
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditQuotation(quotation)}
              >
                Edit
              </motion.button>
              <motion.button
                className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoreActions(quotation)}
              >
                <Icon icon="lucide:more-horizontal" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuotations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Icon
            icon="lucide:file-text"
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quotations found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first quotation.
          </p>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate?.("quotations-create")}
          >
            Create Quotation
          </motion.button>
        </div>
      )}

      {/* View Quotation Modal */}
      {showViewModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Quotation Details - {selectedQuotation.id}
                </h2>
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowViewModal(false)}
                >
                  <Icon icon="lucide:x" className="text-xl" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <p className="text-lg text-gray-900">
                      {selectedQuotation.client}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedQuotation.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedQuotation.status
                      )}`}
                    >
                      <Icon
                        icon={getStatusIcon(selectedQuotation.status)}
                        className="w-4 h-4 mr-2"
                      />
                      {selectedQuotation.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created Date
                    </label>
                    <p className="text-lg text-gray-900">
                      {selectedQuotation.date}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <p className="text-lg text-gray-900">
                      {selectedQuotation.validUntil}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Items Count
                    </label>
                    <p className="text-lg text-gray-900">
                      {selectedQuotation.items} items
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <motion.button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </motion.button>
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditQuotation(selectedQuotation);
                  }}
                >
                  Edit Quotation
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
