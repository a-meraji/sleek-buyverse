import { DialogHeader as BaseDialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  onDelete: () => void;
}

export function DialogHeader({ onDelete }: DialogHeaderProps) {
  return (
    <BaseDialogHeader className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <DialogTitle>Edit Product</DialogTitle>
      </div>
    </BaseDialogHeader>
  );
}