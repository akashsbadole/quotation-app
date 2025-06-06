import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { Taskbar } from "./taskbar";
import { Window } from "./window";
import { StartMenu } from "./start-menu";
import { DesktopIcon } from "./desktop-icon";
import { apps } from "../data/apps";
import { WallpaperPicker } from "./apps/wallpaper-picker";

export const Desktop: React.FC = () => {
  const { wallpaper, openWindows, isStartMenuOpen, closeStartMenu, addWindow } =
    useAppContext();

  const handleDesktopClick = () => {
    closeStartMenu();
  };

  const openApp = (appId: string) => {
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
  };

  const desktopIcons = [
    {
      id: "quotations",
      name: "Quotations",
      icon: "lucide:file-text",
      onClick: () => openApp("quotations"),
    },
    {
      id: "clients",
      name: "Clients",
      icon: "lucide:users",
      onClick: () => openApp("clients"),
    },
    {
      id: "products",
      name: "Products",
      icon: "lucide:package",
      onClick: () => openApp("products"),
    },
    {
      id: "templates",
      name: "Templates",
      icon: "lucide:layout-template",
      onClick: () => openApp("templates"),
    },
    {
      id: "reports",
      name: "Reports",
      icon: "lucide:bar-chart-2",
      onClick: () => openApp("reports"),
    },
    {
      id: "settings",
      name: "Settings",
      icon: "lucide:settings",
      onClick: () => openApp("settings"),
    },
    {
      id: "wallpaper",
      name: "Wallpaper",
      icon: "lucide:image",
      onClick: () => openApp("wallpaper"),
    },
  ];

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div className="p-4 grid grid-cols-[repeat(auto-fill,80px)] gap-4">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            onClick={icon.onClick}
          />
        ))}
      </div>

      {/* Windows */}
      {openWindows.map(
        (window) =>
          !window.minimized && <Window key={window.id} window={window} />
      )}

      {/* Start Menu */}
      {isStartMenuOpen && <StartMenu />}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
