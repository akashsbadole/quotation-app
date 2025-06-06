import React from "react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { DesktopItemType } from "../../types/window";

interface FolderViewerProps {
  folderName?: string;
  items?: DesktopItemType[];
  onItemClick?: (item: DesktopItemType) => void;
  onCreateNew?: (type: 'folder' | 'document') => void;
}

export const FolderViewer: React.FC<FolderViewerProps> = ({
  folderName = "New Folder",
  items = [],
  onItemClick,
  onCreateNew,
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemIcon = (item: DesktopItemType) => {
    switch (item.type) {
      case 'folder':
        return 'lucide:folder';
      case 'document':
        return 'lucide:file-text';
      case 'shortcut':
        return 'lucide:link';
      default:
        return 'lucide:file';
    }
  };

  const handleItemDoubleClick = (item: DesktopItemType) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:arrow-left" />}
        >
          Back
        </Button>
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:arrow-right" />}
        >
          Forward
        </Button>
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:arrow-up" />}
        >
          Up
        </Button>
        
        <div className="flex-1 mx-4">
          <Input
            size="sm"
            placeholder="Search in folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" />}
          />
        </div>

        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:folder-plus" />}
          onPress={() => onCreateNew?.('folder')}
        >
          New Folder
        </Button>
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:file-plus" />}
          onPress={() => onCreateNew?.('document')}
        >
          New Document
        </Button>
        
        <div className="flex border border-gray-300 rounded-md">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'solid' : 'light'}
            isIconOnly
            onPress={() => setViewMode('grid')}
          >
            <Icon icon="lucide:grid-3x3" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'solid' : 'light'}
            isIconOnly
            onPress={() => setViewMode('list')}
          >
            <Icon icon="lucide:list" />
          </Button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center px-3 py-2 bg-white border-b border-gray-200">
        <Icon icon="lucide:folder" className="mr-2 text-blue-500" />
        <span className="font-medium">{folderName}</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Icon icon="lucide:folder-open" className="text-6xl mb-4" />
            <p className="text-lg">This folder is empty</p>
            <p className="text-sm">Create new items using the toolbar above</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" 
            : "space-y-1"
          }>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={viewMode === 'grid' 
                  ? "flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                  : "flex items-center p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                }
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <Icon 
                  icon={getItemIcon(item)} 
                  className={viewMode === 'grid' 
                    ? "text-4xl mb-2 text-blue-500" 
                    : "text-xl mr-3 text-blue-500"
                  } 
                />
                <span className={viewMode === 'grid' 
                  ? "text-xs text-center break-words max-w-full" 
                  : "text-sm flex-1"
                }>
                  {item.name}
                </span>
                {viewMode === 'list' && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
        <div>
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </div>
        <div>
          {folderName}
        </div>
      </div>
    </div>
  );
};
