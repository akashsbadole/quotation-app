import React from "react";
import { motion, useDragControls } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/app-context";
import { WindowType } from "../types/window";

interface WindowProps {
  window: WindowType;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const {
    removeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    activeWindowId,
  } = useAppContext();
  const dragControls = useDragControls();
  const isActive = activeWindowId === window.id;

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    dragControls.start(e);
    if (!isActive) {
      focusWindow(window.id);
    }
  };

  const handleWindowClick = () => {
    if (!isActive) {
      focusWindow(window.id);
    }
  };

  return (
    <motion.div
      className="window"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: window.maximized ? "100vw" : window.width,
        height: window.maximized ? "calc(100vh - 48px)" : window.height,
        left: window.maximized ? 0 : window.x,
        top: window.maximized ? 0 : window.y,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        zIndex: isActive ? 900 : window.zIndex || 1,
        boxShadow: isActive
          ? "0 8px 32px rgba(0, 0, 0, 0.24)"
          : "0 4px 16px rgba(0, 0, 0, 0.12)",
      }}
      drag={!window.maximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onClick={handleWindowClick}
    >
      <div className="window-header" onPointerDown={handleHeaderPointerDown}>
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <div
            className="window-minimize window-control"
            onClick={() => minimizeWindow(window.id)}
          />
          <div
            className="window-maximize window-control"
            onClick={() => maximizeWindow(window.id)}
          />
          <div
            className="window-close window-control"
            onClick={() => removeWindow(window.id)}
          />
        </div>
      </div>
      <div className="window-content">{window.content}</div>
    </motion.div>
  );
};
