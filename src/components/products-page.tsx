import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface ProductsPageProps {
  onNavigate?: (section: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    inStock: true,
  });

  const products = [
    {
      id: 1,
      name: "Professional Website Design",
      category: "Web Development",
      price: 2500,
      description: "Custom responsive website design with modern UI/UX",
      image: "🌐",
      inStock: true,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "E-commerce Platform",
      category: "Web Development",
      price: 5000,
      description: "Full-featured online store with payment integration",
      image: "🛒",
      inStock: true,
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Mobile App Development",
      category: "Mobile",
      price: 8000,
      description: "Native iOS and Android app development",
      image: "📱",
      inStock: true,
      lastUpdated: "2024-01-13",
    },
    {
      id: 4,
      name: "SEO Optimization Package",
      category: "Marketing",
      price: 1200,
      description: "Complete SEO audit and optimization service",
      image: "📈",
      inStock: true,
      lastUpdated: "2024-01-12",
    },
    {
      id: 5,
      name: "Brand Identity Design",
      category: "Design",
      price: 1800,
      description: "Logo design, brand guidelines, and marketing materials",
      image: "🎨",
      inStock: false,
      lastUpdated: "2024-01-11",
    },
    {
      id: 6,
      name: "Cloud Infrastructure Setup",
      category: "Infrastructure",
      price: 3500,
      description: "AWS/Azure cloud setup and configuration",
      image: "☁️",
      inStock: true,
      lastUpdated: "2024-01-10",
    },
  ];

  const categories = [
    "all",
    "Web Development",
    "Mobile",
    "Marketing",
    "Design",
    "Infrastructure",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    onNavigate?.("add-product");
  };

  const handleImportProducts = () => {
    setShowImportModal(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sku: product.sku || "",
      inStock: product.inStock,
    });
    setShowEditModal(true);
  };

  const handleAddToQuote = (product: any) => {
    // Navigate to create quotation with pre-selected product
    onNavigate?.(`quotations-create?product=${product.id}`);
  };

  const handleSaveProduct = () => {
    // In a real app, this would save to the database
    console.log("Saving product:", newProduct);
    setShowAddModal(false);
    setShowEditModal(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      sku: "",
      inStock: true,
    });
    alert("Product saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products & Services
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog and service offerings
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <motion.button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProduct}
            >
              <Icon icon="lucide:plus" />
              <span>Add Product</span>
            </motion.button>
            <motion.button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleImportProducts}
            >
              <Icon icon="lucide:upload" />
              <span>Import</span>
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Product Image/Icon */}
            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "Available" : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{product.category}</p>
              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  Updated {product.lastUpdated}
                </span>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditProduct(product)}
                >
                  Edit Product
                </motion.button>
                <motion.button
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToQuote(product)}
                >
                  Add to Quote
                </motion.button>
                <motion.button
                  className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon icon="lucide:more-horizontal" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Icon
            icon="lucide:package"
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first product or service.
          </p>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProduct}
          >
            Add Product
          </motion.button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {products.length}
          </div>
          <div className="text-sm text-gray-500">Total Products</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.inStock).length}
          </div>
          <div className="text-sm text-gray-500">Available</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {products.filter((p) => !p.inStock).length}
          </div>
          <div className="text-sm text-gray-500">Out of Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            $
            {(
              products.reduce((sum, p) => sum + p.price, 0) / products.length
            ).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Avg. Price</div>
        </div>
      </div>
    </div>
  );
};
