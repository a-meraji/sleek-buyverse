import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsFieldsProps {
  name: string;
  description: string;
  sku: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSkuChange: (value: string) => void;
}

export function ProductDetailsFields({
  name,
  description,
  sku,
  onNameChange,
  onDescriptionChange,
  onSkuChange,
}: ProductDetailsFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="sku" className="text-sm font-medium">SKU</label>
        <Input
          id="sku"
          value={sku}
          onChange={(e) => onSkuChange(e.target.value)}
        />
      </div>
    </>
  );
}