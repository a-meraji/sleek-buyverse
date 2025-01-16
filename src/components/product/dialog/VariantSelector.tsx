import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VariantSelectorProps {
  label: string;
  options: (string | number)[];
  value: string;
  onChange: (value: string) => void;
}

export function VariantSelector({ label, options, value, onChange }: VariantSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.toString()} 
              id={`${label.toLowerCase()}-${option}`}
            />
            <Label htmlFor={`${label.toLowerCase()}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}