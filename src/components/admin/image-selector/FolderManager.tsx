import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, FolderPlus, Edit2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const { error } = await supabase
        .from('image_folders')
        .insert([
          { 
            name: newFolderName,
            parent_folder_id: currentFolder 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      
      setNewFolderName("");
      onFoldersUpdate();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!editName.trim()) return;

    try {
      const { error } = await supabase
        .from('image_folders')
        .update({ name: editName })
        .eq('id', folderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Folder renamed successfully",
      });
      
      setEditingFolder(null);
      setEditName("");
      onFoldersUpdate();
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast({
        title: "Error",
        description: "Failed to rename folder",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCreateFolder}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

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
            {editingFolder === folder.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Folder name"
                />
                <Button
                  size="sm"
                  onClick={() => handleRenameFolder(folder.id)}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingFolder(null);
                    setEditName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={`flex-1 justify-start ${currentFolder === folder.id ? 'bg-accent' : ''}`}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingFolder(folder.id);
                    setEditName(folder.name);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}