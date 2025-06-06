import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { apps } from "../data/apps";

export const StartMenu: React.FC = () => {
  const { closeStartMenu, addWindow } = useAppContext();
  const [searchQuery, setSearchQuery] = React.useState("");

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

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description &&
        app.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { id: "all", name: "All Apps", icon: "lucide:grid" },
    { id: "quotation", name: "Quotation", icon: "lucide:file-text" },
    { id: "management", name: "Management", icon: "lucide:settings" },
    { id: "reporting", name: "Reporting", icon: "lucide:bar-chart-2" },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const categoryApps =
    selectedCategory === "all"
      ? filteredApps
      : filteredApps.filter((app) => app.category === selectedCategory);

  return (
    <motion.div
      className="start-menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white/10 rounded-md p-2">
          <Icon icon="lucide:search" className="text-white/70 mr-2" />
          <input
            type="text"
            placeholder="Type to search..."
            className="bg-transparent border-none outline-none text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex px-4 space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center px-3 py-1 rounded-md cursor-pointer ${
              selectedCategory === category.id
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <Icon icon={category.icon} className="text-white mr-2" />
            <span className="text-white text-sm">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Pinned/All Apps */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-white/70 text-sm mb-3">
          {selectedCategory === "all"
            ? "All Apps"
            : categories.find((c) => c.id === selectedCategory)?.name}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {categoryApps.map((app) => (
            <motion.div
              key={app.id}
              className="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAppClick(app.id)}
            >
              <div className="w-10 h-10 rounded-md bg-primary-500/20 flex items-center justify-center mr-3">
                <Icon icon={app.icon} className="text-white text-xl" />
              </div>
              <div>
                <div className="text-white text-sm">{app.name}</div>
                {app.description && (
                  <div className="text-white/50 text-xs">{app.description}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
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
