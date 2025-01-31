import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

interface DeleteFolderButtonProps {
  folderId: string;
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onUpdate: () => void;
}

export function DeleteFolderButton({ 
  folderId, 
  currentFolder, 
  onFolderSelect, 
  onUpdate 
}: DeleteFolderButtonProps) {
  const { toast } = useToast();

  const handleDeleteFolder = async () => {
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
      onUpdate();
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
            onClick={handleDeleteFolder}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}