import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/button";

export interface VariantSelectionPanelProps {
  variants: ProductVariant[] | null;
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  product: Product;
  userId: string | null;
  selectedVariant: ProductVariant | undefined;
  finalSelectedVariantPrice: number;
  isLoadingVariants: boolean;
  parameterKeys: string[];
}

export function VariantSelectionPanel({
  variants,
  selectedParameters,
  onParameterSelect,
  parameterKeys,
  isLoadingVariants
}: VariantSelectionPanelProps) {
  if (isLoadingVariants) {
    return <div>Loading variants...</div>;
  }

  if (!variants?.length) {
    return <div>No variants available</div>;
  }

  return (
    <div className="space-y-6">
      {parameterKeys.map(key => {
        const uniqueValues = [...new Set(variants.map(v => v.parameters[key]))];
        
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key}
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueValues.map((value) => (
                <Button
                  key={`${key}-${value}`}
                  onClick={() => onParameterSelect(key, value)}
                  variant={selectedParameters[key] === value ? "default" : "outline"}
                  className="min-w-[4rem]"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}