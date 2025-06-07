import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { firebaseNotificationService } from '../services/firebase-notification.service';

interface ProductData {
  id?: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  unitOfMeasure: string;
  taxRate: number;
  isService: boolean;
  isActive: boolean;
  minStock?: number;
  maxStock?: number;
  currentStock?: number;
  supplier?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface AddProductProps {
  onNavigate?: (section: string) => void;
  editingProduct?: ProductData | null;
  onSave?: (product: ProductData) => void;
  onCancel?: () => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ 
  onNavigate, 
  editingProduct, 
  onSave, 
  onCancel 
}) => {
  const [productData, setProductData] = useState<ProductData>({
    name: editingProduct?.name || '',
    description: editingProduct?.description || '',
    sku: editingProduct?.sku || '',
    category: editingProduct?.category || '',
    unitPrice: editingProduct?.unitPrice || 0,
    costPrice: editingProduct?.costPrice || 0,
    unitOfMeasure: editingProduct?.unitOfMeasure || 'each',
    taxRate: editingProduct?.taxRate || 0,
    isService: editingProduct?.isService || false,
    isActive: editingProduct?.isActive !== undefined ? editingProduct.isActive : true,
    minStock: editingProduct?.minStock || 0,
    maxStock: editingProduct?.maxStock || 0,
    currentStock: editingProduct?.currentStock || 0,
    supplier: editingProduct?.supplier || '',
    barcode: editingProduct?.barcode || '',
    weight: editingProduct?.weight || 0,
    dimensions: editingProduct?.dimensions || '',
    imageUrl: editingProduct?.imageUrl || '',
    tags: editingProduct?.tags || []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Electronics',
    'Software',
    'Services',
    'Hardware',
    'Accessories',
    'Consulting',
    'Training',
    'Support',
    'Licenses',
    'Other'
  ];

  const unitsOfMeasure = [
    'each',
    'hour',
    'day',
    'month',
    'year',
    'kg',
    'lb',
    'meter',
    'foot',
    'liter',
    'gallon'
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!productData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!productData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!productData.category) {
      newErrors.category = 'Category is required';
    }

    if (productData.unitPrice < 0) {
      newErrors.unitPrice = 'Unit price cannot be negative';
    }

    if (productData.costPrice < 0) {
      newErrors.costPrice = 'Cost price cannot be negative';
    }

    if (productData.taxRate < 0 || productData.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !productData.tags?.includes(tagInput.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const generateSKU = () => {
    const prefix = productData.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const generatedSKU = `${prefix}-${timestamp}`;
    handleInputChange('sku', generatedSKU);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productToSave: ProductData = {
        ...productData,
        id: editingProduct?.id || `product-${Date.now()}`,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      if (editingProduct) {
        // Update existing product
        const index = existingProducts.findIndex((p: ProductData) => p.id === editingProduct.id);
        if (index !== -1) {
          existingProducts[index] = productToSave;
        }
      } else {
        // Add new product
        existingProducts.push(productToSave);
      }

      localStorage.setItem('products', JSON.stringify(existingProducts));

      // Send notification
      await firebaseNotificationService.sendInAppNotification({
        title: editingProduct ? 'Product Updated' : 'New Product Added',
        message: `${productToSave.name} has been ${editingProduct ? 'updated' : 'added'} successfully`,
        type: 'success',
        priority: 'medium',
        data: productToSave,
        actionUrl: '/products/list',
        actionText: 'View Products'
      });

      // Call parent callback if provided
      if (onSave) {
        onSave(productToSave);
      } else {
        alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        onNavigate?.('products-list');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onNavigate?.('products-list');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {editingProduct ? 'Update product information' : 'Create a new product or service'}
          </p>
        </div>
        <motion.button
          className="text-gray-600 hover:text-gray-900"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCancel}
        >
          <Icon icon="lucide:x" className="text-2xl" />
        </motion.button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={productData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.sku ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter SKU"
                  />
                  <motion.button
                    type="button"
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateSKU}
                    title="Generate SKU"
                  >
                    <Icon icon="lucide:refresh-cw" />
                  </motion.button>
                </div>
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure
                </label>
                <select
                  value={productData.unitOfMeasure}
                  onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {unitsOfMeasure.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.unitPrice && <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.costPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={productData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.taxRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.taxRate && <p className="text-red-500 text-sm mt-1">{errors.taxRate}</p>}
              </div>
            </div>
          </div>

          {/* Inventory (only for physical products) */}
          {!productData.isService && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productData.currentStock}
                    onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productData.minStock}
                    onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productData.maxStock}
                    onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={productData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  value={productData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter barcode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={productData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="L x W x H"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <motion.button
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <Icon icon="lucide:x" className="text-xs" />
                    </motion.button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <motion.button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                >
                  Add
                </motion.button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isService"
                  checked={productData.isService}
                  onChange={(e) => handleInputChange('isService', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isService" className="text-sm text-gray-700">
                  This is a service
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={productData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <Icon icon="lucide:loader-2" className="animate-spin" />}
            <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
