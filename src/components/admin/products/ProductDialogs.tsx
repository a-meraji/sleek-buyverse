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
      <EditProductDialog
        product={isEditDialogOpen ? selectedProduct : null}
        onClose={onEditDialogClose}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogClose}
        product={selectedProduct}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}