import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableFolderItemProps {
  folder: any;
  onUpdate: () => void;
}

export function EditableFolderItem({ folder, onUpdate }: EditableFolderItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const { toast } = useToast();

  const handleRenameFolder = async () => {
    if (!editName.trim()) return;

    try {
      const { error } = await supabase
        .from('image_folders')
        .update({ name: editName })
        .eq('id', folder.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Folder renamed successfully",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast({
        title: "Error",
        description: "Failed to rename folder",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="flex-1 flex gap-2">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Folder name"
        />
        <Button
          size="sm"
          onClick={handleRenameFolder}
        >
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(false);
            setEditName(folder.name);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setIsEditing(true);
        setEditName(folder.name);
      }}
    >
      <Edit2 className="h-4 w-4" />
    </Button>
  );
}