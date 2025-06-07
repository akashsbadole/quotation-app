import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Product } from './product-catalog';

interface InventoryTrackerProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
}

interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

export const InventoryTracker: React.FC<InventoryTrackerProps> = ({
  products,
  onProductUpdate,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Mock stock movements data
  const [stockMovements] = useState<StockMovement[]>([
    {
      id: 'mov-1',
      productId: 'prod-1',
      type: 'in',
      quantity: 100,
      reason: 'Initial stock',
      date: '2024-01-15T10:00:00Z',
      user: 'Admin',
    },
    {
      id: 'mov-2',
      productId: 'prod-1',
      type: 'out',
      quantity: 25,
      reason: 'Sale - QUO-202412-0001',
      date: '2024-12-01T14:30:00Z',
      user: 'Sales Team',
    },
    {
      id: 'mov-3',
      productId: 'prod-3',
      type: 'adjustment',
      quantity: -5,
      reason: 'Damaged goods',
      date: '2024-11-28T09:15:00Z',
      user: 'Warehouse',
    },
  ]);

  const getLowStockProducts = () => {
    return products.filter(p => !p.isService && p.stockLevel <= p.minStock);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => !p.isService && !p.inStock);
  };

  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => {
      if (product.isService) return total;
      return total + (product.stockLevel * (product.costPrice || product.price));
    }, 0);
  };

  const getStockStatusColor = (product: Product) => {
    if (!product.inStock) return 'bg-red-100 text-red-800';
    if (product.stockLevel <= product.minStock) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (product: Product) => {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockLevel <= product.minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return 'lucide:arrow-down-circle';
      case 'out':
        return 'lucide:arrow-up-circle';
      case 'adjustment':
        return 'lucide:edit-3';
      default:
        return 'lucide:circle';
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'text-green-600';
      case 'out':
        return 'text-red-600';
      case 'adjustment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

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

  const handleStockAdjustment = () => {
    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      stockLevel: Math.max(0, selectedProduct.stockLevel + adjustmentQuantity),
      inStock: (selectedProduct.stockLevel + adjustmentQuantity) > 0,
    };

    onProductUpdate(updatedProduct);
    setSelectedProduct(updatedProduct);
    setShowAdjustmentModal(false);
    setAdjustmentQuantity(0);
    setAdjustmentReason('');
  };

  const getProductMovements = (productId: string) => {
    return stockMovements.filter(m => m.productId === productId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Inventory Tracker</h3>
        <p className="text-sm text-gray-600">Monitor and manage product inventory levels</p>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon icon="lucide:package" className="text-2xl text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Icon icon="lucide:alert-triangle" className="text-2xl text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{getLowStockProducts().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Icon icon="lucide:x-circle" className="text-2xl text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{getOutOfStockProducts().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon icon="lucide:dollar-sign" className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalInventoryValue())}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Product Inventory</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                  selectedProduct?.id === product.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:package" className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.stockLevel}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product)}`}>
                      {getStockStatusText(product)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details & Stock Movements */}
        <div className="space-y-4">
          {selectedProduct ? (
            <>
              {/* Product Stock Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Stock Details</h4>
                  <motion.button
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdjustmentModal(true)}
                  >
                    Adjust Stock
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{selectedProduct.name}</h5>
                    <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-xl font-bold text-gray-900">{selectedProduct.stockLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Minimum Stock</p>
                      <p className="text-xl font-bold text-gray-900">{selectedProduct.minStock}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Unit Cost</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(selectedProduct.costPrice || selectedProduct.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(selectedProduct.stockLevel * (selectedProduct.costPrice || selectedProduct.price))}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStockStatusColor(selectedProduct)}`}>
                      {getStockStatusText(selectedProduct)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Movements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">Recent Movements</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {getProductMovements(selectedProduct.id).length > 0 ? (
                    getProductMovements(selectedProduct.id).map((movement) => (
                      <div key={movement.id} className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon 
                              icon={getMovementIcon(movement.type)} 
                              className={`text-lg ${getMovementColor(movement.type)}`} 
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                                {Math.abs(movement.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">{movement.reason}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">{formatDate(movement.date)}</p>
                            <p className="text-sm text-gray-500">{movement.user}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Icon icon="lucide:history" className="text-2xl mx-auto mb-2" />
                      <p className="text-sm">No movements recorded</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Icon icon="lucide:package" className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Select a product to view inventory details</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Stock</h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                <p className="text-sm text-gray-500">Current Stock: {selectedProduct.stockLevel}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter positive or negative number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  New stock level: {Math.max(0, selectedProduct.stockLevel + adjustmentQuantity)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Reason for adjustment"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <motion.button
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdjustmentModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStockAdjustment}
                disabled={!adjustmentReason.trim()}
              >
                Adjust Stock
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
