import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
    preventReuse: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'email' | 'app';
    backupCodes: boolean;
  };
  sessionManagement: {
    sessionTimeout: number;
    maxConcurrentSessions: number;
    rememberMe: boolean;
  };
  loginSecurity: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    captchaEnabled: boolean;
  };
  dataEncryption: {
    encryptionAtRest: boolean;
    encryptionInTransit: boolean;
    keyRotation: number;
  };
  auditLogging: {
    enabled: boolean;
    logLevel: 'basic' | 'detailed' | 'verbose';
    retentionPeriod: number;
  };
}

interface SecuritySettingsProps {
  onNavigate?: (section: string) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      passwordExpiry: 90,
      preventReuse: 5
    },
    twoFactorAuth: {
      enabled: false,
      method: 'app',
      backupCodes: true
    },
    sessionManagement: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      rememberMe: true
    },
    loginSecurity: {
      maxFailedAttempts: 5,
      lockoutDuration: 15,
      captchaEnabled: true
    },
    dataEncryption: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      keyRotation: 365
    },
    auditLogging: {
      enabled: true,
      logLevel: 'detailed',
      retentionPeriod: 365
    }
  });

  const [activeTab, setActiveTab] = useState<'password' | '2fa' | 'session' | 'login' | 'encryption' | 'audit'>('password');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: keyof SecuritySettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo
      localStorage.setItem('security_settings', JSON.stringify(settings));
      
      setHasChanges(false);
      alert('Security settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all security settings to defaults?')) {
      // Reset to default values
      setSettings({
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          passwordExpiry: 90,
          preventReuse: 5
        },
        twoFactorAuth: {
          enabled: false,
          method: 'app',
          backupCodes: true
        },
        sessionManagement: {
          sessionTimeout: 30,
          maxConcurrentSessions: 3,
          rememberMe: true
        },
        loginSecurity: {
          maxFailedAttempts: 5,
          lockoutDuration: 15,
          captchaEnabled: true
        },
        dataEncryption: {
          encryptionAtRest: true,
          encryptionInTransit: true,
          keyRotation: 365
        },
        auditLogging: {
          enabled: true,
          logLevel: 'detailed',
          retentionPeriod: 365
        }
      });
      setHasChanges(true);
    }
  };

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('security_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load security settings:', error);
      }
    }
  }, []);

  const tabs = [
    { id: 'password', name: 'Password Policy', icon: 'lucide:key' },
    { id: '2fa', name: 'Two-Factor Auth', icon: 'lucide:shield-check' },
    { id: 'session', name: 'Session Management', icon: 'lucide:clock' },
    { id: 'login', name: 'Login Security', icon: 'lucide:lock' },
    { id: 'encryption', name: 'Data Encryption', icon: 'lucide:shield' },
    { id: 'audit', name: 'Audit Logging', icon: 'lucide:file-text' }
  ];

  const getSecurityScore = () => {
    let score = 0;
    const maxScore = 100;

    // Password policy (20 points)
    if (settings.passwordPolicy.minLength >= 8) score += 5;
    if (settings.passwordPolicy.requireUppercase) score += 3;
    if (settings.passwordPolicy.requireLowercase) score += 3;
    if (settings.passwordPolicy.requireNumbers) score += 3;
    if (settings.passwordPolicy.requireSpecialChars) score += 3;
    if (settings.passwordPolicy.passwordExpiry <= 90) score += 3;

    // Two-factor auth (25 points)
    if (settings.twoFactorAuth.enabled) score += 20;
    if (settings.twoFactorAuth.backupCodes) score += 5;

    // Session management (15 points)
    if (settings.sessionManagement.sessionTimeout <= 60) score += 5;
    if (settings.sessionManagement.maxConcurrentSessions <= 5) score += 5;
    if (!settings.sessionManagement.rememberMe) score += 5;

    // Login security (15 points)
    if (settings.loginSecurity.maxFailedAttempts <= 5) score += 5;
    if (settings.loginSecurity.lockoutDuration >= 10) score += 5;
    if (settings.loginSecurity.captchaEnabled) score += 5;

    // Data encryption (15 points)
    if (settings.dataEncryption.encryptionAtRest) score += 5;
    if (settings.dataEncryption.encryptionInTransit) score += 5;
    if (settings.dataEncryption.keyRotation <= 365) score += 5;

    // Audit logging (10 points)
    if (settings.auditLogging.enabled) score += 5;
    if (settings.auditLogging.logLevel === 'verbose') score += 3;
    else if (settings.auditLogging.logLevel === 'detailed') score += 2;
    if (settings.auditLogging.retentionPeriod >= 365) score += 2;

    return Math.min(score, maxScore);
  };

  const securityScore = getSecurityScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600 mt-1">Configure security policies and access controls</p>
        </div>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <motion.button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
            >
              <Icon icon="lucide:save" className="text-lg" />
              <span>Save Changes</span>
            </motion.button>
          )}
          <motion.button
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetToDefaults}
          >
            <Icon icon="lucide:refresh-cw" className="text-lg" />
            <span>Reset to Defaults</span>
          </motion.button>
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
            <p className="text-gray-600 text-sm">Overall security configuration rating</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  securityScore >= 80 ? 'bg-green-500' : 
                  securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon icon={tab.icon} className="text-lg" />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Password Policy Tab */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Password Policy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.passwordPolicy.passwordExpiry}
                    onChange={(e) => handleSettingChange('passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Password Requirements</h4>
                
                {[
                  { key: 'requireUppercase', label: 'Require uppercase letters (A-Z)' },
                  { key: 'requireLowercase', label: 'Require lowercase letters (a-z)' },
                  { key: 'requireNumbers', label: 'Require numbers (0-9)' },
                  { key: 'requireSpecialChars', label: 'Require special characters (!@#$...)' }
                ].map((requirement) => (
                  <div key={requirement.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={requirement.key}
                      checked={settings.passwordPolicy[requirement.key as keyof typeof settings.passwordPolicy] as boolean}
                      onChange={(e) => handleSettingChange('passwordPolicy', requirement.key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={requirement.key} className="text-sm text-gray-700">
                      {requirement.label}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Two-Factor Authentication Tab */}
          {activeTab === '2fa' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="2fa-enabled"
                  checked={settings.twoFactorAuth.enabled}
                  onChange={(e) => handleSettingChange('twoFactorAuth', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="2fa-enabled" className="text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>

              {settings.twoFactorAuth.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authentication Method
                    </label>
                    <select
                      value={settings.twoFactorAuth.method}
                      onChange={(e) => handleSettingChange('twoFactorAuth', 'method', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="app">Authenticator App</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="backup-codes"
                      checked={settings.twoFactorAuth.backupCodes}
                      onChange={(e) => handleSettingChange('twoFactorAuth', 'backupCodes', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="backup-codes" className="text-sm text-gray-700">
                      Generate backup codes
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Session Management Tab */}
          {activeTab === 'session' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Session Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.sessionManagement.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionManagement', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Concurrent Sessions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.sessionManagement.maxConcurrentSessions}
                    onChange={(e) => handleSettingChange('sessionManagement', 'maxConcurrentSessions', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={settings.sessionManagement.rememberMe}
                  onChange={(e) => handleSettingChange('sessionManagement', 'rememberMe', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-700">
                  Allow "Remember Me" option
                </label>
              </div>
            </motion.div>
          )}

          {/* Add other tabs content here... */}
        </div>
      </div>
    </div>
  );
};
