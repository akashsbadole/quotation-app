import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  industry?: string;
  language: string;
  isDefault: boolean;
  thumbnail?: string;
  variables: string[];
  content: {
    subject?: string;
    content: string;
    styles?: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface QuotationTemplatesProps {
  onNavigate?: (section: string) => void;
}

export const QuotationTemplates: React.FC<QuotationTemplatesProps> = ({
  onNavigate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [filters, setFilters] = useState({
    category: "",
    industry: "",
    language: "",
    search: "",
  });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: "template-1",
        name: "Professional Services Quote",
        description: "Standard template for professional services quotations",
        category: "quotation",
        type: "quotation",
        industry: "Professional Services",
        language: "en",
        isDefault: true,
        thumbnail: "/templates/professional-services.png",
        variables: [
          "clientName",
          "companyName",
          "quotationNumber",
          "date",
          "expiryDate",
          "items",
          "total",
          "unitPrice",
          "quantity",
          "subtotal",
          "tax",
        ],
        content: {
          subject: "Quotation {{quotationNumber}} for {{clientName}}",
          content: [
            '<div class="quotation-template">',
            "  <header>",
            "    <h1>{{companyName}}</h1>",
            "    <h2>Professional Services Quotation</h2>",
            "  </header>",
            '  <div class="client-info">',
            "    <h3>To: {{clientName}}</h3>",
            "    <p>Date: {{date}}</p>",
            "    <p>Quote #: {{quotationNumber}}</p>",
            "    <p>Valid Until: {{expiryDate}}</p>",
            "  </div>",
            '  <div class="items">',
            "    {{#each items}}",
            '    <div class="item">',
            "      <h4>{{name}}</h4>",
            "      <p>{{description}}</p>",
            "      <p>Quantity: {{quantity}} | Unit Price: ${{unitPrice}} | Total: ${{total}}</p>",
            "    </div>",
            "    {{/each}}",
            "  </div>",
            '  <div class="total">',
            "    <h3>Total: ${{total}}</h3>",
            "  </div>",
            '  <div class="terms">',
            "    <h4>Terms and Conditions</h4>",
            "    <p>{{terms}}</p>",
            "  </div>",
            "</div>",
          ].join("\n"),
          styles: {
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#333",
          },
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-12-01T15:30:00Z",
      },
      {
        id: "template-2",
        name: "Product Sales Quote",
        description:
          "Template for product-based quotations with inventory details",
        category: "quotation",
        type: "quotation",
        industry: "Retail",
        language: "en",
        isDefault: false,
        thumbnail: "/templates/product-sales.png",
        variables: [
          "clientName",
          "companyName",
          "quotationNumber",
          "date",
          "items",
          "subtotal",
          "tax",
          "total",
          "unitPrice",
          "quantity",
          "sku",
          "companyLogo",
        ],
        content: {
          subject: "Product Quotation {{quotationNumber}}",
          content:
            '<div class="product-quotation">' +
            '<div class="header">' +
            '<img src="{{companyLogo}}" alt="{{companyName}}" />' +
            "<h1>Product Quotation</h1>" +
            "</div>" +
            '<div class="details">' +
            '<div class="client">{{clientName}}</div>' +
            '<div class="quote-info">' +
            "<p>Quote #: {{quotationNumber}}</p>" +
            "<p>Date: {{date}}</p>" +
            "</div>" +
            "</div>" +
            '<table class="items-table">' +
            "<thead>" +
            "<tr>" +
            "<th>Product</th>" +
            "<th>SKU</th>" +
            "<th>Qty</th>" +
            "<th>Unit Price</th>" +
            "<th>Total</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "{{#each items}}" +
            "<tr>" +
            "<td>{{name}}</td>" +
            "<td>{{sku}}</td>" +
            "<td>{{quantity}}</td>" +
            "<td>${{unitPrice}}</td>" +
            "<td>${{total}}</td>" +
            "</tr>" +
            "{{/each}}" +
            "</tbody>" +
            "</table>" +
            '<div class="totals">' +
            "<p>Subtotal: ${{subtotal}}</p>" +
            "<p>Tax: ${{tax}}</p>" +
            "<h3>Total: ${{total}}</h3>" +
            "</div>" +
            "</div>",
        },
        createdAt: "2024-02-01T09:00:00Z",
        updatedAt: "2024-11-15T14:20:00Z",
      },
      {
        id: "template-3",
        name: "Construction Estimate",
        description:
          "Detailed template for construction and contracting quotes",
        category: "quotation",
        type: "quotation",
        industry: "Construction",
        language: "en",
        isDefault: false,
        variables: [
          "clientName",
          "projectName",
          "quotationNumber",
          "date",
          "phases",
          "materials",
          "labor",
          "total",
          "equipment",
          "duration",
          "cost",
        ],
        content: {
          subject:
            "Construction Estimate {{quotationNumber}} - {{projectName}}",
          content:
            '<div class="construction-estimate">' +
            "<h1>Construction Estimate</h1>" +
            '<div class="project-info">' +
            "<h2>{{projectName}}</h2>" +
            "<p>Client: {{clientName}}</p>" +
            "<p>Estimate #: {{quotationNumber}}</p>" +
            "<p>Date: {{date}}</p>" +
            "</div>" +
            '<div class="phases">' +
            "<h3>Project Phases</h3>" +
            "{{#each phases}}" +
            '<div class="phase">' +
            "<h4>{{name}}</h4>" +
            "<p>{{description}}</p>" +
            "<p>Duration: {{duration}}</p>" +
            "<p>Cost: ${{cost}}</p>" +
            "</div>" +
            "{{/each}}" +
            "</div>" +
            '<div class="breakdown">' +
            "<h3>Cost Breakdown</h3>" +
            "<p>Materials: ${{materials}}</p>" +
            "<p>Labor: ${{labor}}</p>" +
            "<p>Equipment: ${{equipment}}</p>" +
            "<h3>Total Estimate: ${{total}}</h3>" +
            "</div>" +
            "</div>",
        },
        createdAt: "2024-03-10T11:30:00Z",
        updatedAt: "2024-12-05T16:45:00Z",
      },
    ];
    setTemplates(mockTemplates);
  }, []);

  const filteredTemplates = templates.filter((template) => {
    if (filters.category && template.category !== filters.category)
      return false;
    if (filters.industry && template.industry !== filters.industry)
      return false;
    if (filters.language && template.language !== filters.language)
      return false;
    if (
      filters.search &&
      !template.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !template.description.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateTemplate = () => {
    setActiveTab("create");
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab("edit");
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    }
  };

  const handleSetDefault = async (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === templateId,
      }))
    );
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
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
                  Quotation Templates
                </h1>
                <p className="text-sm text-gray-600">
                  Create and manage professional quotation templates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTemplate}
              >
                <Icon icon="lucide:plus" className="text-lg" />
                <span>New Template</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Categories</option>
                      <option value="quotation">Quotation</option>
                      <option value="email">Email</option>
                      <option value="terms">Terms</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.industry}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Industries</option>
                      <option value="Professional Services">
                        Professional Services
                      </option>
                      <option value="Retail">Retail</option>
                      <option value="Construction">Construction</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.language}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Languages</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    {/* Template Thumbnail */}
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon
                          icon="lucide:file-text"
                          className="text-6xl text-blue-400"
                        />
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {template.name}
                        </h3>
                        {template.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{template.industry || "General"}</span>
                        <span>{template.language.toUpperCase()}</span>
                      </div>

                      {/* Variables */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Variables:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 3).map((variable) => (
                            <span
                              key={variable}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {variable}
                            </span>
                          ))}
                          {template.variables.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{template.variables.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <motion.button
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditTemplate(template)}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            Duplicate
                          </motion.button>
                        </div>
                        <div className="flex space-x-1">
                          {!template.isDefault && (
                            <motion.button
                              className="p-1 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleSetDefault(template.id)}
                              title="Set as default"
                            >
                              <Icon icon="lucide:star" className="text-sm" />
                            </motion.button>
                          )}
                          <motion.button
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTemplate(template.id)}
                            title="Delete template"
                          >
                            <Icon icon="lucide:trash-2" className="text-sm" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Icon
                    icon="lucide:file-text"
                    className="text-6xl text-gray-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first template to get started
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateTemplate}
                  >
                    Create Template
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {(activeTab === "create" || activeTab === "edit") && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon
                  icon="lucide:construction"
                  className="text-6xl text-blue-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "create"
                    ? "Template Builder"
                    : "Template Editor"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced template builder with drag-and-drop interface coming
                  soon
                </p>
                <motion.button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("list")}
                >
                  Back to Templates
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
