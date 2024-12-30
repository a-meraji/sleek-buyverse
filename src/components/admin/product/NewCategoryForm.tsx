import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewCategoryFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewCategoryForm({
  value,
  onChange,
  onSubmit,
  onCancel,
}: NewCategoryFormProps) {
  return (
    <div className="flex gap-2 bg-white">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter new category"
      />
      <Button 
        type="button" 
        onClick={onSubmit}
        className="shrink-0"
      >
        Add
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="shrink-0"
      >
        Cancel
      </Button>
    </div>
  );
}