import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  logo: string;
}

interface SystemSettings {
  currency: string;
  dateFormat: string;
  timeZone: string;
  language: string;
  numberFormat: string;
  fiscalYearStart: string;
}

interface GeneralSettingsProps {
  onNavigate?: (section: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onNavigate }) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'QuoteManager Inc.',
    email: 'hello@quotemanager.com',
    phone: '+1 (555) 123-4567',
    website: 'https://quotemanager.com',
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States',
    taxId: '12-3456789',
    logo: ''
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'America/Los_Angeles',
    language: 'en',
    numberFormat: 'US',
    fiscalYearStart: 'January'
  });

  const [activeTab, setActiveTab] = useState('company');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  const timeZones = [
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  const handleCompanyChange = (field: keyof CompanySettings, value: string) => {
    setCompanySettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSystemChange = (field: keyof SystemSettings, value: string) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSaving(false);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleCompanyChange('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600 mt-1">Configure your company information and system preferences</p>
        </div>
        {hasChanges && (
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
          >
            <Icon icon={saving ? "lucide:loader-2" : "lucide:save"} className={`text-lg ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'company', name: 'Company Information', icon: 'lucide:building' },
              { id: 'system', name: 'System Preferences', icon: 'lucide:settings' },
              { id: 'branding', name: 'Branding', icon: 'lucide:palette' },
              { id: 'notifications', name: 'Notifications', icon: 'lucide:bell' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon icon={tab.icon} className="text-lg" />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Information Tab */}
          {activeTab === 'company' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) => handleCompanyChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => handleCompanyChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={companySettings.phone}
                    onChange={(e) => handleCompanyChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={(e) => handleCompanyChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => handleCompanyChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={companySettings.city}
                    onChange={(e) => handleCompanyChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={companySettings.state}
                    onChange={(e) => handleCompanyChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={companySettings.zipCode}
                    onChange={(e) => handleCompanyChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={companySettings.country}
                    onChange={(e) => handleCompanyChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / VAT Number</label>
                <input
                  type="text"
                  value={companySettings.taxId}
                  onChange={(e) => handleCompanyChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* System Preferences Tab */}
          {activeTab === 'system' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select
                    value={systemSettings.currency}
                    onChange={(e) => handleSystemChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={systemSettings.dateFormat}
                    onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                    <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select
                    value={systemSettings.timeZone}
                    onChange={(e) => handleSystemChange('timeZone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timeZones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={systemSettings.language}
                    onChange={(e) => handleSystemChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
                  <select
                    value={systemSettings.numberFormat}
                    onChange={(e) => handleSystemChange('numberFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="US">1,234.56 (US)</option>
                    <option value="EU">1.234,56 (EU)</option>
                    <option value="IN">1,23,456.78 (Indian)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
                  <select
                    value={systemSettings.fiscalYearStart}
                    onChange={(e) => handleSystemChange('fiscalYearStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="January">January</option>
                    <option value="April">April</option>
                    <option value="July">July</option>
                    <option value="October">October</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {companySettings.logo ? (
                      <img src={companySettings.logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Icon icon="lucide:image" className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer inline-block"
                    >
                      Upload Logo
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 200x200px, PNG or JPG format
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon icon="lucide:info" className="text-yellow-600 text-lg mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Branding Customization</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Advanced branding options including custom colors, fonts, and email templates 
                      are available in the Professional and Enterprise plans.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {[
                  { id: 'email_quotations', label: 'New Quotation Created', description: 'Get notified when a new quotation is created' },
                  { id: 'email_approvals', label: 'Approval Required', description: 'Get notified when your approval is required' },
                  { id: 'email_status', label: 'Status Changes', description: 'Get notified when quotation status changes' },
                  { id: 'email_expiry', label: 'Expiry Reminders', description: 'Get notified before quotations expire' },
                  { id: 'email_weekly', label: 'Weekly Reports', description: 'Receive weekly performance summaries' }
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.label}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Save Changes Banner */}
      {hasChanges && (
        <motion.div
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon icon="lucide:alert-circle" className="text-lg" />
          <span>You have unsaved changes</span>
          <motion.button
            className="bg-white text-blue-600 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
          >
            Save Now
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
