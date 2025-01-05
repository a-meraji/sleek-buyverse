import { EditProductDialog } from "../EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { Product } from "@/types/product";

interface ProductDialogsProps {
  selectedProduct: Product | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  onEditDialogClose: () => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export function ProductDialogs({
  selectedProduct,
  isEditDialogOpen,
  isDeleteDialogOpen,
  onEditDialogClose,
  onDeleteDialogOpenChange,
  onConfirmDelete
}: ProductDialogsProps) {
  return (
    <>
      <EditProductDialog
        product={selectedProduct}
        onClose={onEditDialogClose}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        product={selectedProduct}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}