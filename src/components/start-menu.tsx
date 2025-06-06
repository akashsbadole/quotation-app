import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { apps } from "../data/apps";

export const StartMenu: React.FC = () => {
  const { closeStartMenu, addWindow } = useAppContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"pinned" | "all">("pinned");

  // Featured quotation management tools
  const featuredApps = [
    {
      id: "quotation-wizard",
      name: "Quotation Wizard",
      icon: "lucide:magic-wand",
      description: "Step-by-step quotation creation",
      category: "quotation",
    },
    {
      id: "bulk-quotations",
      name: "Bulk Quotations",
      icon: "lucide:layers",
      description: "Create multiple quotations at once",
      category: "quotation",
    },
    {
      id: "quotation-templates",
      name: "Template Manager",
      icon: "lucide:layout-template",
      description: "Manage quotation templates",
      category: "templates",
    },
    {
      id: "price-calculator",
      name: "Price Calculator",
      icon: "lucide:calculator",
      description: "Advanced pricing calculations",
      category: "quotation",
    },
    {
      id: "client-portal",
      name: "Client Portal",
      icon: "lucide:external-link",
      description: "Customer self-service portal",
      category: "crm",
    },
    {
      id: "workflow-designer",
      name: "Workflow Designer",
      icon: "lucide:workflow",
      description: "Design approval workflows",
      category: "templates",
    },
  ];

  const handleAppClick = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    const AppComponent = app.component;

    addWindow({
      id: `app-${appId}-${Date.now()}`,
      title: app.name,
      content: <AppComponent />,
      width: 900,
      height: 600,
      x: 100 + Math.random() * 100,
      y: 50 + Math.random() * 50,
      resizable: true,
      zIndex: Math.min(Date.now(), 800),
    });

    closeStartMenu();
  };

  // Create a comprehensive list of all applications like Windows
  const allApplications = [
    ...apps.map((app) => ({ ...app, isSystemFeature: false })),
    ...featuredApps.map((app) => ({ ...app, isSystemFeature: true })),
    // Add more Windows-style system apps
    {
      id: "calculator",
      name: "Calculator",
      icon: "lucide:calculator",
      description: "Perform basic arithmetic operations",
      category: "tools",
      isSystemFeature: true,
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: "lucide:calendar",
      description: "Manage your schedule and appointments",
      category: "productivity",
      isSystemFeature: true,
    },
    {
      id: "camera",
      name: "Camera",
      icon: "lucide:camera",
      description: "Take photos and videos",
      category: "media",
      isSystemFeature: true,
    },
    {
      id: "clock",
      name: "Clock",
      icon: "lucide:clock",
      description: "Set alarms and timers",
      category: "tools",
      isSystemFeature: true,
    },
    {
      id: "file-explorer",
      name: "File Explorer",
      icon: "lucide:folder",
      description: "Browse and manage files",
      category: "tools",
      isSystemFeature: true,
    },
    {
      id: "mail",
      name: "Mail",
      icon: "lucide:mail",
      description: "Send and receive email",
      category: "communication",
      isSystemFeature: true,
    },
    {
      id: "maps",
      name: "Maps",
      icon: "lucide:map",
      description: "Get directions and explore places",
      category: "navigation",
      isSystemFeature: true,
    },
    {
      id: "microsoft-edge",
      name: "Microsoft Edge",
      icon: "lucide:globe",
      description: "Browse the web",
      category: "internet",
      isSystemFeature: true,
    },
    {
      id: "microsoft-store",
      name: "Microsoft Store",
      icon: "lucide:shopping-bag",
      description: "Download apps and games",
      category: "store",
      isSystemFeature: true,
    },
    {
      id: "notepad",
      name: "Notepad",
      icon: "lucide:file-text",
      description: "Simple text editor",
      category: "productivity",
      isSystemFeature: true,
    },
    {
      id: "paint",
      name: "Paint",
      icon: "lucide:palette",
      description: "Create and edit images",
      category: "media",
      isSystemFeature: true,
    },
    {
      id: "photos",
      name: "Photos",
      icon: "lucide:image",
      description: "View and edit photos",
      category: "media",
      isSystemFeature: true,
    },
    {
      id: "settings",
      name: "Settings",
      icon: "lucide:settings",
      description: "Change system settings",
      category: "system",
      isSystemFeature: true,
    },
    {
      id: "snipping-tool",
      name: "Snipping Tool",
      icon: "lucide:scissors",
      description: "Capture screenshots",
      category: "tools",
      isSystemFeature: true,
    },
    {
      id: "weather",
      name: "Weather",
      icon: "lucide:cloud",
      description: "Check weather conditions",
      category: "information",
      isSystemFeature: true,
    },
  ];

  // Group apps alphabetically like Windows
  const groupedApps = allApplications
    .filter(
      (app) =>
        searchQuery === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description &&
          app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((groups, app) => {
      const firstLetter = app.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(app);
      return groups;
    }, {} as Record<string, typeof allApplications>);

  const handleSystemFeatureClick = (featureId: string) => {
    switch (featureId) {
      // Featured Quotation Apps
      case "quotation-wizard":
        addWindow({
          id: `quotation-wizard-${Date.now()}`,
          title: "Quotation Wizard",
          content: (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="lucide:magic-wand"
                    className="text-white text-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Quotation Wizard
                </h2>
                <p className="text-gray-600 mb-6">
                  Step-by-step guided quotation creation
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    This feature will guide you through creating professional
                    quotations with ease.
                  </p>
                </div>
              </div>
            </div>
          ),
          width: 800,
          height: 600,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "bulk-quotations":
        addWindow({
          id: `bulk-quotations-${Date.now()}`,
          title: "Bulk Quotations",
          content: (
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:layers" className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Bulk Quotations
                </h2>
                <p className="text-gray-600 mb-6">
                  Create multiple quotations efficiently
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Generate multiple quotations for different clients or
                    products simultaneously.
                  </p>
                </div>
              </div>
            </div>
          ),
          width: 900,
          height: 700,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "price-calculator":
        addWindow({
          id: `price-calculator-${Date.now()}`,
          title: "Price Calculator",
          content: (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="lucide:calculator"
                    className="text-white text-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Advanced Price Calculator
                </h2>
                <p className="text-gray-600 mb-6">
                  Complex pricing calculations and scenarios
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Calculate complex pricing with discounts, taxes, and volume
                    pricing.
                  </p>
                </div>
              </div>
            </div>
          ),
          width: 600,
          height: 500,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "client-portal":
        addWindow({
          id: `client-portal-${Date.now()}`,
          title: "Client Portal",
          content: (
            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="lucide:external-link"
                    className="text-white text-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Client Portal
                </h2>
                <p className="text-gray-600 mb-6">
                  Customer self-service portal
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Allow clients to view, approve, and manage their quotations
                    online.
                  </p>
                </div>
              </div>
            </div>
          ),
          width: 1000,
          height: 700,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "workflow-designer":
        addWindow({
          id: `workflow-designer-${Date.now()}`,
          title: "Workflow Designer",
          content: (
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-100 h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="lucide:workflow"
                    className="text-white text-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Workflow Designer
                </h2>
                <p className="text-gray-600 mb-6">
                  Design custom approval workflows
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Create and customize approval workflows for your quotation
                    process.
                  </p>
                </div>
              </div>
            </div>
          ),
          width: 1100,
          height: 800,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      // System Tools
      case "file-manager":
        addWindow({
          id: `file-manager-${Date.now()}`,
          title: "File Manager",
          content: <div className="p-4">File Manager - Coming Soon</div>,
          width: 800,
          height: 600,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "email-client":
        addWindow({
          id: `email-${Date.now()}`,
          title: "Email Client",
          content: <div className="p-4">Email Client - Coming Soon</div>,
          width: 900,
          height: 600,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "whatsapp-web":
        addWindow({
          id: `whatsapp-${Date.now()}`,
          title: "WhatsApp Web",
          content: (
            <iframe
              src="https://web.whatsapp.com"
              className="w-full h-full border-0"
              title="WhatsApp Web"
            />
          ),
          width: 1000,
          height: 700,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "browser":
        addWindow({
          id: `browser-${Date.now()}`,
          title: "Web Browser",
          content: (
            <div className="p-4">
              <input
                type="url"
                placeholder="Enter URL..."
                className="w-full p-2 border rounded mb-4"
              />
              <div>Web Browser - Coming Soon</div>
            </div>
          ),
          width: 1000,
          height: 700,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
    }
    closeStartMenu();
  };

  return (
    <motion.div
      className="start-menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Windows 11 Style Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center bg-white/10 rounded-lg p-3 mb-4">
          <Icon icon="lucide:search" className="text-white/70 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Search for apps, settings, and documents"
            className="bg-transparent border-none outline-none text-white w-full placeholder-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Windows 11 Style Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <button
              className={`text-sm font-medium transition-colors duration-200 ${
                viewMode === "pinned"
                  ? "text-white border-b-2 border-blue-500 pb-1"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => setViewMode("pinned")}
            >
              Pinned
            </button>
            <button
              className={`text-sm font-medium transition-colors duration-200 ${
                viewMode === "all"
                  ? "text-white border-b-2 border-blue-500 pb-1"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => setViewMode("all")}
            >
              All apps
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "pinned" ? (
          /* Pinned Apps Grid */
          <div>
            <div className="grid grid-cols-6 gap-4 mb-6">
              {[...apps.slice(0, 12), ...featuredApps.slice(0, 6)].map(
                (app) => (
                  <motion.div
                    key={app.id}
                    className="flex flex-col items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (featuredApps.some((f) => f.id === app.id)) {
                        handleSystemFeatureClick(app.id);
                      } else {
                        handleAppClick(app.id);
                      }
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-lg ${
                        app.category === "quotation"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : app.category === "analytics"
                          ? "bg-gradient-to-br from-purple-500 to-purple-600"
                          : app.category === "crm"
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : app.category === "inventory"
                          ? "bg-gradient-to-br from-orange-500 to-orange-600"
                          : app.category === "templates"
                          ? "bg-gradient-to-br from-teal-500 to-teal-600"
                          : app.category === "communication"
                          ? "bg-gradient-to-br from-pink-500 to-pink-600"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600"
                      }`}
                    >
                      <Icon icon={app.icon} className="text-white text-xl" />
                    </div>
                    <div className="text-white text-xs text-center font-medium leading-tight max-w-16">
                      {app.name}
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* Recommended Section for Pinned View */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">
                Recommended
              </h3>
              <div className="space-y-2">
                {featuredApps.slice(0, 3).map((app) => (
                  <motion.div
                    key={`rec-${app.id}`}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSystemFeatureClick(app.id)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                      <Icon icon={app.icon} className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {app.name}
                      </div>
                      <div className="text-white/60 text-xs">
                        Recently added
                      </div>
                    </div>
                    <Icon
                      icon="lucide:more-horizontal"
                      className="text-white/40"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* All Apps - Windows Style Alphabetical List */
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedApps).map(([letter, apps]) => (
              <div key={letter}>
                <h4 className="text-white/70 text-sm font-semibold mb-2 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-1">
                  {letter}
                </h4>
                <div className="space-y-1">
                  {apps.map((app) => (
                    <motion.div
                      key={app.id}
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (app.isSystemFeature) {
                          handleSystemFeatureClick(app.id);
                        } else {
                          handleAppClick(app.id);
                        }
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          app.category === "quotation"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : app.category === "analytics"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600"
                            : app.category === "crm"
                            ? "bg-gradient-to-br from-green-500 to-green-600"
                            : app.category === "inventory"
                            ? "bg-gradient-to-br from-orange-500 to-orange-600"
                            : app.category === "templates"
                            ? "bg-gradient-to-br from-teal-500 to-teal-600"
                            : app.category === "communication"
                            ? "bg-gradient-to-br from-pink-500 to-pink-600"
                            : "bg-gradient-to-br from-gray-500 to-gray-600"
                        }`}
                      >
                        <Icon icon={app.icon} className="text-white text-sm" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">
                          {app.name}
                        </div>
                        {app.description && (
                          <div className="text-white/50 text-xs">
                            {app.description}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center mr-3">
          <Icon icon="lucide:user" className="text-white" />
        </div>
        <div>
          <div className="text-white text-sm">Admin User</div>
          <div className="text-white/50 text-xs">admin@company.com</div>
        </div>
        <div className="ml-auto">
          <Icon
            icon="lucide:power"
            className="text-white/70 hover:text-white cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
};
