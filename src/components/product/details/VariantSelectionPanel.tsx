import { Badge } from "@/components/ui/badge";
import { ProductVariant } from "@/types";
import { VariantSelector } from "../VariantSelector";

interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  selectedVariant?: ProductVariant;
  finalSelectedVariantPrice: number;
  parameterKeys: string[];
}

export const VariantSelectionPanel = ({
  variants,
  selectedParameters,
  onParameterSelect,
  selectedVariant,
  finalSelectedVariantPrice,
  parameterKeys,
}: VariantSelectionPanelProps) => {
  const isOutOfStock = selectedVariant?.stock <= 0;

  const getOptionsForParameter = (key: string) => {
    return [...new Set(variants.map(v => v.parameters[key]))];
  };

  return (
    <>
      {parameterKeys.map(key => (
        <VariantSelector
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          options={getOptionsForParameter(key)}
          value={selectedParameters[key]?.toString() || ""}
          onChange={(value) => onParameterSelect(key, value)}
        />
      ))}
      
      {selectedVariant && (
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Selected variant: ${finalSelectedVariantPrice.toFixed(2)}
          </p>
          {isOutOfStock && (
            <Badge variant="destructive" className="w-fit">
              Out of Stock
            </Badge>
          )}
        </div>
      )}
    </>
  );
};