import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { inventoryService } from "../services/inventory.service";

// Local interface for component (mapped from service interface)
interface LocalInventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "reorder";
}

interface InventoryManagementProps {
  onNavigate?: (section: string) => void;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = () => {
  const [items, setItems] = useState<LocalInventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LocalInventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categories = [
    "Electronics",
    "Software",
    "Services",
    "Hardware",
    "Accessories",
  ];
  const locations = ["Warehouse A", "Warehouse B", "Store Front", "Online"];

  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      const result = await inventoryService.getAllItems();
      if (result.success && result.data) {
        // Map service data to component interface
        const mappedItems = result.data.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          currentStock: item.current_stock,
          minStock: item.min_stock,
          maxStock: item.max_stock,
          unitPrice: item.unit_price,
          supplier: item.supplier,
          location: item.location,
          lastUpdated: item.last_updated,
          status: item.status,
        }));
        setItems(mappedItems);
        setFilteredItems(mappedItems);
      } else {
        console.error("Failed to load inventory items:", result.error);
      }
    } catch (error) {
      console.error("Error loading inventory items:", error);
    }
  };

  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "reorder":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return "lucide:check-circle";
      case "low-stock":
        return "lucide:alert-triangle";
      case "out-of-stock":
        return "lucide:x-circle";
      case "reorder":
        return "lucide:refresh-cw";
      default:
        return "lucide:help-circle";
    }
  };

  const handleStockUpdate = async (itemId: string, newStock: number) => {
    try {
      const result = await inventoryService.updateStock(
        itemId,
        newStock,
        "adjustment",
        "Manual stock update"
      );
      if (result.success) {
        // Reload inventory items to get updated data
        await loadInventoryItems();
        alert("Stock updated successfully!");
      } else {
        alert("Failed to update stock: " + result.error);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock. Please try again.");
    }
  };

  const lowStockCount = items.filter(
    (item) => item.status === "low-stock" || item.status === "out-of-stock"
  ).length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your product inventory
          </p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            alert("Add Item functionality would be implemented here")
          }
        >
          <Icon icon="lucide:plus" className="text-lg" />
          <span>Add Item</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Items",
            value: items.length,
            icon: "lucide:package",
            color: "blue",
          },
          {
            title: "Low Stock Alerts",
            value: lowStockCount,
            icon: "lucide:alert-triangle",
            color: "yellow",
          },
          {
            title: "Total Value",
            value: `$${totalValue.toLocaleString()}`,
            icon: "lucide:dollar-sign",
            color: "green",
          },
          {
            title: "Locations",
            value: locations.length,
            icon: "lucide:map-pin",
            color: "purple",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
              >
                <Icon
                  icon={stat.icon}
                  className={`text-${stat.color}-600 text-xl`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items, SKU, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Icon
                icon="lucide:search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="reorder">Reorder</option>
            </select>
          </div>
          <div className="flex items-end">
            <motion.button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
            >
              Clear Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {item.sku}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{item.currentStock}</span>
                      <span className="text-gray-500"> / {item.maxStock}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: $
                      {(item.currentStock * item.unitPrice).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <Icon
                        icon={getStatusIcon(item.status)}
                        className="mr-1"
                      />
                      {item.status.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <motion.button
                      className="text-blue-600 hover:text-blue-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        alert(
                          `Edit functionality for ${item.name} would be implemented here`
                        )
                      }
                    >
                      <Icon icon="lucide:edit" />
                    </motion.button>
                    <motion.button
                      className="text-green-600 hover:text-green-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const newStock = prompt(
                          `Update stock for ${item.name} (current: ${item.currentStock}):`
                        );
                        if (newStock !== null && !isNaN(Number(newStock))) {
                          handleStockUpdate(item.id, Number(newStock));
                        }
                      }}
                    >
                      <Icon icon="lucide:package" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Icon
            icon="lucide:package"
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or add new inventory items.
          </p>
        </div>
      )}
    </div>
  );
};
