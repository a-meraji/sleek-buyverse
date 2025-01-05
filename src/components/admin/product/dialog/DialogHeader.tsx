import { DialogHeader as Header, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DialogHeaderProps {
  onDelete: () => void;
}

export function DialogHeader({ onDelete }: DialogHeaderProps) {
  return (
    <Header className="flex flex-row items-center justify-between">
      <DialogTitle>Edit Product</DialogTitle>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Product
      </Button>
    </Header>
  );
}