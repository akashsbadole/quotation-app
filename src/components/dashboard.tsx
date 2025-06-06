import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    {
      title: "Total Quotations",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: "lucide:file-text",
      color: "blue",
    },
    {
      title: "Active Clients",
      value: "567",
      change: "+8%",
      changeType: "increase",
      icon: "lucide:users",
      color: "green",
    },
    {
      title: "Revenue This Month",
      value: "$89,432",
      change: "+15%",
      changeType: "increase",
      icon: "lucide:dollar-sign",
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: "68%",
      change: "-2%",
      changeType: "decrease",
      icon: "lucide:trending-up",
      color: "orange",
    },
  ];

  const recentQuotations = [
    {
      id: "Q-2024-001",
      client: "Acme Corporation",
      amount: "$15,000",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "Q-2024-002",
      client: "Tech Solutions Inc",
      amount: "$8,500",
      status: "approved",
      date: "2024-01-14",
    },
    {
      id: "Q-2024-003",
      client: "Global Industries",
      amount: "$22,000",
      status: "draft",
      date: "2024-01-13",
    },
    {
      id: "Q-2024-004",
      client: "StartUp Co",
      amount: "$5,200",
      status: "rejected",
      date: "2024-01-12",
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

  const getStatColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      case "orange":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back! Here's what's happening with your quotations.
            </p>
          </div>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate?.("quotations-create")}
          >
            <Icon icon="lucide:plus" className="text-lg" />
            <span>New Quotation</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">
                    from last month
                  </span>
                </div>
              </div>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${getStatColor(
                  stat.color
                )} flex items-center justify-center flex-shrink-0 ml-3`}
              >
                <Icon
                  icon={stat.icon}
                  className="text-white text-lg sm:text-xl"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Quotations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Quotations
            </h2>
            <motion.button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate?.("quotations-list")}
            >
              View all
            </motion.button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200">
            {recentQuotations.map((quotation) => (
              <motion.div
                key={quotation.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    {quotation.id}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      quotation.status
                    )}`}
                  >
                    {quotation.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Client:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {quotation.client}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Amount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quotation.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Date:</span>
                    <span className="text-xs text-gray-500">
                      {quotation.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentQuotations.map((quotation) => (
                  <motion.tr
                    key={quotation.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quotation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quotation.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {quotation.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          quotation.status
                        )}`}
                      >
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quotation.date}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <motion.button
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("quotations-create")}
            >
              <Icon icon="lucide:plus" className="text-lg sm:text-xl" />
              <span>Create New Quotation</span>
            </motion.button>
            <motion.button
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("customers-list")}
            >
              <Icon icon="lucide:users" className="text-lg sm:text-xl" />
              <span>Manage Customers</span>
            </motion.button>
            <motion.button
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("products-catalog")}
            >
              <Icon icon="lucide:package" className="text-lg sm:text-xl" />
              <span>Product Catalog</span>
            </motion.button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                System Health
              </span>
              <span className="flex items-center text-green-600 text-sm sm:text-base">
                <Icon
                  icon="lucide:check-circle"
                  className="mr-1 text-sm sm:text-base"
                />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Database
              </span>
              <span className="flex items-center text-green-600 text-sm sm:text-base">
                <Icon
                  icon="lucide:check-circle"
                  className="mr-1 text-sm sm:text-base"
                />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Email Service
              </span>
              <span className="flex items-center text-green-600 text-sm sm:text-base">
                <Icon
                  icon="lucide:check-circle"
                  className="mr-1 text-sm sm:text-base"
                />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Backup Status
              </span>
              <span className="flex items-center text-blue-600 text-sm sm:text-base">
                <Icon
                  icon="lucide:clock"
                  className="mr-1 text-sm sm:text-base"
                />
                <span className="hidden sm:inline">Last: </span>2h ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            {
              action: "New quotation created",
              user: "John Smith",
              time: "5 minutes ago",
              icon: "lucide:file-plus",
            },
            {
              action: "Customer approved quotation Q-2024-001",
              user: "Acme Corp",
              time: "1 hour ago",
              icon: "lucide:check-circle",
            },
            {
              action: "Product pricing updated",
              user: "Admin",
              time: "2 hours ago",
              icon: "lucide:dollar-sign",
            },
            {
              action: "New customer registered",
              user: "Tech Solutions",
              time: "3 hours ago",
              icon: "lucide:user-plus",
            },
            {
              action: "Quotation template modified",
              user: "Sarah Johnson",
              time: "4 hours ago",
              icon: "lucide:edit",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon icon={activity.icon} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">2.3h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Quotations This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};
