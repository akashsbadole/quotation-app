import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { firebaseNotificationService } from '../services/firebase-notification.service';

interface ClientData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  customerType: 'regular' | 'vip' | 'prospect';
  creditLimit: number;
  paymentTerms: string;
  taxExempt: boolean;
  notes: string;
  website?: string;
  industry?: string;
  contactPerson?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AddClientProps {
  onNavigate?: (section: string) => void;
  editingClient?: ClientData | null;
  onSave?: (client: ClientData) => void;
  onCancel?: () => void;
}

export const AddClient: React.FC<AddClientProps> = ({ 
  onNavigate, 
  editingClient, 
  onSave, 
  onCancel 
}) => {
  const [clientData, setClientData] = useState<ClientData>({
    name: editingClient?.name || '',
    email: editingClient?.email || '',
    phone: editingClient?.phone || '',
    company: editingClient?.company || '',
    address: editingClient?.address || '',
    city: editingClient?.city || '',
    state: editingClient?.state || '',
    zipCode: editingClient?.zipCode || '',
    country: editingClient?.country || 'United States',
    customerType: editingClient?.customerType || 'regular',
    creditLimit: editingClient?.creditLimit || 0,
    paymentTerms: editingClient?.paymentTerms || 'Net 30',
    taxExempt: editingClient?.taxExempt || false,
    notes: editingClient?.notes || '',
    website: editingClient?.website || '',
    industry: editingClient?.industry || '',
    contactPerson: editingClient?.contactPerson || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!clientData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (!clientData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!clientData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!clientData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (clientData.creditLimit < 0) {
      newErrors.creditLimit = 'Credit limit cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientData, value: any) => {
    setClientData(prev => ({
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const clientToSave: ClientData = {
        ...clientData,
        id: editingClient?.id || `client-${Date.now()}`,
        createdAt: editingClient?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
      
      if (editingClient) {
        // Update existing client
        const index = existingClients.findIndex((c: ClientData) => c.id === editingClient.id);
        if (index !== -1) {
          existingClients[index] = clientToSave;
        }
      } else {
        // Add new client
        existingClients.push(clientToSave);
      }

      localStorage.setItem('clients', JSON.stringify(existingClients));

      // Send notification
      await firebaseNotificationService.sendInAppNotification({
        title: editingClient ? 'Client Updated' : 'New Client Added',
        message: `${clientToSave.name} has been ${editingClient ? 'updated' : 'added'} successfully`,
        type: 'success',
        priority: 'medium',
        data: clientToSave,
        actionUrl: '/customers/list',
        actionText: 'View Clients'
      });

      // Call parent callback if provided
      if (onSave) {
        onSave(clientToSave);
      } else {
        alert(`Client ${editingClient ? 'updated' : 'added'} successfully!`);
        onNavigate?.('customers-list');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onNavigate?.('customers-list');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h1>
          <p className="text-gray-600 mt-1">
            {editingClient ? 'Update client information' : 'Create a new client profile'}
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
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter client name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={clientData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={clientData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.company ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={clientData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={clientData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={clientData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={clientData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={clientData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state/province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={clientData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ZIP/postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={clientData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type
                </label>
                <select
                  value={clientData.customerType}
                  onChange={(e) => handleInputChange('customerType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  value={clientData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Limit ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={clientData.creditLimit}
                  onChange={(e) => handleInputChange('creditLimit', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.creditLimit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="taxExempt"
                  checked={clientData.taxExempt}
                  onChange={(e) => handleInputChange('taxExempt', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="taxExempt" className="text-sm text-gray-700">
                  Tax Exempt
                </label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={clientData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes about this client..."
            />
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
            <span>{editingClient ? 'Update Client' : 'Add Client'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
