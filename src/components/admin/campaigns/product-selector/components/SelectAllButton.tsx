import { Button } from "@/components/ui/button";

interface SelectAllButtonProps {
  isSelectingAll: boolean;
  onToggleSelectAll: () => void;
}

export function SelectAllButton({ isSelectingAll, onToggleSelectAll }: SelectAllButtonProps) {
  return (
    <Button
      onClick={onToggleSelectAll}
      variant={isSelectingAll ? "default" : "outline"}
      className="w-full"
    >
      {isSelectingAll ? "Deselect All Products" : "Select All Products"}
    </Button>
  );
}