import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Product } from './product-catalog';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onProductSelect: (product: Product) => void;
  selectedProduct: Product | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onProductSelect,
  selectedProduct,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return 'bg-blue-100 text-blue-800';
      case 'SERVICE':
        return 'bg-green-100 text-green-800';
      case 'SUBSCRIPTION':
        return 'bg-purple-100 text-purple-800';
      case 'BUNDLE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon icon="lucide:package" className="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
        <motion.button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add New Product
        </motion.button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
              selectedProduct?.id === product.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onProductSelect(product)}
            layout
          >
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${product.images.length > 0 ? 'hidden' : ''} text-center`}>
                <Icon icon={getProductTypeIcon(product.type)} className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{product.type}</p>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProductTypeColor(product.type)}`}>
                  {product.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-gray-500">per {product.unit}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product)}`}>
                  {getStockStatusText(product)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>SKU: {product.sku}</span>
                {!product.isService && (
                  <span>Stock: {product.stockLevel}</span>
                )}
              </div>

              {/* Pricing Tiers */}
              {product.pricingTiers.length > 1 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Volume Pricing:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.pricingTiers.slice(0, 2).map((tier, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tier.minQty}+ @ {formatCurrency(tier.price)}
                      </span>
                    ))}
                    {product.pricingTiers.length > 2 && (
                      <span className="text-xs text-gray-500">+{product.pricingTiers.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Product Actions */}
              <div className="flex space-x-2">
                <motion.button
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Add to quote:', product.id);
                  }}
                >
                  Add to Quote
                </motion.button>
                <motion.button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit product:', product.id);
                  }}
                >
                  <Icon icon="lucide:edit" className="text-lg" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
            {products.map((product) => (
              <motion.tr
                key={product.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => onProductSelect(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon icon={getProductTypeIcon(product.type)} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProductTypeColor(product.type)}`}>
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                  <div className="text-sm text-gray-500">per {product.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.isService ? (
                    <span className="text-sm text-gray-500">N/A</span>
                  ) : (
                    <div className="text-sm text-gray-900">{product.stockLevel}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(product)}`}>
                    {getStockStatusText(product)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <motion.button
                      className="text-blue-600 hover:text-blue-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Add to quote:', product.id);
                      }}
                    >
                      Add to Quote
                    </motion.button>
                    <motion.button
                      className="text-gray-600 hover:text-gray-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit product:', product.id);
                      }}
                    >
                      <Icon icon="lucide:edit" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
