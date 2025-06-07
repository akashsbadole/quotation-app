import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ProductGrid } from './product-grid';
import { ProductFilters } from './product-filters';
import { ProductDetails } from './product-details';
import { BundleManager } from './bundle-manager';
import { InventoryTracker } from './inventory-tracker';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'PRODUCT' | 'SERVICE' | 'SUBSCRIPTION' | 'BUNDLE';
  price: number;
  unit: string;
  tax: number;
  category: string;
  sku: string;
  specifications?: Record<string, any>;
  images: string[];
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  weight?: number;
  dimensions?: string;
  manufacturer?: string;
  brand?: string;
  model?: string;
  warranty?: string;
  costPrice?: number;
  marginPercent: number;
  taxable: boolean;
  taxCategory: string;
  currency: string;
  inStock: boolean;
  stockLevel: number;
  minStock: number;
  isBundle: boolean;
  isService: boolean;
  bundleItems?: Array<{
    componentId: string;
    quantity: number;
    discount: number;
  }>;
  pricingTiers: Array<{
    name: string;
    minQty: number;
    maxQty?: number;
    price: number;
    discount: number;
  }>;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category: string;
  type: string;
  inStock: boolean | null;
  priceRange: { min: number; max: number } | null;
  search: string;
  manufacturer: string;
  status: string;
}

