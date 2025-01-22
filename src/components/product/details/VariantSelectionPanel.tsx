import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  product,
  userId,
  selectedVariant,
  finalSelectedVariantPrice,
  isLoadingVariants,
  parameterKeys
}: VariantSelectionPanelProps) {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: "Please select all options",
        description: "You need to select all variant options before adding to cart",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: product.id,
          variant_id: selectedVariant.id,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

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

      <Button 
        onClick={handleAddToCart}
        className="w-full"
        disabled={!selectedVariant}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}