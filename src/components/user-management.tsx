import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "sales" | "viewer";
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface UserManagementProps {
  onNavigate?: (section: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "permissions">(
    "users"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "sales" as const,
    department: "",
    phone: "",
    isActive: true,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "user-1",
        name: "John Smith",
        email: "john.smith@company.com",
        role: "admin",
        department: "IT",
        status: "active",
        lastLogin: "2024-12-01T10:30:00Z",
        createdAt: "2024-01-15T09:00:00Z",
        permissions: ["all"],
      },
      {
        id: "user-2",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        role: "manager",
        department: "Sales",
        status: "active",
        lastLogin: "2024-12-01T14:15:00Z",
        createdAt: "2024-02-01T10:30:00Z",
        permissions: ["quotations.manage", "customers.view", "reports.view"],
      },
      {
        id: "user-3",
        name: "Mike Davis",
        email: "mike.davis@company.com",
        role: "sales",
        department: "Sales",
        status: "active",
        lastLogin: "2024-11-30T16:45:00Z",
        createdAt: "2024-03-10T11:15:00Z",
        permissions: ["quotations.create", "customers.view"],
      },
      {
        id: "user-4",
        name: "Emily Chen",
        email: "emily.chen@company.com",
        role: "viewer",
        department: "Finance",
        status: "inactive",
        lastLogin: "2024-11-25T09:20:00Z",
        createdAt: "2024-04-05T14:00:00Z",
        permissions: ["reports.view"],
      },
      {
        id: "user-5",
        name: "David Wilson",
        email: "david.wilson@company.com",
        role: "sales",
        department: "Sales",
        status: "pending",
        lastLogin: "",
        createdAt: "2024-11-28T16:30:00Z",
        permissions: ["quotations.create", "customers.view"],
      },
    ];

    const mockRoles: Role[] = [
      {
        id: "admin",
        name: "Administrator",
        description: "Full system access with all permissions",
        permissions: ["all"],
        userCount: 1,
      },
      {
        id: "manager",
        name: "Manager",
        description: "Management access with team oversight capabilities",
        permissions: [
          "quotations.manage",
          "customers.manage",
          "reports.view",
          "users.view",
        ],
        userCount: 1,
      },
      {
        id: "sales",
        name: "Sales Representative",
        description:
          "Sales-focused access for quotation and customer management",
        permissions: [
          "quotations.create",
          "quotations.edit",
          "customers.view",
          "customers.edit",
        ],
        userCount: 2,
      },
      {
        id: "viewer",
        name: "Viewer",
        description: "Read-only access for reporting and analytics",
        permissions: ["reports.view", "quotations.view"],
        userCount: 1,
      },
    ];

    setUsers(mockUsers);
    setRoles(mockRoles);
  }, []);

  const filteredUsers = users.filter((user) => {
    if (statusFilter !== "all" && user.status !== statusFilter) return false;
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "sales":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserStatusChange = (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all required fields");
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: newUser.isActive ? "active" : "inactive",
      lastLogin: "",
      createdAt: new Date().toISOString(),
      permissions: getPermissionsForRole(newUser.role),
    };

    setUsers((prev) => [...prev, user]);
    setNewUser({
      name: "",
      email: "",
      role: "sales",
      department: "",
      phone: "",
      isActive: true,
    });
    setShowUserModal(false);
    alert("User added successfully!");
  };

  const getPermissionsForRole = (role: string): string[] => {
    switch (role) {
      case "admin":
        return ["all"];
      case "manager":
        return [
          "quotations.manage",
          "customers.manage",
          "reports.view",
          "users.view",
        ];
      case "sales":
        return [
          "quotations.create",
          "quotations.edit",
          "customers.view",
          "customers.edit",
        ];
      case "viewer":
        return ["reports.view", "quotations.view"];
      default:
        return ["quotations.view"];
    }
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
                onClick={() => onNavigate?.("settings-users")}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserModal(true)}
              >
                <Icon icon="lucide:plus" className="text-lg" />
                <span>Add User</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              {
                id: "users",
                name: "Users",
                icon: "lucide:users",
                count: users.length,
              },
              {
                id: "roles",
                name: "Roles",
                icon: "lucide:shield",
                count: roles.length,
              },
              { id: "permissions", name: "Permissions", icon: "lucide:key" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon icon={tab.icon} className="text-sm" />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon
                      icon="lucide:search"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <Icon
                                  icon="lucide:user"
                                  className="text-blue-600"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <motion.button
                                className="text-blue-600 hover:text-blue-900"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedUser(user)}
                              >
                                <Icon icon="lucide:edit" />
                              </motion.button>
                              {user.status === "active" ? (
                                <motion.button
                                  className="text-yellow-600 hover:text-yellow-900"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleUserStatusChange(user.id, "inactive")
                                  }
                                >
                                  <Icon icon="lucide:pause" />
                                </motion.button>
                              ) : (
                                <motion.button
                                  className="text-green-600 hover:text-green-900"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleUserStatusChange(user.id, "active")
                                  }
                                >
                                  <Icon icon="lucide:play" />
                                </motion.button>
                              )}
                              <motion.button
                                className="text-red-600 hover:text-red-900"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Icon icon="lucide:trash-2" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "roles" && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="lucide:shield"
                            className="text-2xl text-blue-600"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {role.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {role.userCount} users
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {role.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Permissions:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <span
                            key={permission}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit Role
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "permissions" && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon
                  icon="lucide:key"
                  className="text-6xl text-blue-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Permission Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Configure detailed permissions and access controls
                </p>
                <p className="text-sm text-gray-500">
                  Advanced permission management coming soon
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add User Modal Placeholder */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Add New User
              </h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserModal(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sales">Sales Representative</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newUser.isActive}
                  onChange={(e) =>
                    setNewUser({ ...newUser, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active user
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddUser}
              >
                Add User
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
