import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { useDataContext } from "../context/data-context";
import { apps } from "../data/apps";
import { TextEditor } from "./apps/text-editor";

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export const DesktopContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
}) => {
  const { addWindow, setWallpaper } = useAppContext();
  const { addDesktopItem } = useDataContext();

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

    onClose();
  };

  const handleWallpaperChange = () => {
    const wallpapers = [
      "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1",
      "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=2",
      "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=3",
      "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=4",
      "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=5",
    ];
    const randomWallpaper =
      wallpapers[Math.floor(Math.random() * wallpapers.length)];
    setWallpaper(randomWallpaper);
    onClose();
  };

  const createNewFolder = async () => {
    const newFolder = {
      name: "New Folder",
      type: "folder" as const,
      icon: "lucide:folder",
      position: { x: position.x, y: position.y },
    };

    try {
      await addDesktopItem(newFolder);
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
      alert("Failed to create folder. Please try again.");
    }
  };

  const createNewDocument = async () => {
    const newDocument = {
      name: "New Text Document.txt",
      type: "document" as const,
      icon: "lucide:file-text",
      position: { x: position.x, y: position.y },
      content: "",
    };

    try {
      const savedDocument = await addDesktopItem(newDocument);

      // Also open the document in a text editor
      addWindow({
        id: `text-editor-${Date.now()}`,
        title: savedDocument.name,
        content: (
          <TextEditor
            initialContent={savedDocument.content || ""}
            fileName={savedDocument.name}
          />
        ),
        width: 800,
        height: 600,
        x: 100 + Math.random() * 100,
        y: 50 + Math.random() * 50,
        resizable: true,
        zIndex: Math.min(Date.now(), 800),
      });

      onClose();
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document. Please try again.");
    }
  };

  const createNewShortcut = async () => {
    const newShortcut = {
      name: "New Shortcut",
      type: "shortcut" as const,
      icon: "lucide:link",
      position: { x: position.x, y: position.y },
      target: "quotations", // Default to quotations app
    };

    try {
      await addDesktopItem(newShortcut);
      onClose();
    } catch (error) {
      console.error("Failed to create shortcut:", error);
      alert("Failed to create shortcut. Please try again.");
    }
  };

  const menuItems = [
    {
      label: "View",
      icon: "lucide:eye",
      submenu: [
        {
          label: "Large icons",
          icon: "lucide:grid-3x3",
          action: () => console.log("Large icons"),
        },
        {
          label: "Medium icons",
          icon: "lucide:grid-2x2",
          action: () => console.log("Medium icons"),
        },
        {
          label: "Small icons",
          icon: "lucide:grid",
          action: () => console.log("Small icons"),
        },
        {
          label: "Auto arrange icons",
          icon: "lucide:align-justify",
          action: () => console.log("Auto arrange"),
        },
      ],
    },
    {
      label: "Sort by",
      icon: "lucide:arrow-up-down",
      submenu: [
        {
          label: "Name",
          icon: "lucide:type",
          action: () => console.log("Sort by name"),
        },
        {
          label: "Size",
          icon: "lucide:hard-drive",
          action: () => console.log("Sort by size"),
        },
        {
          label: "Date modified",
          icon: "lucide:calendar",
          action: () => console.log("Sort by date"),
        },
        {
          label: "Type",
          icon: "lucide:file",
          action: () => console.log("Sort by type"),
        },
      ],
    },
    { type: "divider" },
    {
      label: "Refresh",
      icon: "lucide:refresh-cw",
      action: () => {
        window.location.reload();
        onClose();
      },
    },
    { type: "divider" },
    {
      label: "New",
      icon: "lucide:plus",
      submenu: [
        {
          label: "Folder",
          icon: "lucide:folder-plus",
          action: createNewFolder,
        },
        {
          label: "Shortcut",
          icon: "lucide:link",
          action: createNewShortcut,
        },
        {
          label: "Text Document",
          icon: "lucide:file-text",
          action: createNewDocument,
        },
      ],
    },
    { type: "divider" },
    {
      label: "Personalize",
      icon: "lucide:palette",
      action: handleWallpaperChange,
    },
    { type: "divider" },
    {
      label: "Open Apps",
      icon: "lucide:grid-3x3",
      submenu: apps.map((app) => ({
        label: app.name,
        icon: app.icon,
        action: () => handleAppClick(app.id),
      })),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[1500]" onClick={onClose} />

          {/* Context Menu */}
          <motion.div
            className="fixed z-[1501] bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 py-2 min-w-[200px]"
            style={{
              left: position.x,
              top: position.y,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {menuItems.map((item, index) => (
              <ContextMenuItem key={index} item={item} onClose={onClose} />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface ContextMenuItemProps {
  item: any;
  onClose: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ item, onClose }) => {
  const [showSubmenu, setShowSubmenu] = React.useState(false);

  if (item.type === "divider") {
    return <div className="h-px bg-gray-200 my-1 mx-2" />;
  }

  const handleClick = () => {
    if (item.action) {
      item.action();
    }
    if (!item.submenu) {
      onClose();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => item.submenu && setShowSubmenu(true)}
      onMouseLeave={() => item.submenu && setShowSubmenu(false)}
    >
      <div
        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        onClick={handleClick}
      >
        <Icon icon={item.icon} className="mr-3 text-gray-600" />
        <span className="flex-1">{item.label}</span>
        {item.submenu && (
          <Icon icon="lucide:chevron-right" className="ml-2 text-gray-400" />
        )}
      </div>

      {/* Submenu */}
      {item.submenu && showSubmenu && (
        <motion.div
          className="absolute left-full top-0 ml-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 py-2 min-w-[180px] z-[1502]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          {item.submenu.map((subItem: any, subIndex: number) => (
            <div
              key={subIndex}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                subItem.action();
                onClose();
              }}
            >
              <Icon icon={subItem.icon} className="mr-3 text-gray-600" />
              <span>{subItem.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
