import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/types/variant";
import { ParameterInput } from "./variants/ParameterInput";
import { VariantTable } from "./variants/VariantTable";

interface VariantsManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  productId?: string;
}

export function VariantsManager({ variants, onChange, productId }: VariantsManagerProps) {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [newParameterKey, setNewParameterKey] = useState("");
  const [definedParameters, setDefinedParameters] = useState<string[]>(
    Array.from(new Set(variants.flatMap(variant => Object.keys(variant.parameters || {}))))
  );

  const handleAddParameter = () => {
    if (!newParameterKey.trim()) return;
    
    const paramKey = newParameterKey.trim().toLowerCase();
    if (definedParameters.includes(paramKey)) {
      console.log('Parameter already exists');
      return;
    }
    
    setDefinedParameters(prev => [...prev, paramKey]);
    setNewParameterKey("");
    
    const updatedVariants = variants.map(variant => ({
      ...variant,
      parameters: {
        ...variant.parameters,
        [paramKey]: ""
      }
    }));
    onChange(updatedVariants);
  };

  const handleRemoveParameter = (paramKey: string) => {
    setDefinedParameters(prev => prev.filter(key => key !== paramKey));
    
    const updatedVariants = variants.map(variant => {
      const { [paramKey]: removed, ...remainingParams } = variant.parameters;
      return {
        ...variant,
        parameters: remainingParams
      };
    });
    onChange(updatedVariants);
  };

  const handleAddVariant = () => {
    if (definedParameters.length === 0) {
      console.log('No parameters defined');
      return;
    }

    const newParameters = definedParameters.reduce((acc, key) => ({
      ...acc,
      [key]: ""
    }), {});

    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId || "",
      parameters: newParameters,
      stock: 0,
      price: 0,
      created_at: new Date().toISOString()
    };

    onChange([...variants, newVariant]);
    setParameters({});
  };

  const handleUpdateVariant = (variantId: string, field: string, value: string | number) => {
    onChange(
      variants.map(v => {
        if (v.id === variantId) {
          if (field === 'stock' || field === 'price') {
            return { ...v, [field]: Number(value) };
          } else {
            return {
              ...v,
              parameters: {
                ...v.parameters,
                [field]: value
              }
            };
          }
        }
        return v;
      })
    );
  };

  console.log('Current variants:', variants);
  console.log('Defined parameters:', definedParameters);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Product Variants</h3>

        <ParameterInput
          newParameterKey={newParameterKey}
          onParameterKeyChange={setNewParameterKey}
          onAddParameter={handleAddParameter}
          definedParameters={definedParameters}
          onRemoveParameter={handleRemoveParameter}
        />

        {definedParameters.length > 0 && (
          <>
            <VariantTable
              variants={variants}
              definedParameters={definedParameters}
              onUpdateVariant={handleUpdateVariant}
              onRemoveVariant={(variant) => onChange(variants.filter(v => v.id !== variant.id))}
            />

            <Button 
              type="button" 
              onClick={handleAddVariant}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </>
        )}
      </div>
    </div>
  );
}