import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductVariant } from "@/types/variant";

interface VariantSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  variants?: ProductVariant[];
}

export function VariantSelector({ label, options, value, onChange, variants }: VariantSelectorProps) {
  const isOutOfStock = (option: string) => {
    if (!variants || label.toLowerCase() !== 'size') return false;
    const variant = variants.find(v => v.size === option);
    return variant ? variant.stock <= 0 : true;
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex gap-2"
      >
        {options.map((option) => (
          <div key={option} className={`flex items-center space-x-2 ${isOutOfStock(option) ? 'opacity-50' : ''}`}>
            <RadioGroupItem 
              value={option} 
              id={`${label.toLowerCase()}-${option}`}
              disabled={isOutOfStock(option)}
            />
            <Label htmlFor={`${label.toLowerCase()}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}