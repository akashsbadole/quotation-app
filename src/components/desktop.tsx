import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { Taskbar } from "./taskbar";
import { Window } from "./window";
import { StartMenu } from "./start-menu";
import { DesktopIcon } from "./desktop-icon";
import { DesktopContextMenu } from "./desktop-context-menu";
import { apps } from "../data/apps";
import { WallpaperPicker } from "./apps/wallpaper-picker";
import { TextEditor } from "./apps/text-editor";
import { FolderViewer } from "./apps/folder-viewer";
import { DesktopItemType } from "../types/window";

export const Desktop: React.FC = () => {
  const {
    wallpaper,
    openWindows,
    isStartMenuOpen,
    closeStartMenu,
    addWindow,
    desktopItems,
  } = useAppContext();

  const [contextMenu, setContextMenu] = React.useState({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const handleDesktopClick = () => {
    closeStartMenu();
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 } });
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeStartMenu();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
    });
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

  const handleDesktopItemClick = (item: DesktopItemType) => {
    switch (item.type) {
      case "document":
        addWindow({
          id: `text-editor-${item.id}-${Date.now()}`,
          title: item.name,
          content: (
            <TextEditor
              initialContent={item.content || ""}
              fileName={item.name}
            />
          ),
          width: 800,
          height: 600,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "folder":
        addWindow({
          id: `folder-${item.id}-${Date.now()}`,
          title: item.name,
          content: (
            <FolderViewer
              folderName={item.name}
              items={desktopItems.filter((i) => i.type !== "folder")}
            />
          ),
          width: 900,
          height: 600,
          x: 100 + Math.random() * 100,
          y: 50 + Math.random() * 50,
          resizable: true,
          zIndex: Math.min(Date.now(), 800),
        });
        break;
      case "shortcut":
        if (item.target) {
          openApp(item.target);
        }
        break;
      default:
        break;
    }
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
      onContextMenu={handleRightClick}
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

      {/* Desktop Items (Folders, Documents, Shortcuts) */}
      <div className="absolute inset-0 p-4">
        {desktopItems.map((item) => (
          <div
            key={item.id}
            className="absolute flex flex-col items-center w-20 cursor-pointer group"
            style={{
              left: Math.min(item.position.x, window.innerWidth - 80),
              top: Math.min(item.position.y, window.innerHeight - 100),
            }}
            onDoubleClick={() => handleDesktopItemClick(item)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-colors">
              <Icon icon={item.icon} className="text-2xl text-white" />
            </div>
            <span className="text-xs text-white text-center mt-1 bg-black/30 px-1 rounded max-w-full break-words">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {openWindows.map(
        (window) =>
          !window.minimized && <Window key={window.id} window={window} />
      )}

      {/* Start Menu */}
      {isStartMenuOpen && <StartMenu />}

      {/* Desktop Context Menu */}
      <DesktopContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() =>
          setContextMenu({ isOpen: false, position: { x: 0, y: 0 } })
        }
      />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
