import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ProductFilters as ProductFiltersType } from './product-catalog';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  categories: string[];
  manufacturers: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  manufacturers,
}) => {
  const updateFilter = (key: keyof ProductFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      type: '',
      inStock: null,
      priceRange: null,
      search: '',
      manufacturer: '',
      status: 'active',
    });
  };

  const hasActiveFilters = () => {
    return filters.category || filters.type || filters.inStock !== null || 
           filters.priceRange || filters.search || filters.manufacturer || 
           filters.status !== 'active';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <motion.button
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
          >
            Clear All
          </motion.button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            <Icon 
              icon="lucide:search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
            <option value="SUBSCRIPTION">Subscription</option>
            <option value="BUNDLE">Bundle</option>
          </select>
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manufacturer
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.manufacturer}
            onChange={(e) => updateFilter('manufacturer', e.target.value)}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="stockStatus"
                className="mr-2"
                checked={filters.inStock === null}
                onChange={() => updateFilter('inStock', null)}
              />
              <span className="text-sm text-gray-700">All Products</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stockStatus"
                className="mr-2"
                checked={filters.inStock === true}
                onChange={() => updateFilter('inStock', true)}
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stockStatus"
                className="mr-2"
                checked={filters.inStock === false}
                onChange={() => updateFilter('inStock', false)}
              />
              <span className="text-sm text-gray-700">Out of Stock</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.priceRange?.min || ''}
              onChange={(e) => {
                const min = e.target.value ? parseFloat(e.target.value) : 0;
                updateFilter('priceRange', {
                  min,
                  max: filters.priceRange?.max || 999999,
                });
              }}
            />
            <input
              type="number"
              placeholder="Max"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.priceRange?.max || ''}
              onChange={(e) => {
                const max = e.target.value ? parseFloat(e.target.value) : 999999;
                updateFilter('priceRange', {
                  min: filters.priceRange?.min || 0,
                  max,
                });
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Filters
          </label>
          <div className="space-y-2">
            <motion.button
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                updateFilter('type', 'BUNDLE');
                updateFilter('status', 'active');
              }}
            >
              <span>Active Bundles</span>
              <Icon icon="lucide:package" className="text-gray-500" />
            </motion.button>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                updateFilter('inStock', false);
                updateFilter('type', 'PRODUCT');
              }}
            >
              <span>Out of Stock Products</span>
              <Icon icon="lucide:alert-triangle" className="text-red-500" />
            </motion.button>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                updateFilter('type', 'SERVICE');
                updateFilter('status', 'active');
              }}
            >
              <span>Active Services</span>
              <Icon icon="lucide:settings" className="text-blue-500" />
            </motion.button>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                updateFilter('priceRange', { min: 10000, max: 999999 });
                updateFilter('status', 'active');
              }}
            >
              <span>High Value Items</span>
              <Icon icon="lucide:dollar-sign" className="text-green-500" />
            </motion.button>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters() && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="space-y-1">
              {filters.search && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Search:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    "{filters.search}"
                  </span>
                </div>
              )}
              {filters.category && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{filters.category}</span>
                </div>
              )}
              {filters.type && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{filters.type}</span>
                </div>
              )}
              {filters.manufacturer && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Manufacturer:</span>
                  <span className="font-medium text-gray-900">{filters.manufacturer}</span>
                </div>
              )}
              {filters.inStock !== null && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium text-gray-900">
                    {filters.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              )}
              {filters.priceRange && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900">
                    ${filters.priceRange.min} - ${filters.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
