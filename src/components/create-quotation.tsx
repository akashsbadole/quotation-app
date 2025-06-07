import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useBusinessTracking } from "../hooks/useGoogleAnalytics";
import { firebaseNotificationService } from "../services/firebase-notification.service";

interface QuotationItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sku?: string;
  category?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
}

interface CreateQuotationProps {
  onNavigate?: (section: string, data?: any) => void;
  templateId?: string;
  duplicateFromId?: string;
  editingQuotation?: any;
}

export const CreateQuotation: React.FC<CreateQuotationProps> = ({
  onNavigate,
  templateId,
  duplicateFromId,
  editingQuotation,
}) => {
  const [quotationData, setQuotationData] = useState({
    referenceNumber: editingQuotation?.referenceNumber || "",
    customerName: editingQuotation?.customerName || "",
    customerEmail: editingQuotation?.customerEmail || "",
    customerCompany: editingQuotation?.customerCompany || "",
    customerPhone: editingQuotation?.customerPhone || "",
    customerAddress: editingQuotation?.customerAddress || "",
    date: editingQuotation?.date || new Date().toISOString().split("T")[0],
    expiryDate: editingQuotation?.expiryDate || "",
    notes: editingQuotation?.notes || "",
    terms:
      editingQuotation?.terms || "Payment due within 30 days of acceptance.",
    status: editingQuotation?.status || ("draft" as const),
  });

  const [items, setItems] = useState<QuotationItem[]>(
    editingQuotation?.items || []
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingQuotations, setExistingQuotations] = useState<any[]>([]);

  // Google Analytics tracking
  const { trackQuotationCreated, trackQuotationSent } = useBusinessTracking();

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: "cust-1",
        name: "John Smith",
        email: "john@acme.com",
        company: "Acme Corporation",
        phone: "+1-555-0101",
        address: "123 Business St, San Francisco, CA 94105",
      },
      {
        id: "cust-2",
        name: "Sarah Johnson",
        email: "sarah@techsolutions.com",
        company: "Tech Solutions Inc",
        phone: "+1-555-0102",
        address: "456 Innovation Ave, Austin, TX 78701",
      },
    ];

    const mockTemplates: Template[] = [
      {
        id: "template-1",
        name: "Professional Services",
        description: "Standard template for professional services",
        content: "Professional services quotation template",
      },
      {
        id: "template-2",
        name: "Product Sales",
        description: "Template for product sales quotations",
        content: "Product sales quotation template",
      },
    ];

    const mockQuotations = [
      {
        id: "quo-001",
        referenceNumber: "QUO-2024-001",
        customerName: "Acme Corporation",
        customerEmail: "contact@acme.com",
        total: 15000,
        status: "approved",
        createdDate: "2024-01-15",
        items: [
          {
            id: "item-1",
            name: "Enterprise Software License",
            quantity: 2,
            unitPrice: 7500,
            total: 15000,
          },
        ],
      },
      {
        id: "quo-002",
        referenceNumber: "QUO-2024-002",
        customerName: "TechFlow Solutions",
        customerEmail: "hello@techflow.com",
        total: 8500,
        status: "pending",
        createdDate: "2024-01-20",
        items: [
          {
            id: "item-1",
            name: "Consulting Services",
            quantity: 40,
            unitPrice: 150,
            total: 6000,
          },
          {
            id: "item-2",
            name: "Setup Fee",
            quantity: 1,
            unitPrice: 2500,
            total: 2500,
          },
        ],
      },
      {
        id: "quo-003",
        referenceNumber: "QUO-2024-003",
        customerName: "Global Industries",
        customerEmail: "procurement@global.com",
        total: 25000,
        status: "draft",
        createdDate: "2024-01-25",
        items: [
          {
            id: "item-1",
            name: "Premium Package",
            quantity: 1,
            unitPrice: 25000,
            total: 25000,
          },
        ],
      },
    ];

    setCustomers(mockCustomers);
    setTemplates(mockTemplates);
    setExistingQuotations(mockQuotations);

    // Auto-generate reference number
    setQuotationData((prev) => ({
      ...prev,
      referenceNumber: `QUO-${new Date().getFullYear()}${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(
        4,
        "0"
      )}`,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
    }));

    // Handle template selection
    if (templateId) {
      const template = mockTemplates.find((t) => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }

    // Handle duplication
    if (duplicateFromId) {
      // In a real app, you would fetch the quotation data to duplicate
      console.log("Duplicating quotation:", duplicateFromId);
    }
  }, [templateId, duplicateFromId]);

  // Handle pre-selected items from navigation (e.g., from Add to Quote)
  useEffect(() => {
    if (
      editingQuotation?.items &&
      editingQuotation.items.length > 0 &&
      items.length === 0
    ) {
      setItems(editingQuotation.items);
    }
  }, [editingQuotation, items.length]);

  const addItem = () => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setQuotationData((prev) => ({
      ...prev,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCompany: customer.company,
      customerPhone: customer.phone || "",
      customerAddress: customer.address || "",
    }));
    setShowCustomerModal(false);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSaveDraft = async () => {
    // Validate minimum required data
    if (!quotationData.customerName) {
      alert(
        "Please select a customer or enter customer information before saving."
      );
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one item before saving.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create quotation object
      const quotationToSave = {
        ...quotationData,
        items,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving draft:", quotationToSave);

      // Track quotation creation
      trackQuotationCreated(quotationData.referenceNumber, calculateTotal());

      // In a real app, this would save to database
      localStorage.setItem(
        `quotation_draft_${quotationData.referenceNumber}`,
        JSON.stringify(quotationToSave)
      );

      // Send Firebase notification
      await firebaseNotificationService.sendInAppNotification({
        title: "Draft Saved",
        message: `Quotation ${quotationData.referenceNumber} saved as draft`,
        type: "success",
        priority: "low",
        data: quotationToSave,
        actionUrl: "/quotations/drafts",
        actionText: "View Drafts",
      });

      alert("Quotation saved as draft successfully!");
      onNavigate?.("quotations-list");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuotation = async () => {
    // Validate required data
    if (!quotationData.customerEmail) {
      alert("Please select a customer or enter customer email");
      return;
    }

    if (!quotationData.customerName) {
      alert("Please enter customer information before sending.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one item before sending.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create quotation object
      const quotationToSend = {
        ...quotationData,
        items,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: "sent",
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Sending quotation:", quotationToSend);

      // Track quotation sent
      trackQuotationSent(quotationData.referenceNumber, calculateTotal());

      // In a real app, this would send via email and save to database
      localStorage.setItem(
        `quotation_sent_${quotationData.referenceNumber}`,
        JSON.stringify(quotationToSend)
      );

      // Send Firebase notification
      await firebaseNotificationService.sendQuotationNotification("sent", {
        id: quotationData.referenceNumber,
        referenceNumber: quotationData.referenceNumber,
        customerName: quotationData.customerName,
        customerEmail: quotationData.customerEmail,
        total: calculateTotal(),
      });

      alert(
        `Quotation ${quotationData.referenceNumber} sent successfully to ${quotationData.customerEmail}!`
      );
      onNavigate?.("quotations-list");
    } catch (error) {
      console.error("Error sending quotation:", error);
      alert("Error sending quotation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = () => {
    // Validate that we have minimum required data
    if (!quotationData.customerName || items.length === 0) {
      alert(
        "Please add customer information and at least one item before previewing."
      );
      return;
    }

    // Create preview data
    const previewData = {
      ...quotationData,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      createdAt: new Date().toISOString(),
    };

    console.log("Preview data:", previewData);

    // In a real app, this would generate and show a PDF preview
    alert(
      `PDF Preview for ${quotationData.referenceNumber}\n\nCustomer: ${
        quotationData.customerName
      }\nItems: ${items.length}\nTotal: ${formatCurrency(
        calculateTotal()
      )}\n\nIn a real application, this would open a PDF preview window.`
    );

    setShowPreview(true);
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(false);

    // Populate form with template data
    if (template.name === "Service Quotation") {
      setItems([
        {
          id: `item-${Date.now()}`,
          name: "Consulting Services",
          description: "Professional consulting services",
          quantity: 10,
          unitPrice: 150,
          total: 1500,
        },
        {
          id: `item-${Date.now() + 1}`,
          name: "Setup Fee",
          description: "Initial setup and configuration",
          quantity: 1,
          unitPrice: 500,
          total: 500,
        },
      ]);
    } else if (template.name === "Product Sales") {
      setItems([
        {
          id: `item-${Date.now()}`,
          name: "Software License",
          description: "Annual software license",
          quantity: 1,
          unitPrice: 2000,
          total: 2000,
        },
      ]);
    }

    setQuotationData((prev) => ({
      ...prev,
      title: `Quotation from ${template.name} Template`,
      notes: `This quotation was created using the ${template.name} template.`,
    }));
  };

  const handleDuplicateQuotation = (quotation: any) => {
    // Populate form with existing quotation data
    setQuotationData((prev) => ({
      ...prev,
      customerName: quotation.customerName,
      customerEmail: quotation.customerEmail,
      title: `Copy of ${quotation.referenceNumber}`,
      notes: `This quotation was duplicated from ${quotation.referenceNumber}`,
    }));

    // Set items from the duplicated quotation
    const duplicatedItems = quotation.items.map((item: any) => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`, // Generate new IDs
    }));
    setItems(duplicatedItems);

    setShowDuplicateModal(false);

    // Show success message
    alert(
      `Quotation duplicated from ${quotation.referenceNumber} successfully!`
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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
                onClick={() => onNavigate?.("quotations-list")}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingQuotation ? "Edit Quotation" : "Create New Quotation"}
                </h1>
                <p className="text-sm text-gray-600">
                  {editingQuotation
                    ? `Editing quotation: ${editingQuotation.referenceNumber}`
                    : selectedTemplate
                    ? `Using template: ${selectedTemplate.name}`
                    : "Create a new quotation from scratch"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviewPDF}
                disabled={loading}
              >
                <Icon icon="lucide:eye" className="text-lg" />
                <span>Preview PDF</span>
              </motion.button>
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveDraft}
                disabled={loading}
              >
                <Icon icon="lucide:save" className="text-lg" />
                <span>{loading ? "Saving..." : "Save Draft"}</span>
              </motion.button>
              <motion.button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendQuotation}
                disabled={loading || !quotationData.customerEmail}
              >
                <Icon icon="lucide:send" className="text-lg" />
                <span>{loading ? "Sending..." : "Send Quotation"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTemplateModal(true)}
                >
                  <Icon
                    icon="lucide:file-text"
                    className="text-2xl text-blue-600 mb-2"
                  />
                  <h4 className="font-medium text-gray-900">Use Template</h4>
                  <p className="text-sm text-gray-600">
                    Start with a pre-built template
                  </p>
                </motion.button>
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDuplicateModal(true)}
                >
                  <Icon
                    icon="lucide:copy"
                    className="text-2xl text-green-600 mb-2"
                  />
                  <h4 className="font-medium text-gray-900">
                    Duplicate Quotation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Copy from existing quotation
                  </p>
                </motion.button>
                <motion.button
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePreviewPDF}
                >
                  <Icon
                    icon="lucide:eye"
                    className="text-2xl text-purple-600 mb-2"
                  />
                  <h4 className="font-medium text-gray-900">Preview PDF</h4>
                  <p className="text-sm text-gray-600">
                    Preview before sending
                  </p>
                </motion.button>
              </div>
            </div>

            {/* Quotation Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quotation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.referenceNumber}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        referenceNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.date}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.expiryDate}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Information
                </h3>
                <motion.button
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCustomerModal(true)}
                >
                  Select Customer
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.customerName}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.customerEmail}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        customerEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.customerCompany}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        customerCompany: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quotationData.customerPhone}
                    onChange={(e) =>
                      setQuotationData((prev) => ({
                        ...prev,
                        customerPhone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quotation Items
                </h3>
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addItem}
                >
                  <Icon icon="lucide:plus" className="text-lg" />
                  <span>Add Item</span>
                </motion.button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Icon
                    icon="lucide:package"
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No items added yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add items to your quotation to get started.
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addItem}
                  >
                    Add Your First Item
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Item #{index + 1}
                        </h4>
                        <motion.button
                          className="text-red-600 hover:text-red-700 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                        >
                          <Icon icon="lucide:trash-2" className="text-lg" />
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU/Code
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={item.sku || ""}
                            onChange={(e) =>
                              updateItem(item.id, "sku", e.target.value)
                            }
                            placeholder="Optional SKU"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description (optional)"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Price *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
                            ${item.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={addItem}
                  >
                    <Icon icon="lucide:plus" className="text-lg" />
                    <span>Add Another Item</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTax())}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedCustomer && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Customer
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {selectedCustomer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.company}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.email}
                  </p>
                  {selectedCustomer.phone && (
                    <p className="text-sm text-gray-600">
                      {selectedCustomer.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Customer
              </h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCustomerModal(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customers.map((customer) => (
                <motion.div
                  key={customer.id}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => selectCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {customer.company}
                      </p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <Icon
                      icon="lucide:chevron-right"
                      className="text-gray-400"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Template
              </h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTemplateModal(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {template.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {template.description}
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
          </motion.div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-5/6 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quotation Preview
              </h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPreview(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-y-auto">
              {/* PDF Preview Content */}
              <div className="p-8 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      QUOTATION
                    </h1>
                    <p className="text-gray-600">
                      Reference: {quotationData.referenceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                      <Icon
                        icon="lucide:file-text"
                        className="text-white text-2xl"
                      />
                    </div>
                    <p className="text-sm font-semibold">QuoteManager</p>
                  </div>
                </div>

                {/* Company & Customer Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">From:</h3>
                    <div className="text-gray-600">
                      <p className="font-medium">Your Company Name</p>
                      <p>123 Business Street</p>
                      <p>City, State 12345</p>
                      <p>Phone: (555) 123-4567</p>
                      <p>Email: hello@yourcompany.com</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">To:</h3>
                    <div className="text-gray-600">
                      <p className="font-medium">
                        {quotationData.customerName || "Customer Name"}
                      </p>
                      <p>
                        {quotationData.customerEmail || "customer@email.com"}
                      </p>
                      <p>{quotationData.customerPhone || "Phone Number"}</p>
                      <p>
                        {quotationData.customerAddress || "Customer Address"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quotation Details */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Quotation Date</p>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valid Until</p>
                    <p className="font-semibold">
                      {quotationData.expiryDate
                        ? new Date(
                            quotationData.expiryDate
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Terms</p>
                    <p className="font-semibold">
                      {quotationData.terms || "Net 30"}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                            Description
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.length > 0 ? (
                          items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-sm text-gray-600">
                                    {item.description}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ${item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                ${item.total.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No items added yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ${calculateSubtotal().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span className="font-medium">
                          ${calculateTax().toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            ${calculateTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {quotationData.notes && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{quotationData.notes}</p>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Terms & Conditions
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      • This quotation is valid for 30 days from the date of
                      issue.
                    </p>
                    <p>• Prices are subject to change without notice.</p>
                    <p>• Payment terms: Net 30 days from invoice date.</p>
                    <p>
                      • All work will be performed in accordance with our
                      standard terms and conditions.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Thank you for your business! If you have any questions,
                    please contact us.
                  </p>
                </div>
              </div>

              {/* PDF Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <div className="flex justify-center space-x-4">
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      alert(
                        "PDF download functionality would be implemented here"
                      );
                    }}
                  >
                    <Icon icon="lucide:download" />
                    <span>Download PDF</span>
                  </motion.button>
                  <motion.button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      alert("Email functionality would be implemented here");
                    }}
                  >
                    <Icon icon="lucide:mail" />
                    <span>Email PDF</span>
                  </motion.button>
                  <motion.button
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <Icon icon="lucide:printer" />
                    <span>Print</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Duplicate Quotation Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Select Quotation to Duplicate
              </h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDuplicateModal(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {existingQuotations.map((quotation, index) => (
                <motion.div
                  key={quotation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleDuplicateQuotation(quotation)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {quotation.referenceNumber}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            quotation.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : quotation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {quotation.status.charAt(0).toUpperCase() +
                            quotation.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span>
                          <div>{quotation.customerName}</div>
                          <div>{quotation.customerEmail}</div>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <div className="text-lg font-semibold text-gray-900">
                            ${quotation.total.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <div>
                            {new Date(
                              quotation.createdDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-medium text-sm text-gray-600">
                          Items:
                        </span>
                        <div className="mt-1 space-y-1">
                          {quotation.items.map(
                            (item: any, itemIndex: number) => (
                              <div
                                key={itemIndex}
                                className="text-sm text-gray-600 flex justify-between"
                              >
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>${item.total.toLocaleString()}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Icon
                        icon="lucide:copy"
                        className="text-2xl text-blue-600"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {existingQuotations.length === 0 && (
              <div className="text-center py-8">
                <Icon
                  icon="lucide:file-text"
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Quotations Found
                </h3>
                <p className="text-gray-600">
                  You don't have any existing quotations to duplicate yet.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
