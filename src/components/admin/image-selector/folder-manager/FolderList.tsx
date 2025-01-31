import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { EditableFolderItem } from "./components/EditableFolderItem";
import { DeleteFolderButton } from "./components/DeleteFolderButton";

interface FolderListProps {
  folders: any[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFoldersUpdate: () => void;
}

export function FolderList({ 
  folders, 
  currentFolder, 
  onFolderSelect, 
  onFoldersUpdate 
}: FolderListProps) {
  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className={`w-full justify-start ${!currentFolder ? 'bg-accent' : ''}`}
        onClick={() => onFolderSelect(null)}
      >
        <Folder className="h-4 w-4 mr-2" />
        All Images
      </Button>
      
      {folders.map((folder) => (
        <div key={folder.id} className="flex items-center gap-2">
          <Button
            variant="ghost"
            className={`flex-1 justify-start ${currentFolder === folder.id ? 'bg-accent' : ''}`}
            onClick={() => onFolderSelect(folder.id)}
          >
            <Folder className="h-4 w-4 mr-2" />
            {folder.name}
          </Button>
          
          <EditableFolderItem 
            folder={folder}
            onUpdate={onFoldersUpdate}
          />
          
          <DeleteFolderButton
            folderId={folder.id}
            currentFolder={currentFolder}
            onFolderSelect={onFolderSelect}
            onUpdate={onFoldersUpdate}
          />
        </div>
      ))}
    </div>
  );
}