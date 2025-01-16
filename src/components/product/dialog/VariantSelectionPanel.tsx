import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductVariant } from "@/types/variant";

interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
}

export const VariantSelectionPanel = ({
  variants,
  selectedParameters,
  onParameterSelect,
}: VariantSelectionPanelProps) => {
  // Get unique parameter keys from all variants
  const parameterKeys = Array.from(
    new Set(
      variants.flatMap(variant => 
        Object.keys(variant.parameters)
      )
    )
  );

  // Get unique values for each parameter
  const getUniqueValuesForParameter = (key: string) => {
    return Array.from(
      new Set(
        variants
          .map(variant => variant.parameters[key])
          .filter(Boolean)
      )
    );
  };

  return (
    <div className="space-y-4">
      {parameterKeys.map(key => (
        <div key={key} className="space-y-2">
          <Label className="capitalize">{key}</Label>
          <RadioGroup
            value={selectedParameters[key]?.toString()}
            onValueChange={(value) => onParameterSelect(key, value)}
            className="flex flex-wrap gap-2"
          >
            {getUniqueValuesForParameter(key).map((value) => (
              <div key={`${key}-${value}`} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={value.toString()}
                  id={`${key}-${value}`}
                />
                <Label htmlFor={`${key}-${value}`} className="capitalize">
                  {value.toString()}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};