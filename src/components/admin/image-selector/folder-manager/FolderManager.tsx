import { useState } from "react";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { FolderSearch } from "./components/FolderSearch";
import { FolderList } from "./components/FolderList";

interface FolderManagerProps {
  folders: any[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFoldersUpdate: () => void;
}

export function FolderManager({
  folders,
  currentFolder,
  onFolderSelect,
  onFoldersUpdate,
}: FolderManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <NewFolderDialog
          currentFolder={currentFolder}
          onFoldersUpdate={onFoldersUpdate}
        />
        <FolderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <FolderList
        folders={filteredFolders}
        currentFolder={currentFolder}
        onFolderSelect={onFolderSelect}
        onFoldersUpdate={onFoldersUpdate}
      />
    </div>
  );
}