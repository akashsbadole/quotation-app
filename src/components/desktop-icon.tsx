import React from "react";
import { Icon } from "@iconify/react";
import { DesktopIconType } from "../types/window";

export const DesktopIcon: React.FC<DesktopIconType> = ({ id, name, icon, onClick }) => {
  const [isSelected, setIsSelected] = React.useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
    setIsSelected(false);
  };
  
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsSelected(false);
    };
    
    if (isSelected) {
      document.addEventListener("click", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSelected]);
  
  return (
    <div
      className={`desktop-icon ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Icon icon={icon} className="text-white text-3xl drop-shadow-md" />
      <div className="desktop-icon-label">{name}</div>
    </div>
  );
};