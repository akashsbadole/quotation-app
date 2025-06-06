import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/app-context";

export const Taskbar: React.FC = () => {
  const { 
    openWindows, 
    focusWindow, 
    activeWindowId, 
    isStartMenuOpen, 
    toggleStartMenu 
  } = useAppContext();
  
  return (
    <div className="taskbar absolute bottom-0 left-0 right-0">
      <div className="flex items-center h-full">
        {/* Start Button */}
        <motion.div
          className={`flex items-center justify-center w-12 h-12 rounded-md mx-1 cursor-pointer ${
            isStartMenuOpen ? "bg-primary-500/20" : "hover:bg-white/10"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleStartMenu}
        >
          <Icon icon="logos:microsoft-icon" className="text-2xl" />
        </motion.div>
        
        {/* Search */}
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-md mx-1 cursor-pointer hover:bg-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon icon="lucide:search" className="text-white text-xl" />
        </motion.div>
        
        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-2"></div>
        
        {/* Open Windows */}
        <div className="flex items-center">
          {openWindows.map((window) => (
            <motion.div
              key={window.id}
              className={`flex items-center justify-center w-12 h-12 rounded-md mx-1 cursor-pointer ${
                activeWindowId === window.id ? "bg-white/20" : "hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => focusWindow(window.id)}
            >
              <Icon 
                icon={window.id.includes("quotations") ? "lucide:file-text" : 
                      window.id.includes("clients") ? "lucide:users" :
                      window.id.includes("products") ? "lucide:package" :
                      window.id.includes("templates") ? "lucide:layout-template" :
                      window.id.includes("reports") ? "lucide:bar-chart-2" :
                      window.id.includes("settings") ? "lucide:settings" :
                      window.id.includes("wallpaper") ? "lucide:image" :
                      "lucide:app-window"} 
                className="text-white text-xl" 
              />
            </motion.div>
          ))}
        </div>
        
        {/* Right side */}
        <div className="ml-auto flex items-center">
          <div className="flex items-center justify-center px-3 h-full">
            <div className="text-white text-xs">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};