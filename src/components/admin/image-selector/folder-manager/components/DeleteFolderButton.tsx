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
  onUpdate,
}: DeleteFolderButtonProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('image_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      if (currentFolder === folderId) {
        onFolderSelect(null);
      }

      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
      
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
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the folder
            and all its contents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}