import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProductActionsProps {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function ProductActions({ onEdit, onDelete }: ProductActionsProps) {
  return (
    <TableCell>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  );
}