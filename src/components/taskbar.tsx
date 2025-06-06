import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/app-context";
import { apps } from "../data/apps";
import { Tooltip } from "@heroui/react";

export const Taskbar: React.FC = () => {
  const {
    openWindows,
    focusWindow,
    activeWindowId,
    isStartMenuOpen,
    toggleStartMenu,
    addWindow,
  } = useAppContext();

  // Comprehensive taskbar apps - All quotation management features
  const taskbarApps = [
    {
      id: "quotations",
      name: "Basic Quotations",
      icon: "lucide:file-text",
      description: "Create and manage quotations",
      category: "Core",
    },
    {
      id: "enhanced-quotations",
      name: "Enhanced Quotations",
      icon: "lucide:file-plus",
      description: "Advanced quotation management with analytics",
      category: "Advanced",
    },
    {
      id: "comprehensive-quotations",
      name: "Comprehensive Quotations",
      icon: "lucide:file-stack",
      description: "Complete enterprise quotation system",
      category: "Enterprise",
    },
    {
      id: "advanced-analytics",
      name: "Advanced Analytics",
      icon: "lucide:bar-chart-3",
      description: "Business intelligence and performance metrics",
      category: "Analytics",
    },
    {
      id: "clients",
      name: "Client Management",
      icon: "lucide:users",
      description: "Customer relationship management",
      category: "CRM",
    },
    {
      id: "products",
      name: "Product Catalog",
      icon: "lucide:package",
      description: "Product and service management",
      category: "Inventory",
    },
    {
      id: "templates",
      name: "Templates",
      icon: "lucide:layout-template",
      description: "Quotation templates and layouts",
      category: "Templates",
    },
    {
      id: "reports",
      name: "Reports",
      icon: "lucide:bar-chart-2",
      description: "Business reports and summaries",
      category: "Reporting",
    },
    {
      id: "settings",
      name: "Settings",
      icon: "lucide:settings",
      description: "System configuration and preferences",
      category: "System",
    },
  ];

  return (
    <div className="taskbar absolute bottom-0 left-0 right-0">
      <div className="flex items-center justify-center h-full px-4">
        {/* Windows 11 Style Centered Layout */}
        <div className="flex items-center bg-black/20 backdrop-blur-md rounded-xl px-2 py-1">
          {/* Windows Start Button */}
          <motion.div
            className={`flex items-center justify-center w-12 h-12 rounded-lg mx-1 cursor-pointer transition-all duration-200 ${
              isStartMenuOpen ? "bg-white/20" : "hover:bg-white/10"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleStartMenu}
          >
            <Icon icon="logos:microsoft-icon" className="text-2xl" />
          </motion.div>

          {/* Search Button */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-lg mx-1 cursor-pointer hover:bg-white/10 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="lucide:search" className="text-white text-xl" />
          </motion.div>

          {/* Task View Button */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-lg mx-1 cursor-pointer hover:bg-white/10 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="lucide:layout-grid" className="text-white text-xl" />
          </motion.div>

          {/* Separator */}
          <div className="h-8 w-px bg-white/20 mx-2"></div>

          {/* Pinned Apps - Windows 11 Style */}
          {taskbarApps.slice(0, 7).map((app, index) => (
            <Tooltip key={app.id} content={app.name} placement="top">
              <motion.div
                className={`relative flex items-center justify-center w-12 h-12 rounded-lg mx-1 cursor-pointer transition-all duration-200 ${
                  openWindows.some((w) => w.id === app.id)
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const appData = apps.find((a) => a.id === app.id);
                  if (appData) {
                    const AppComponent = appData.component;
                    addWindow({
                      id: app.id,
                      title: app.name,
                      content: <AppComponent />,
                      x: 50 + index * 30,
                      y: 50 + index * 20,
                      width: 1200,
                      height: 800,
                      minimized: false,
                      maximized: false,
                      zIndex: Date.now(),
                    });
                  }
                }}
              >
                <Icon icon={app.icon} className="text-white text-2xl" />
                {/* Windows 11 style running indicator */}
                {openWindows.some((w) => w.id === app.id) && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                )}
              </motion.div>
            </Tooltip>
          ))}
        </div>

        {/* Active Windows (Minimized/Background) */}
        {openWindows.filter((w) => !taskbarApps.some((app) => app.id === w.id))
          .length > 0 && (
          <>
            <div className="h-6 w-px bg-white/20 mx-2"></div>
            <div className="flex items-center">
              {openWindows
                .filter((w) => !taskbarApps.some((app) => app.id === w.id))
                .map((window) => (
                  <Tooltip
                    key={window.id}
                    content={window.title}
                    placement="top"
                  >
                    <motion.div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-md mx-1 cursor-pointer ${
                        activeWindowId === window.id
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => focusWindow(window.id)}
                    >
                      <Icon
                        icon={
                          window.id === "comprehensive-quotations"
                            ? "lucide:file-stack"
                            : window.id === "enhanced-quotations"
                            ? "lucide:file-plus"
                            : window.id === "advanced-analytics"
                            ? "lucide:bar-chart-3"
                            : window.id.includes("quotations")
                            ? "lucide:file-text"
                            : window.id.includes("clients")
                            ? "lucide:users"
                            : window.id.includes("products")
                            ? "lucide:package"
                            : window.id.includes("templates")
                            ? "lucide:layout-template"
                            : window.id.includes("reports")
                            ? "lucide:bar-chart-2"
                            : window.id.includes("settings")
                            ? "lucide:settings"
                            : window.id.includes("wallpaper")
                            ? "lucide:image"
                            : "lucide:app-window"
                        }
                        className="text-white text-xl"
                      />
                      {/* Active indicator */}
                      {activeWindowId === window.id && (
                        <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </motion.div>
                  </Tooltip>
                ))}
            </div>
          </>
        )}

        {/* Windows 11 Style System Tray - Right Side */}
        <div className="absolute right-4 flex items-center">
          <div className="flex items-center bg-black/20 backdrop-blur-md rounded-xl px-2 py-1">
            {/* System Status Icons */}
            <div className="flex items-center gap-1">
              <Tooltip content="Network Status" placement="top">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon icon="lucide:wifi" className="text-white text-sm" />
                </motion.div>
              </Tooltip>

              <Tooltip content="Volume" placement="top">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon icon="lucide:volume-2" className="text-white text-sm" />
                </motion.div>
              </Tooltip>

              <Tooltip content="Notifications" placement="top">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon icon="lucide:bell" className="text-white text-sm" />
                </motion.div>
              </Tooltip>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-white/20 mx-2"></div>

            {/* Date and Time */}
            <Tooltip
              content={
                <div className="text-center">
                  <div className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-xs">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>
                </div>
              }
              placement="top"
            >
              <div className="flex flex-col items-center justify-center px-3 h-12 cursor-pointer hover:bg-white/10 rounded-lg">
                <div className="text-white text-xs font-medium">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-white text-xs opacity-75">
                  {new Date().toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
