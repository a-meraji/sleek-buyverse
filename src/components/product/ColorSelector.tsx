import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <RadioGroup 
        value={selectedColor} 
        onValueChange={onColorSelect}
        className="flex gap-2"
      >
        {colors.map((color) => (
          <div key={color} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={color} 
              id={`color-${color}`}
            />
            <Label htmlFor={`color-${color}`}>{color}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}