import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { TableCell } from "@/components/ui/table";
import { Product } from "@/types/product";

interface ProductActionsCellProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductActionsCell({ 
  product, 
  onEdit, 
  onDelete 
}: ProductActionsCellProps) {
  const handleAction = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <TableCell>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleAction(e, () => onEdit(product))}
        >
          <Pencil className="h-4 w-4" />
          <span className="ml-2">Edit</span>
        </Button>
      </div>
    </TableCell>
  );
}