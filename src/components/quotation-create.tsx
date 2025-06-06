import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: "percentage" | "fixed";
  taxRate: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
}

export const QuotationCreate: React.FC = () => {
  const [quotationData, setQuotationData] = useState({
    quotationNumber: `QT-${new Date().getFullYear()}-${String(Date.now()).slice(
      -6
    )}`,
    customerId: "",
    validUntil: "",
    currency: "USD",
    exchangeRate: 1,
    taxType: "inclusive",
    terms: "",
    notes: "",
    status: "draft",
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Sample customers
  const customers: Customer[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@acme.com",
      company: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      company: "Tech Solutions Inc",
      address: "456 Tech Ave, City, State 67890",
      phone: "+1 (555) 234-5678",
    },
  ];

  // Sample products
  const products = [
    {
      id: "1",
      name: "Professional Website Design",
      description: "Custom responsive website with modern UI/UX",
      price: 2500,
      category: "Web Development",
      taxRate: 10,
    },
    {
      id: "2",
      name: "E-commerce Platform",
      description: "Full-featured online store with payment integration",
      price: 5000,
      category: "Web Development",
      taxRate: 10,
    },
    {
      id: "3",
      name: "Mobile App Development",
      description: "Native iOS and Android app development",
      price: 8000,
      category: "Mobile",
      taxRate: 10,
    },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const addQuotationItem = (product: any) => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      description: product.description,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      discountType: "percentage",
      taxRate: product.taxRate,
      total: product.price,
    };
    setQuotationItems([...quotationItems, newItem]);
    setShowProductModal(false);
  };

  const updateQuotationItem = (itemId: string, field: string, value: any) => {
    setQuotationItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total
          const discountAmount =
            updatedItem.discountType === "percentage"
              ? (updatedItem.unitPrice *
                  updatedItem.quantity *
                  updatedItem.discount) /
                100
              : updatedItem.discount;

          const subtotal =
            updatedItem.unitPrice * updatedItem.quantity - discountAmount;
          const taxAmount = subtotal * (updatedItem.taxRate / 100);
          updatedItem.total = subtotal + taxAmount;

          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeQuotationItem = (itemId: string) => {
    setQuotationItems((items) => items.filter((item) => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = quotationItems.reduce((sum, item) => {
      const discountAmount =
        item.discountType === "percentage"
          ? (item.unitPrice * item.quantity * item.discount) / 100
          : item.discount;
      return sum + item.unitPrice * item.quantity - discountAmount;
    }, 0);

    const totalTax = quotationItems.reduce((sum, item) => {
      const discountAmount =
        item.discountType === "percentage"
          ? (item.unitPrice * item.quantity * item.discount) / 100
          : item.discount;
      const itemSubtotal = item.unitPrice * item.quantity - discountAmount;
      return sum + itemSubtotal * (item.taxRate / 100);
    }, 0);

    const total = subtotal + totalTax;

    return { subtotal, totalTax, total };
  };

  const { subtotal, totalTax, total } = calculateTotals();
  const selectedCurrency = currencies.find(
    (c) => c.code === quotationData.currency
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Quotation
            </h1>
            <p className="text-gray-600 mt-1">
              Generate professional quotations with automated calculations
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <motion.button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="lucide:save" />
              <span>Save Draft</span>
            </motion.button>
            <motion.button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="lucide:send" />
              <span>Send Quotation</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quotation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={quotationData.quotationNumber}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      quotationNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={quotationData.validUntil}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      validUntil: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={quotationData.currency}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Type
                </label>
                <select
                  value={quotationData.taxType}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      taxType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="inclusive">Tax Inclusive</option>
                  <option value="exclusive">Tax Exclusive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
              <motion.button
                onClick={() => setShowCustomerModal(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:search" />
                <span>Select Customer</span>
              </motion.button>
            </div>

            {selectedCustomer ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </h3>
                    <p className="text-gray-600">{selectedCustomer.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCustomer.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedCustomer.phone}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedCustomer.address}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon icon="lucide:x" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Icon
                  icon="lucide:users"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                />
                <p className="text-gray-500">No customer selected</p>
                <p className="text-sm text-gray-400">
                  Click "Select Customer" to choose a customer
                </p>
              </div>
            )}
          </div>

          {/* Quotation Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Quotation Items
              </h2>
              <motion.button
                onClick={() => setShowProductModal(true)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:plus" />
                <span>Add Item</span>
              </motion.button>
            </div>

            {quotationItems.length > 0 ? (
              <div className="space-y-4">
                {quotationItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => removeQuotationItem(item.id)}
                        className="text-red-400 hover:text-red-600 ml-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon icon="lucide:trash-2" />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuotationItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateQuotationItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Discount
                        </label>
                        <div className="flex space-x-1">
                          <input
                            type="number"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) =>
                              updateQuotationItem(
                                item.id,
                                "discount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                          <select
                            value={item.discountType}
                            onChange={(e) =>
                              updateQuotationItem(
                                item.id,
                                "discountType",
                                e.target.value
                              )
                            }
                            className="px-1 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="percentage">%</option>
                            <option value="fixed">
                              {selectedCurrency?.symbol}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.taxRate}
                          onChange={(e) =>
                            updateQuotationItem(
                              item.id,
                              "taxRate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded font-semibold">
                          {selectedCurrency?.symbol}
                          {item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Icon
                  icon="lucide:package"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                />
                <p className="text-gray-500">No items added</p>
                <p className="text-sm text-gray-400">
                  Click "Add Item" to add products or services
                </p>
              </div>
            )}
          </div>

          {/* Terms and Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Terms & Notes
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  rows={4}
                  value={quotationData.terms}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      terms: e.target.value,
                    })
                  }
                  placeholder="Enter payment terms, delivery conditions, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={quotationData.notes}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Internal notes (not visible to customer)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="lucide:copy" />
                <span>Duplicate Quotation</span>
              </motion.button>
              <motion.button
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="lucide:layout-template" />
                <span>Use Template</span>
              </motion.button>
              <motion.button
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon icon="lucide:file-text" />
                <span>Preview PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {selectedCurrency?.symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">
                  {selectedCurrency?.symbol}
                  {totalTax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedCurrency?.symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Customer
              </h3>
              <motion.button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {customers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setQuotationData({
                        ...quotationData,
                        customerId: customer.id,
                      });
                      setShowCustomerModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {customer.name}
                        </h4>
                        <p className="text-gray-600">{customer.company}</p>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                      <Icon
                        icon="lucide:chevron-right"
                        className="text-gray-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Product/Service
              </h3>
              <motion.button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => addQuotationItem(product)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.description}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${product.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Tax: {product.taxRate}%
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add to Quotation
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
