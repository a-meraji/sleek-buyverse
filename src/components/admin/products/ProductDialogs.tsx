import { EditProductDialog } from "../EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { Product } from "@/types/product";

interface ProductDialogsProps {
  selectedProduct: Product | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  onEditDialogClose: () => void;
  onDeleteDialogClose: () => void;
  onConfirmDelete: () => void;
}

export function ProductDialogs({
  selectedProduct,
  isEditDialogOpen,
  isDeleteDialogOpen,
  onEditDialogClose,
  onDeleteDialogClose,
  onConfirmDelete
}: ProductDialogsProps) {
  return (
    <>
      {isEditDialogOpen && (
        <EditProductDialog
          product={selectedProduct}
          onClose={onEditDialogClose}
          onDelete={onConfirmDelete}
        />
      )}

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) onDeleteDialogClose();
        }}
        product={selectedProduct}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}