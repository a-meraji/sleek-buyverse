import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import { Descendant } from "slate";

interface ProductDetailsFieldsProps {
  name: string;
  description: string;
  sku: string;
  discount?: number | null;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onDiscountChange: (value: number | null) => void;
}

export function ProductDetailsFields({
  name,
  description,
  sku,
  discount,
  onNameChange,
  onDescriptionChange,
  onSkuChange,
  onDiscountChange,
}: ProductDetailsFieldsProps) {
  const handleDiscountChange = (value: string) => {
    const numValue = value === "" ? null : Number(value);
    if (numValue === null || (numValue >= 0 && numValue <= 100)) {
      onDiscountChange(numValue);
    }
  };

  // Parse the description string to Slate's format
  const initialValue: Descendant[] = description ? 
    JSON.parse(description) : 
    [{ type: 'paragraph', children: [{ text: '' }] }];

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
        <RichTextEditor
          value={initialValue}
          onChange={(value) => onDescriptionChange(JSON.stringify(value))}
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

      <div className="space-y-2">
        <label htmlFor="discount" className="text-sm font-medium">Discount (%)</label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={discount ?? ""}
          onChange={(e) => handleDiscountChange(e.target.value)}
          placeholder="Enter discount percentage"
        />
      </div>
    </>
  );
}