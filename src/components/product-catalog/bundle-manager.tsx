import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Product } from './product-catalog';

interface BundleManagerProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
}

export const BundleManager: React.FC<BundleManagerProps> = ({
  products,
  onProductUpdate,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const bundles = products.filter(p => p.isBundle);
  const availableProducts = products.filter(p => !p.isBundle);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBundleComponents = (bundle: Product) => {
    if (!bundle.bundleItems) return [];
    return bundle.bundleItems.map(item => {
      const component = products.find(p => p.id === item.componentId);
      return component ? { ...component, bundleQuantity: item.quantity, bundleDiscount: item.discount } : null;
    }).filter(Boolean);
  };

  const calculateBundleValue = (bundle: Product) => {
    const components = getBundleComponents(bundle);
    return components.reduce((total, component) => {
      if (!component) return total;
      const discountedPrice = component.price * (1 - component.bundleDiscount / 100);
      return total + (discountedPrice * component.bundleQuantity);
    }, 0);
  };

  const calculateBundleSavings = (bundle: Product) => {
    const originalValue = getBundleComponents(bundle).reduce((total, component) => {
      if (!component) return total;
      return total + (component.price * component.bundleQuantity);
    }, 0);
    const bundleValue = calculateBundleValue(bundle);
    return originalValue - bundleValue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bundle Manager</h3>
          <p className="text-sm text-gray-600">Create and manage product bundles</p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
        >
          <Icon icon="lucide:plus" className="text-lg" />
          <span>Create Bundle</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bundles List */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Existing Bundles ({bundles.length})</h4>
          {bundles.length > 0 ? (
            <div className="space-y-3">
              {bundles.map((bundle) => (
                <motion.div
                  key={bundle.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedBundle?.id === bundle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedBundle(bundle)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon icon="lucide:layers" className="text-orange-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{bundle.name}</h5>
                        <p className="text-sm text-gray-500">SKU: {bundle.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(bundle.price)}</p>
                      <p className="text-sm text-green-600">
                        Save {formatCurrency(calculateBundleSavings(bundle))}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {getBundleComponents(bundle).length} components
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bundle.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bundle.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Icon icon="lucide:layers" className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">No bundles created yet</p>
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Bundle
              </motion.button>
            </div>
          )}
        </div>

        {/* Bundle Details */}
        <div>
          {selectedBundle ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Bundle Details</h4>
                <div className="flex space-x-2">
                  <motion.button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon icon="lucide:edit" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon icon="lucide:trash-2" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{selectedBundle.name}</h5>
                  <p className="text-sm text-gray-600">{selectedBundle.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bundle Price</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(selectedBundle.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Savings</p>
                    <p className="font-semibold text-green-600">{formatCurrency(calculateBundleSavings(selectedBundle))}</p>
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-gray-900 mb-3">Bundle Components</h6>
                  <div className="space-y-3">
                    {getBundleComponents(selectedBundle).map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Icon icon="lucide:package" className="text-gray-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{component?.name}</p>
                            <p className="text-sm text-gray-500">Qty: {component?.bundleQuantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency((component?.price || 0) * (1 - (component?.bundleDiscount || 0) / 100))}
                          </p>
                          {(component?.bundleDiscount || 0) > 0 && (
                            <p className="text-sm text-green-600">-{component?.bundleDiscount}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Value:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(calculateBundleValue(selectedBundle))}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Original Price:</span>
                    <span className="text-sm line-through text-gray-500">
                      {formatCurrency(calculateBundleValue(selectedBundle) + calculateBundleSavings(selectedBundle))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Icon icon="lucide:layers" className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Select a bundle to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Bundle Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Bundle Analytics</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{bundles.length}</p>
            <p className="text-sm text-gray-600">Total Bundles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{bundles.filter(b => b.status === 'active').length}</p>
            <p className="text-sm text-gray-600">Active Bundles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(bundles.reduce((total, bundle) => total + calculateBundleSavings(bundle), 0))}
            </p>
            <p className="text-sm text-gray-600">Total Savings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {bundles.length > 0 ? Math.round(bundles.reduce((total, bundle) => {
                const savings = calculateBundleSavings(bundle);
                const original = calculateBundleValue(bundle) + savings;
                return total + (original > 0 ? (savings / original) * 100 : 0);
              }, 0) / bundles.length) : 0}%
            </p>
            <p className="text-sm text-gray-600">Avg Discount</p>
          </div>
        </div>
      </div>

      {/* Create Bundle Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center py-8">
              <Icon icon="lucide:construction" className="text-6xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bundle Creator</h3>
              <p className="text-gray-600 mb-4">Advanced bundle creation interface coming soon</p>
              <motion.button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(false)}
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
