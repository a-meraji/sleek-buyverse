import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FolderListProps {
  folders: any[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFoldersUpdate: () => void;
}

export function FolderList({ folders, currentFolder, onFolderSelect, onFoldersUpdate }: FolderListProps) {
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

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

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // First, get all files in the folder
      const { data: files, error: listError } = await supabase.storage
        .from('images')
        .list(folderId + '/');

      if (listError) throw listError;

      // Delete all files in the folder if any exist
      if (files && files.length > 0) {
        console.log('Deleting files:', files.map(f => `${folderId}/${f.name}`));
        const { error: deleteFilesError } = await supabase.storage
          .from('images')
          .remove(files.map(file => `${folderId}/${file.name}`));

        if (deleteFilesError) throw deleteFilesError;
      }

      // Then delete the folder from the database
      const { error: deleteFolderError } = await supabase
        .from('image_folders')
        .delete()
        .eq('id', folderId);

      if (deleteFolderError) throw deleteFolderError;

      toast({
        title: "Success",
        description: "Folder and its contents deleted successfully",
      });

      if (currentFolder === folderId) {
        onFolderSelect(null);
      }
      onFoldersUpdate();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this folder? This action cannot be undone and will delete all images inside the folder.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      ))}
    </div>
  );
}