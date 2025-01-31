import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableFolderItemProps {
  folder: {
    id: string;
    name: string;
  };
  onUpdate: () => void;
}

export function EditableFolderItem({ folder, onUpdate }: EditableFolderItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('image_folders')
        .update({ name: newName })
        .eq('id', folder.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Folder name updated successfully",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: "Error",
        description: "Failed to update folder name",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-8 w-40"
        />
        <Button
          size="sm"
          onClick={handleUpdate}
          className="h-8"
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="h-8"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setIsEditing(true)}
      className="h-8 w-8"
    >
      <Edit2 className="h-4 w-4" />
    </Button>
  );
}