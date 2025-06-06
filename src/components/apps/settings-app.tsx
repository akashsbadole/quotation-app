import React from "react";
import { 
  Button, 
  Card,
  CardBody,
  Tabs,
  Tab,
  Input,
  Switch,
  Select,
  SelectItem,
  Divider,
  Textarea
} from "@heroui/react";
import { Icon } from "@iconify/react";

export const SettingsApp: React.FC = () => {
  const [selected, setSelected] = React.useState("general");
  const [formChanged, setFormChanged] = React.useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = React.useState({
    currency: "usd",
    dateFormat: "mdy",
    timeZone: "utc",
    quotationPrefix: "Q-",
    nextQuotationNumber: "2023-007",
    expirationDays: "30",
    requireApproval: true,
    autoSendEmail: true,
    emailSubject: "Your Quotation from {company_name} - {quotation_number}",
    emailSignature: "Best regards,\n{user_name}\n{company_name}"
  });
  
  // Company settings
  const [companySettings, setCompanySettings] = React.useState({
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "(555) 123-4567",
    address: "123 Business Ave",
    city: "Metropolis",
    state: "NY",
    postalCode: "10001",
    country: "us",
    taxId: "US123456789"
  });
  
  // User settings
  const [userSettings, setUserSettings] = React.useState({
    users: [
      { id: 1, name: "Admin User", email: "admin@company.com", role: "admin", active: true },
      { id: 2, name: "Sales User", email: "sales@company.com", role: "sales", active: true },
      { id: 3, name: "Manager User", email: "manager@company.com", role: "manager", active: true }
    ]
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    quotationCreated: true,
    quotationApproved: true,
    quotationRejected: true,
    quotationExpiring: true,
    dailySummary: false,
    weeklySummary: true
  });
  
  // Integration settings
  const [integrationSettings, setIntegrationSettings] = React.useState({
    crmIntegration: "none",
    accountingIntegration: "none",
    apiKey: "sk_test_123456789abcdef",
    webhookUrl: "https://yourcompany.com/api/webhooks/quotations"
  });
  
  const currencies = [
    { key: "usd", label: "USD - US Dollar" },
    { key: "eur", label: "EUR - Euro" },
    { key: "gbp", label: "GBP - British Pound" },
    { key: "cad", label: "CAD - Canadian Dollar" },
    { key: "aud", label: "AUD - Australian Dollar" },
    { key: "jpy", label: "JPY - Japanese Yen" }
  ];
  
  const dateFormats = [
    { key: "mdy", label: "MM/DD/YYYY" },
    { key: "dmy", label: "DD/MM/YYYY" },
    { key: "ymd", label: "YYYY-MM-DD" }
  ];
  
  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings({
      ...generalSettings,
      [key]: value
    });
    setFormChanged(true);
  };
  
  const handleCompanySettingChange = (key: string, value: any) => {
    setCompanySettings({
      ...companySettings,
      [key]: value
    });
    setFormChanged(true);
  };
  
  const handleNotificationSettingChange = (key: string, value: any) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value
    });
    setFormChanged(true);
  };
  
  const handleIntegrationSettingChange = (key: string, value: any) => {
    setIntegrationSettings({
      ...integrationSettings,
      [key]: value
    });
    setFormChanged(true);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to the server
    alert("Settings saved successfully!");
    setFormChanged(false);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Button 
          color="primary" 
          isDisabled={!formChanged}
          onPress={handleSaveSettings}
        >
          Save Changes
        </Button>
      </div>
      
      <Tabs 
        aria-label="Settings tabs" 
        selectedKey={selected} 
        onSelectionChange={setSelected as any}
        className="mb-4"
      >
        <Tab key="general" title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:settings" />
            <span>General</span>
          </div>
        } />
        <Tab key="company" title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:building" />
            <span>Company</span>
          </div>
        } />
        <Tab key="users" title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:users" />
            <span>Users</span>
          </div>
        } />
        <Tab key="notifications" title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:bell" />
            <span>Notifications</span>
          </div>
        } />
        <Tab key="integrations" title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:plug" />
            <span>Integrations</span>
          </div>
        } />
      </Tabs>
      
      <div className="flex-1 overflow-y-auto">
        {selected === "general" && (
          <Card>
            <CardBody className="gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select 
                        label="Default Currency" 
                        placeholder="Select a currency"
                        selectedKeys={[generalSettings.currency]}
                        onChange={(e) => handleGeneralSettingChange("currency", e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <SelectItem key={currency.key} value={currency.key}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    
                    <div>
                      <Select 
                        label="Date Format" 
                        placeholder="Select a date format"
                        selectedKeys={[generalSettings.dateFormat]}
                        onChange={(e) => handleGeneralSettingChange("dateFormat", e.target.value)}
                      >
                        {dateFormats.map((format) => (
                          <SelectItem key={format.key} value={format.key}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Select 
                      label="Time Zone" 
                      placeholder="Select a time zone"
                      selectedKeys={[generalSettings.timeZone]}
                      onChange={(e) => handleGeneralSettingChange("timeZone", e.target.value)}
                    >
                      <SelectItem key="utc" value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem key="est" value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem key="cst" value="cst">CST (Central Standard Time)</SelectItem>
                      <SelectItem key="mst" value="mst">MST (Mountain Standard Time)</SelectItem>
                      <SelectItem key="pst" value="pst">PST (Pacific Standard Time)</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Quotation Settings</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input 
                        label="Quotation Prefix"
                        placeholder="Enter prefix" 
                        value={generalSettings.quotationPrefix}
                        onChange={(e) => handleGeneralSettingChange("quotationPrefix", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Input 
                        label="Next Quotation Number"
                        placeholder="Enter number" 
                        value={generalSettings.nextQuotationNumber}
                        onChange={(e) => handleGeneralSettingChange("nextQuotationNumber", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Input 
                      type="number" 
                      label="Default Expiration (days)"
                      placeholder="Enter days" 
                      value={generalSettings.expirationDays}
                      onChange={(e) => handleGeneralSettingChange("expirationDays", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Approval</h4>
                      <p className="text-default-500 text-sm">Require manager approval before sending quotations</p>
                    </div>
                    <Switch 
                      isSelected={generalSettings.requireApproval}
                      onValueChange={(value) => handleGeneralSettingChange("requireApproval", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-send Email</h4>
                      <p className="text-default-500 text-sm">Automatically send email when quotation is approved</p>
                    </div>
                    <Switch 
                      isSelected={generalSettings.autoSendEmail}
                      onValueChange={(value) => handleGeneralSettingChange("autoSendEmail", value)}
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Email Templates</h3>
                
                <div className="space-y-4">
                  <div>
                    <Input 
                      label="Quotation Email Subject"
                      placeholder="Enter subject" 
                      value={generalSettings.emailSubject}
                      onChange={(e) => handleGeneralSettingChange("emailSubject", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Textarea 
                      label="Email Signature"
                      placeholder="Enter signature" 
                      value={generalSettings.emailSignature}
                      onChange={(e) => handleGeneralSettingChange("emailSignature", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selected === "company" && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium mb-4">Company Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Input 
                    label="Company Name"
                    placeholder="Enter company name" 
                    value={companySettings.name}
                    onChange={(e) => handleCompanySettingChange("name", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      label="Email"
                      placeholder="Enter email" 
                      value={companySettings.email}
                      onChange={(e) => handleCompanySettingChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Input 
                      label="Phone"
                      placeholder="Enter phone" 
                      value={companySettings.phone}
                      onChange={(e) => handleCompanySettingChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Input 
                    label="Address"
                    placeholder="Enter address" 
                    value={companySettings.address}
                    onChange={(e) => handleCompanySettingChange("address", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input 
                      label="City"
                      placeholder="Enter city" 
                      value={companySettings.city}
                      onChange={(e) => handleCompanySettingChange("city", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Input 
                      label="State/Province"
                      placeholder="Enter state/province" 
                      value={companySettings.state}
                      onChange={(e) => handleCompanySettingChange("state", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Input 
                      label="Postal Code"
                      placeholder="Enter postal code" 
                      value={companySettings.postalCode}
                      onChange={(e) => handleCompanySettingChange("postalCode", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Select 
                    label="Country" 
                    placeholder="Select a country" 
                    selectedKeys={[companySettings.country]}
                    onChange={(e) => handleCompanySettingChange("country", e.target.value)}
                  >
                    <SelectItem key="us" value="us">United States</SelectItem>
                    <SelectItem key="ca" value="ca">Canada</SelectItem>
                    <SelectItem key="uk" value="uk">United Kingdom</SelectItem>
                    <SelectItem key="au" value="au">Australia</SelectItem>
                  </Select>
                </div>
                
                <div>
                  <Input 
                    label="Tax ID / VAT Number"
                    placeholder="Enter tax ID" 
                    value={companySettings.taxId}
                    onChange={(e) => handleCompanySettingChange("taxId", e.target.value)}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selected === "users" && (
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">User Management</h3>
                <Button color="primary" size="sm" startContent={<Icon icon="lucide:plus" />}>
                  Add User
                </Button>
              </div>
              
              <div className="space-y-4">
                {userSettings.users.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-default-500">{user.email}</p>
                        <div className="mt-1">
                          <span className="text-xs bg-default-100 text-default-800 px-2 py-1 rounded-full">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch isSelected={user.active} />
                        <Button size="sm" variant="flat">
                          Edit
                        </Button>
                        <Button size="sm" variant="flat" color="danger">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Admin</h4>
                    <p className="text-default-500 text-sm">Full access to all features and settings</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Manager</h4>
                    <p className="text-default-500 text-sm">Can create, edit, and approve quotations</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Sales</h4>
                    <p className="text-default-500 text-sm">Can create and edit quotations, but cannot approve</p>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selected === "notifications" && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-default-500 text-sm">Enable or disable all email notifications</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.emailNotifications}
                    onValueChange={(value) => handleNotificationSettingChange("emailNotifications", value)}
                  />
                </div>
                
                <Divider />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Quotation Created</h4>
                    <p className="text-default-500 text-sm">Notify when a new quotation is created</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.quotationCreated}
                    onValueChange={(value) => handleNotificationSettingChange("quotationCreated", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Quotation Approved</h4>
                    <p className="text-default-500 text-sm">Notify when a quotation is approved</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.quotationApproved}
                    onValueChange={(value) => handleNotificationSettingChange("quotationApproved", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Quotation Rejected</h4>
                    <p className="text-default-500 text-sm">Notify when a quotation is rejected</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.quotationRejected}
                    onValueChange={(value) => handleNotificationSettingChange("quotationRejected", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Quotation Expiring</h4>
                    <p className="text-default-500 text-sm">Notify when a quotation is about to expire</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.quotationExpiring}
                    onValueChange={(value) => handleNotificationSettingChange("quotationExpiring", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <Divider />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Daily Summary</h4>
                    <p className="text-default-500 text-sm">Receive a daily summary of quotation activity</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.dailySummary}
                    onValueChange={(value) => handleNotificationSettingChange("dailySummary", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Summary</h4>
                    <p className="text-default-500 text-sm">Receive a weekly summary of quotation activity</p>
                  </div>
                  <Switch 
                    isSelected={notificationSettings.weeklySummary}
                    onValueChange={(value) => handleNotificationSettingChange("weeklySummary", value)}
                    isDisabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selected === "integrations" && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">CRM Integration</h4>
                  <Select 
                    label="Select CRM System" 
                    placeholder="Select a CRM system"
                    selectedKeys={[integrationSettings.crmIntegration]}
                    onChange={(e) => handleIntegrationSettingChange("crmIntegration", e.target.value)}
                  >
                    <SelectItem key="none" value="none">None</SelectItem>
                    <SelectItem key="salesforce" value="salesforce">Salesforce</SelectItem>
                    <SelectItem key="hubspot" value="hubspot">HubSpot</SelectItem>
                    <SelectItem key="zoho" value="zoho">Zoho CRM</SelectItem>
                    <SelectItem key="pipedrive" value="pipedrive">Pipedrive</SelectItem>
                  </Select>
                  
                  {integrationSettings.crmIntegration !== "none" && (
                    <Button size="sm" variant="flat" className="mt-2">
                      Configure
                    </Button>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Accounting Integration</h4>
                  <Select 
                    label="Select Accounting System" 
                    placeholder="Select an accounting system"
                    selectedKeys={[integrationSettings.accountingIntegration]}
                    onChange={(e) => handleIntegrationSettingChange("accountingIntegration", e.target.value)}
                  >
                    <SelectItem key="none" value="none">None</SelectItem>
                    <SelectItem key="quickbooks" value="quickbooks">QuickBooks</SelectItem>
                    <SelectItem key="xero" value="xero">Xero</SelectItem>
                    <SelectItem key="sage" value="sage">Sage</SelectItem>
                    <SelectItem key="freshbooks" value="freshbooks">FreshBooks</SelectItem>
                  </Select>
                  
                  {integrationSettings.accountingIntegration !== "none" && (
                    <Button size="sm" variant="flat" className="mt-2">
                      Configure
                    </Button>
                  )}
                </div>
                
                <Divider />
                
                <div>
                  <h4 className="font-medium mb-2">API Settings</h4>
                  <div className="space-y-4">
                    <Input 
                      label="API Key"
                      type="password"
                      placeholder="Enter API key" 
                      value={integrationSettings.apiKey}
                      onChange={(e) => handleIntegrationSettingChange("apiKey", e.target.value)}
                      endContent={
                        <Button size="sm" variant="light" isIconOnly>
                          <Icon icon="lucide:copy" />
                        </Button>
                      }
                    />
                    
                    <div>
                      <Button size="sm" variant="flat" color="primary">
                        Regenerate API Key
                      </Button>
                    </div>
                    
                    <Input 
                      label="Webhook URL"
                      placeholder="Enter webhook URL" 
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => handleIntegrationSettingChange("webhookUrl", e.target.value)}
                    />
                  </div>
                </div>
                
                <Divider />
                
                <div>
                  <h4 className="font-medium mb-2">Available Integrations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Icon icon="logos:salesforce" className="text-3xl" />
                        </div>
                        <div>
                          <h5 className="font-medium">Salesforce</h5>
                          <p className="text-default-500 text-sm">Connect your CRM data</p>
                        </div>
                        <Button size="sm" variant="flat" className="ml-auto">
                          Connect
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Icon icon="logos:quickbooks" className="text-3xl" />
                        </div>
                        <div>
                          <h5 className="font-medium">QuickBooks</h5>
                          <p className="text-default-500 text-sm">Sync accounting data</p>
                        </div>
                        <Button size="sm" variant="flat" className="ml-auto">
                          Connect
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Icon icon="logos:google-gmail" className="text-3xl" />
                        </div>
                        <div>
                          <h5 className="font-medium">Gmail</h5>
                          <p className="text-default-500 text-sm">Send emails via Gmail</p>
                        </div>
                        <Button size="sm" variant="flat" className="ml-auto">
                          Connect
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Icon icon="logos:stripe" className="text-3xl" />
                        </div>
                        <div>
                          <h5 className="font-medium">Stripe</h5>
                          <p className="text-default-500 text-sm">Process payments</p>
                        </div>
                        <Button size="sm" variant="flat" className="ml-auto">
                          Connect
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
