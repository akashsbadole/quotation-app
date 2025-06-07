import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Product } from './product-catalog';

interface ProductDetailsProps {
  product: Product;
  onProductUpdate: (product: Product) => void;
  onProductDelete: (productId: string) => void;
  onClose: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onProductUpdate,
  onProductDelete,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'inventory' | 'documents'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return 'lucide:package';
      case 'SERVICE':
        return 'lucide:settings';
      case 'SUBSCRIPTION':
        return 'lucide:refresh-cw';
      case 'BUNDLE':
        return 'lucide:layers';
      default:
        return 'lucide:box';
    }
  };

  const getStockStatusColor = (product: Product) => {
    if (product.isService) return 'bg-blue-100 text-blue-800';
    if (!product.inStock) return 'bg-red-100 text-red-800';
    if (product.stockLevel <= product.minStock) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (product: Product) => {
    if (product.isService) return 'Available';
    if (!product.inStock) return 'Out of Stock';
    if (product.stockLevel <= product.minStock) return 'Low Stock';
    return 'In Stock';
  };

  const handleSave = () => {
    onProductUpdate(editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onProductDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <motion.button
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
              >
                <Icon icon="lucide:edit" className="text-lg" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
              >
                <Icon icon="lucide:trash-2" className="text-lg" />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
              >
                <Icon icon="lucide:check" className="text-lg" />
              </motion.button>
              <motion.button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
              >
                <Icon icon="lucide:x" className="text-lg" />
              </motion.button>
            </>
          )}
          <motion.button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <Icon icon="lucide:x" className="text-lg" />
          </motion.button>
        </div>
      </div>

      {/* Product Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon icon={getProductTypeIcon(product.type)} className="text-2xl text-gray-600" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                className="text-lg font-semibold text-gray-900 w-full border border-gray-300 rounded px-2 py-1"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
              />
            ) : (
              <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
            )}
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
            <p className="text-sm text-gray-500">per {product.unit}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(product)}`}>
            {getStockStatusText(product)}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', name: 'Overview', icon: 'lucide:info' },
            { id: 'pricing', name: 'Pricing', icon: 'lucide:dollar-sign' },
            { id: 'inventory', name: 'Inventory', icon: 'lucide:package' },
            { id: 'documents', name: 'Documents', icon: 'lucide:file-text' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon icon={tab.icon} className="text-sm" />
              <span className="hidden sm:inline">{tab.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {isEditing ? (
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    rows={3}
                    value={editedProduct.description}
                    onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{product.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-sm text-gray-900">{product.type}</p>
                </div>
              </div>

              {product.manufacturer && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <p className="text-sm text-gray-900">{product.manufacturer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <p className="text-sm text-gray-900">{product.brand}</p>
                  </div>
                </div>
              )}

              {product.specifications && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">{formatDate(product.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <span className="ml-2 text-gray-900">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
                  <p className="text-sm text-gray-900">{product.marginPercent}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate</label>
                  <p className="text-sm text-gray-900">{product.tax}%</p>
                </div>
              </div>

              {product.pricingTiers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume Pricing</label>
                  <div className="space-y-2">
                    {product.pricingTiers.map((tier, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{tier.name}</p>
                          <p className="text-sm text-gray-600">
                            {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(tier.price)}</p>
                          {tier.discount > 0 && (
                            <p className="text-sm text-green-600">-{tier.discount}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {product.isService ? (
                <div className="text-center py-8">
                  <Icon icon="lucide:settings" className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Services don't have inventory tracking</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                      <p className="text-2xl font-bold text-gray-900">{product.stockLevel}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                      <p className="text-2xl font-bold text-gray-900">{product.minStock}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(product)}`}>
                      {getStockStatusText(product)}
                    </span>
                  </div>

                  {product.weight && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <p className="text-sm text-gray-900">{product.weight} kg</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                        <p className="text-sm text-gray-900">{product.dimensions || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Icon icon="lucide:alert-triangle" className="text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        {product.stockLevel <= product.minStock
                          ? 'Stock level is below minimum threshold'
                          : 'Stock level is healthy'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {product.documents.length > 0 ? (
                <div className="space-y-3">
                  {product.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon icon="lucide:file-text" className="text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <motion.button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        Download
                      </motion.button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="lucide:file-text" className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No documents available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => console.log('Add to quote:', product.id)}
        >
          Add to Quote
        </motion.button>
      </div>
    </div>
  );
};
