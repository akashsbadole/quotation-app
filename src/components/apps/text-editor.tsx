import React from "react";
import { Button, Textarea, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TextEditorProps {
  initialContent?: string;
  fileName?: string;
  onSave?: (content: string, fileName: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = "",
  fileName = "Untitled.txt",
  onSave,
}) => {
  const [content, setContent] = React.useState(initialContent);
  const [currentFileName, setCurrentFileName] = React.useState(fileName);
  const [isModified, setIsModified] = React.useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsModified(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content, currentFileName);
    }
    setIsModified(false);
    // In a real app, you would save to localStorage or send to server
    localStorage.setItem(`textdoc_${currentFileName}`, content);
  };

  const handleNew = () => {
    setContent("");
    setCurrentFileName("Untitled.txt");
    setIsModified(false);
  };

  const handleOpen = () => {
    // In a real app, you would show a file picker
    const savedContent = localStorage.getItem(`textdoc_${currentFileName}`);
    if (savedContent) {
      setContent(savedContent);
      setIsModified(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:file-plus" />}
          onPress={handleNew}
        >
          New
        </Button>
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:folder-open" />}
          onPress={handleOpen}
        >
          Open
        </Button>
        <Button
          size="sm"
          variant="light"
          startContent={<Icon icon="lucide:save" />}
          onPress={handleSave}
          color={isModified ? "primary" : "default"}
        >
          Save
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">File:</span>
          <Input
            size="sm"
            value={currentFileName}
            onChange={(e) => setCurrentFileName(e.target.value)}
            className="w-40"
          />
          {isModified && (
            <span className="text-sm text-orange-500">• Modified</span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your document..."
          className="h-full"
          classNames={{
            input: "h-full resize-none font-mono",
            inputWrapper: "h-full",
          }}
          minRows={20}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
        <div>
          Lines: {content.split('\n').length} | Characters: {content.length}
        </div>
        <div>
          {isModified ? "Unsaved changes" : "Saved"}
        </div>
      </div>
    </div>
  );
};
