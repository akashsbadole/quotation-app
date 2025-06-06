import React from "react";
import { WindowType } from "../types/window";

interface AppContextType {
  wallpaper: string;
  setWallpaper: (url: string) => void;
  openWindows: WindowType[];
  addWindow: (window: WindowType) => void;
  removeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

export const AppContext = React.createContext<AppContextType>({
  wallpaper: "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1",
  setWallpaper: () => {},
  openWindows: [],
  addWindow: () => {},
  removeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
  maximizeWindow: () => {},
  activeWindowId: null,
  isStartMenuOpen: false,
  toggleStartMenu: () => {},
  closeStartMenu: () => {},
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wallpaper, setWallpaper] = React.useState<string>(
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1"
  );
  const [openWindows, setOpenWindows] = React.useState<WindowType[]>([]);
  const [activeWindowId, setActiveWindowId] = React.useState<string | null>(
    null
  );
  const [isStartMenuOpen, setIsStartMenuOpen] = React.useState<boolean>(false);

  const addWindow = (window: WindowType) => {
    // Check if window already exists
    const existingWindow = openWindows.find((w) => w.id === window.id);

    if (existingWindow) {
      // If minimized, un-minimize it
      if (existingWindow.minimized) {
        setOpenWindows(
          openWindows.map((w) =>
            w.id === window.id ? { ...w, minimized: false } : w
          )
        );
      }
      // Focus the window
      focusWindow(window.id);
      return;
    }

    // Add new window
    setOpenWindows([...openWindows, window]);
    setActiveWindowId(window.id);
    setIsStartMenuOpen(false);
  };

  const removeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((window) => window.id !== id));

    // Set active window to the last one in the list
    if (activeWindowId === id && openWindows.length > 1) {
      const remainingWindows = openWindows.filter((window) => window.id !== id);
      setActiveWindowId(remainingWindows[remainingWindows.length - 1].id);
    } else if (openWindows.length <= 1) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setOpenWindows(
      openWindows.map((window) =>
        window.id === id
          ? { ...window, minimized: false, zIndex: Math.min(Date.now(), 800) }
          : window
      )
    );
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows(
      openWindows.map((window) =>
        window.id === id ? { ...window, minimized: true } : window
      )
    );

    // Set active window to the next visible one
    const visibleWindows = openWindows.filter(
      (window) => !window.minimized && window.id !== id
    );
    if (visibleWindows.length > 0) {
      setActiveWindowId(visibleWindows[visibleWindows.length - 1].id);
    } else {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setOpenWindows(
      openWindows.map((window) =>
        window.id === id ? { ...window, maximized: !window.maximized } : window
      )
    );
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const closeStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        wallpaper,
        setWallpaper,
        openWindows,
        addWindow,
        removeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        activeWindowId,
        isStartMenuOpen,
        toggleStartMenu,
        closeStartMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
