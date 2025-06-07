import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface ApiDocumentationProps {
  onNavigate?: (section: string) => void;
}

interface ApiEndpoint {
  id: string;
  method: string;
  endpoint: string;
  title: string;
  description: string;
  category: string;
  authentication: boolean;
  rateLimit: string;
  requestExample: string;
  responseExample: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

export const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('quotations');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  const categories = [
    { id: 'quotations', name: 'Quotations', icon: 'lucide:file-text' },
    { id: 'customers', name: 'Customers', icon: 'lucide:users' },
    { id: 'products', name: 'Products', icon: 'lucide:package' },
    { id: 'authentication', name: 'Authentication', icon: 'lucide:key' },
    { id: 'webhooks', name: 'Webhooks', icon: 'lucide:webhook' },
    { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart' }
  ];

  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'get-quotations',
      method: 'GET',
      endpoint: '/api/v1/quotations',
      title: 'List Quotations',
      description: 'Retrieve a list of quotations with optional filtering and pagination.',
      category: 'quotations',
      authentication: true,
      rateLimit: '1000/hour',
      requestExample: `curl -X GET "https://api.quotemanager.com/v1/quotations?status=pending&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
      responseExample: `{
  "data": [
    {
      "id": "quot_123456",
      "number": "Q-2024-001",
      "status": "pending",
      "customer": {
        "id": "cust_789",
        "name": "Acme Corp",
        "email": "contact@acme.com"
      },
      "total": 15000.00,
      "currency": "USD",
      "created_at": "2024-01-15T10:30:00Z",
      "expires_at": "2024-02-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  }
}`,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by quotation status (draft, pending, approved, rejected)' },
        { name: 'customer_id', type: 'string', required: false, description: 'Filter by customer ID' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results per page (max 100)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' }
      ]
    },
    {
      id: 'create-quotation',
      method: 'POST',
      endpoint: '/api/v1/quotations',
      title: 'Create Quotation',
      description: 'Create a new quotation with line items and customer information.',
      category: 'quotations',
      authentication: true,
      rateLimit: '500/hour',
      requestExample: `curl -X POST "https://api.quotemanager.com/v1/quotations" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "cust_789",
    "expires_at": "2024-02-15T10:30:00Z",
    "line_items": [
      {
        "product_id": "prod_456",
        "quantity": 2,
        "unit_price": 7500.00
      }
    ],
    "notes": "Custom quotation for enterprise client"
  }'`,
      responseExample: `{
  "id": "quot_123456",
  "number": "Q-2024-001",
  "status": "draft",
  "customer": {
    "id": "cust_789",
    "name": "Acme Corp",
    "email": "contact@acme.com"
  },
  "line_items": [
    {
      "id": "line_001",
      "product": {
        "id": "prod_456",
        "name": "Enterprise Software License",
        "sku": "ESL-001"
      },
      "quantity": 2,
      "unit_price": 7500.00,
      "total": 15000.00
    }
  ],
  "subtotal": 15000.00,
  "tax": 1200.00,
  "total": 16200.00,
  "currency": "USD",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2024-02-15T10:30:00Z"
}`,
      parameters: [
        { name: 'customer_id', type: 'string', required: true, description: 'ID of the customer for this quotation' },
        { name: 'expires_at', type: 'string', required: false, description: 'ISO 8601 date when quotation expires' },
        { name: 'line_items', type: 'array', required: true, description: 'Array of line items with product_id, quantity, and unit_price' },
        { name: 'notes', type: 'string', required: false, description: 'Additional notes for the quotation' }
      ]
    },
    {
      id: 'get-customers',
      method: 'GET',
      endpoint: '/api/v1/customers',
      title: 'List Customers',
      description: 'Retrieve a list of customers with optional search and filtering.',
      category: 'customers',
      authentication: true,
      rateLimit: '1000/hour',
      requestExample: `curl -X GET "https://api.quotemanager.com/v1/customers?search=acme&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
      responseExample: `{
  "data": [
    {
      "id": "cust_789",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "company": "Acme Corporation",
      "address": {
        "street": "123 Business Ave",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}`,
      parameters: [
        { name: 'search', type: 'string', required: false, description: 'Search customers by name, email, or company' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results per page (max 100)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' }
      ]
    },
    {
      id: 'auth-token',
      method: 'POST',
      endpoint: '/api/v1/auth/token',
      title: 'Get Access Token',
      description: 'Authenticate and receive an access token for API requests.',
      category: 'authentication',
      authentication: false,
      rateLimit: '100/hour',
      requestExample: `curl -X POST "https://api.quotemanager.com/v1/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your_api_key",
    "api_secret": "your_api_secret"
  }'`,
      responseExample: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}`,
      parameters: [
        { name: 'api_key', type: 'string', required: true, description: 'Your API key from the dashboard' },
        { name: 'api_secret', type: 'string', required: true, description: 'Your API secret from the dashboard' }
      ]
    }
  ];

  const filteredEndpoints = apiEndpoints.filter(endpoint => endpoint.category === selectedCategory);
  const currentEndpoint = selectedEndpoint ? apiEndpoints.find(e => e.id === selectedEndpoint) : null;

  const seoConfig = {
    title: "API Documentation - QuoteManager",
    description: "Complete API documentation for QuoteManager. Integrate quotation management into your applications with our RESTful API.",
    keywords: "API documentation, REST API, quotation API, integration, developers, webhooks",
    url: "/api-documentation"
  };

  return (
    <>
      <SEO {...seoConfig} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrate QuoteManager into your applications with our comprehensive RESTful API. 
              Build custom workflows, sync data, and automate your quotation process.
            </p>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">1. Get API Keys</h3>
                <p className="text-blue-700">Generate your API keys from the dashboard settings.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">2. Authenticate</h3>
                <p className="text-blue-700">Use your keys to get an access token.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">3. Make Requests</h3>
                <p className="text-blue-700">Include the Bearer token in your API calls.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedEndpoint(null);
                      }}
                    >
                      <Icon icon={category.icon} className="text-lg" />
                      <span>{category.name}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Base URL</h4>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    https://api.quotemanager.com
                  </code>
                  
                  <h4 className="font-medium text-gray-900 mb-3 mt-4">Rate Limits</h4>
                  <p className="text-sm text-gray-600">
                    1000 requests per hour for most endpoints
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {!currentEndpoint ? (
                /* Endpoints List */
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {categories.find(c => c.id === selectedCategory)?.name} Endpoints
                  </h2>
                  
                  {filteredEndpoints.map((endpoint, index) => (
                    <motion.div
                      key={endpoint.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-600">
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {endpoint.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {endpoint.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Icon icon="lucide:shield" className="mr-1" />
                              {endpoint.authentication ? 'Auth Required' : 'No Auth'}
                            </span>
                            <span className="flex items-center">
                              <Icon icon="lucide:clock" className="mr-1" />
                              {endpoint.rateLimit}
                            </span>
                          </div>
                        </div>
                        <Icon icon="lucide:chevron-right" className="text-gray-400 ml-4" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Endpoint Details */
                <motion.div
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="p-6 border-b border-gray-200">
                    <motion.button
                      className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                      whileHover={{ x: -4 }}
                      onClick={() => setSelectedEndpoint(null)}
                    >
                      <Icon icon="lucide:arrow-left" className="mr-2" />
                      Back to endpoints
                    </motion.button>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 text-sm font-semibold rounded ${
                        currentEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        currentEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        currentEndpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentEndpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-700">
                        {currentEndpoint.endpoint}
                      </code>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentEndpoint.title}
                    </h1>
                    <p className="text-gray-600">
                      {currentEndpoint.description}
                    </p>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Parameters */}
                    {currentEndpoint.parameters.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Required
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentEndpoint.parameters.map((param, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                    {param.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {param.type}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      param.required 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {param.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Request Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Example</h3>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{currentEndpoint.requestExample}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Response Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Example</h3>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{currentEndpoint.responseExample}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* SDK Information */}
          <motion.div
            className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SDKs & Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'JavaScript/Node.js', icon: 'lucide:code', status: 'Available' },
                { name: 'Python', icon: 'lucide:code-2', status: 'Available' },
                { name: 'PHP', icon: 'lucide:code', status: 'Coming Soon' },
                { name: 'Ruby', icon: 'lucide:gem', status: 'Coming Soon' },
                { name: 'Java', icon: 'lucide:coffee', status: 'Coming Soon' },
                { name: 'C#/.NET', icon: 'lucide:code-2', status: 'Coming Soon' }
              ].map((sdk, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon icon={sdk.icon} className="text-blue-600 text-xl" />
                    <span className="font-medium text-gray-900">{sdk.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    sdk.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sdk.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
