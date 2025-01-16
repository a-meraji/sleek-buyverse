import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductVariant } from "@/types/variant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedParameters: Record<string, string | number>;
  productName: string;
  disabled?: boolean;
  variants: ProductVariant[];
  onSuccess?: () => void;
}

export function AddToCartButton({
  productId,
  userId,
  selectedParameters,
  productName,
  disabled,
  variants,
  onSuccess
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const selectedVariant = variants.find(variant => 
    Object.entries(selectedParameters).every(
      ([key, value]) => variant.parameters[key] === value
    )
  );

  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Find matching variant based on selected parameters
      const selectedVariant = variants.find(variant => 
        Object.entries(selectedParameters).every(
          ([key, value]) => variant.parameters[key] === value
        )
      );

      if (!selectedVariant) {
        throw new Error("Please select all options");
      }

      if (userId) {
        // Authenticated flow
        console.log('Adding to cart with auth:', { userId, productId, variantId: selectedVariant.id });
        
        const { data, error } = await supabase.from("cart_items").insert({
          user_id: userId,
          product_id: productId,
          variant_id: selectedVariant.id,
          quantity: 1
        }).select('*, product:products(*), variant:product_variants(*)').single();

        if (error) throw error;

        // Dispatch cart update event with the new cart item
        const event = new CustomEvent('cartUpdated', {
          detail: { 
            openDrawer: true,
            cartItems: data 
          }
        });
        window.dispatchEvent(event);
        
        console.log('Successfully added to cart:', data);
      } else {
        // Unauthenticated flow
        const { data: product } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('id', productId)
          .single();

        if (!product) throw new Error("Product not found");

        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const newItem = {
          id: `local-${Date.now()}`,
          product_id: productId,
          variant_id: selectedVariant.id,
          quantity: 1,
          product,
          variant: selectedVariant
        };

        localCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(localCart));

        // Dispatch cart update event
        const event = new CustomEvent('cartUpdated', {
          detail: { 
            openDrawer: true,
            cartItems: localCart 
          }
        });
        window.dispatchEvent(event);
      }

      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || isOutOfStock}
        className="w-full"
      >
        Add to Cart
      </Button>
      {isOutOfStock && (
        <span className="text-red-500 text-sm block text-center">
          This variant is currently out of stock
        </span>
      )}
    </div>
  );
}