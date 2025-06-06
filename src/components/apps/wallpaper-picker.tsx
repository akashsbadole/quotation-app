import React from "react";
import { 
  Button, 
  Card,
  CardBody,
  Image,
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/app-context";

export const WallpaperPicker: React.FC = () => {
  const { wallpaper, setWallpaper } = useAppContext();
  const [customUrl, setCustomUrl] = React.useState("");
  
  const wallpapers = [
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=2",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=3",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=4",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=5",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=6",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=7",
    "https://img.heroui.chat/image/landscape?w=1920&h=1080&u=8"
  ];
  
  const handleSetWallpaper = (url: string) => {
    setWallpaper(url);
  };
  
  const handleCustomWallpaper = () => {
    if (customUrl.trim()) {
      setWallpaper(customUrl);
      setCustomUrl("");
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Wallpaper Settings</h1>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Current Wallpaper</h2>
        <Card>
          <CardBody className="p-2">
            <Image
              src={wallpaper}
              alt="Current wallpaper"
              className="w-full h-40 object-cover rounded-lg"
            />
          </CardBody>
        </Card>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Custom URL</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={customUrl}
            onValueChange={setCustomUrl}
          />
          <Button color="primary" onPress={handleCustomWallpaper}>
            Apply
          </Button>
        </div>
      </div>
      
      <h2 className="text-lg font-medium mb-2">Choose Wallpaper</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
        {wallpapers.map((url, index) => (
          <Card 
            key={index} 
            isPressable 
            className={`overflow-hidden ${wallpaper === url ? 'ring-2 ring-primary-500' : ''}`}
            onPress={() => handleSetWallpaper(url)}
          >
            <CardBody className="p-0">
              <Image
                src={url}
                alt={`Wallpaper option ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              {wallpaper === url && (
                <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                  <Icon icon="lucide:check" className="text-white" />
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