interface ProductCatalogProps {
  onNavigate?: (section: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'bundles' | 'inventory'>('catalog');
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    type: '',
    inStock: null,
    priceRange: null,
    search: '',
    manufacturer: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 'prod-1',
        name: 'Enterprise Software License',
        description: 'Comprehensive enterprise software solution with advanced features',
        type: 'PRODUCT',
        price: 20000,
        unit: 'license',
        tax: 10,
        category: 'Software',
        sku: 'ESL-2024-001',
        specifications: {
          users: 'Unlimited',
          storage: '1TB',
          support: '24/7',
          deployment: 'Cloud/On-premise',
        },
        images: ['/products/enterprise-software.jpg'],
        documents: [
          { name: 'Product Datasheet', url: '/docs/enterprise-software.pdf', type: 'pdf' },
          { name: 'Installation Guide', url: '/docs/installation.pdf', type: 'pdf' },
        ],
        manufacturer: 'TechCorp',
        brand: 'TechCorp',
        model: 'Enterprise Pro',
        warranty: '3 years',
        costPrice: 12000,
        marginPercent: 40,
        taxable: true,
        taxCategory: 'standard',
        currency: 'USD',
        inStock: true,
        stockLevel: 50,
        minStock: 10,
        isBundle: false,
        isService: false,
        pricingTiers: [
          { name: 'Standard', minQty: 1, maxQty: 10, price: 20000, discount: 0 },
          { name: 'Volume', minQty: 11, maxQty: 50, price: 18000, discount: 10 },
          { name: 'Enterprise', minQty: 51, price: 16000, discount: 20 },
        ],
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-12-01T15:30:00Z',
      },
      {
        id: 'prod-2',
        name: 'Professional Services Package',
        description: 'Comprehensive professional services including consultation and implementation',
        type: 'SERVICE',
        price: 150,
        unit: 'hour',
        tax: 8,
        category: 'Services',
        sku: 'PSP-2024-001',
        specifications: {
          expertise: 'Senior consultants',
          availability: 'Business hours',
          response: '4 hours',
        },
        images: ['/products/professional-services.jpg'],
        documents: [
          { name: 'Service Agreement', url: '/docs/service-agreement.pdf', type: 'pdf' },
        ],
        costPrice: 90,
        marginPercent: 40,
        taxable: true,
        taxCategory: 'services',
        currency: 'USD',
        inStock: true,
        stockLevel: 0, // Services don't have stock
        minStock: 0,
        isBundle: false,
        isService: true,
        pricingTiers: [
          { name: 'Standard', minQty: 1, maxQty: 40, price: 150, discount: 0 },
          { name: 'Bulk', minQty: 41, price: 135, discount: 10 },
        ],
        status: 'active',
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-11-15T14:20:00Z',
      },
      {
        id: 'prod-3',
        name: 'Complete Solution Bundle',
        description: 'Enterprise software license with professional services and support',
        type: 'BUNDLE',
        price: 25000,
        unit: 'bundle',
        tax: 10,
        category: 'Bundles',
        sku: 'CSB-2024-001',
        specifications: {
          includes: 'Software + Services + Support',
          duration: '1 year',
          savings: '15% vs individual purchase',
        },
        images: ['/products/complete-bundle.jpg'],
        documents: [
          { name: 'Bundle Overview', url: '/docs/bundle-overview.pdf', type: 'pdf' },
        ],
        costPrice: 15000,
        marginPercent: 40,
        taxable: true,
        taxCategory: 'standard',
        currency: 'USD',
        inStock: true,
        stockLevel: 25,
        minStock: 5,
        isBundle: true,
        isService: false,
        bundleItems: [
          { componentId: 'prod-1', quantity: 1, discount: 10 },
          { componentId: 'prod-2', quantity: 40, discount: 15 },
        ],
        pricingTiers: [
          { name: 'Standard', minQty: 1, price: 25000, discount: 0 },
        ],
        status: 'active',
        createdAt: '2024-03-10T11:30:00Z',
        updatedAt: '2024-12-05T16:45:00Z',
      },
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.type && product.type !== filters.type) return false;
      if (filters.inStock !== null && product.inStock !== filters.inStock) return false;
      if (filters.manufacturer && product.manufacturer !== filters.manufacturer) return false;
      if (filters.status && product.status !== filters.status) return false;
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.sku.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.priceRange && (product.price < filters.priceRange.min || product.price > filters.priceRange.max)) return false;
      return true;
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setSelectedProduct(updatedProduct);
  };

  const handleProductDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleCreateProduct = () => {
    // Navigate to product creation
    console.log('Navigate to product creation');
  };

  const getCategories = () => {
    return [...new Set(products.map(p => p.category))];
  };

  const getManufacturers = () => {
    return [...new Set(products.map(p => p.manufacturer).filter(Boolean))];
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
                onClick={() => onNavigate?.('products-catalog')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
                <p className="text-sm text-gray-600">Manage your products, services, and bundles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <motion.button
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                >
                  <Icon icon="lucide:grid-3x3" className="text-lg" />
                </motion.button>
                <motion.button
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                >
                  <Icon icon="lucide:list" className="text-lg" />
                </motion.button>
              </div>
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateProduct}
              >
                <Icon icon="lucide:plus" className="text-lg" />
                <span>Add Product</span>
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
              { id: 'catalog', name: 'Product Catalog', count: filteredProducts.length },
              { id: 'bundles', name: 'Bundle Manager' },
              { id: 'inventory', name: 'Inventory Tracker' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
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
          {activeTab === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-6"
            >
              {/* Filters Sidebar */}
              <div className="w-80 flex-shrink-0">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  categories={getCategories()}
                  manufacturers={getManufacturers()}
                />
              </div>

              {/* Products Grid/List */}
              <div className="flex-1">
                <ProductGrid
                  products={filteredProducts}
                  viewMode={viewMode}
                  onProductSelect={handleProductSelect}
                  selectedProduct={selectedProduct}
                />
              </div>

              {/* Product Details Panel */}
              {selectedProduct && (
                <div className="w-96 flex-shrink-0">
                  <ProductDetails
                    product={selectedProduct}
                    onProductUpdate={handleProductUpdate}
                    onProductDelete={handleProductDelete}
                    onClose={() => setSelectedProduct(null)}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'bundles' && (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BundleManager
                products={products}
                onProductUpdate={handleProductUpdate}
              />
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InventoryTracker
                products={products.filter(p => !p.isService)}
                onProductUpdate={handleProductUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
