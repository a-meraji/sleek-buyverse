import { DialogHeader, DialogTitle as BaseDialogTitle } from "@/components/ui/dialog";
import { FavoriteButton } from "./FavoriteButton";

interface DialogTitleProps {
  userId: string | null;
  productId: string;
}

export function DialogTitle({ userId, productId }: DialogTitleProps) {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <BaseDialogTitle>Product Overview</BaseDialogTitle>
        <FavoriteButton userId={userId} productId={productId} />
      </div>
    </DialogHeader>
  );
}