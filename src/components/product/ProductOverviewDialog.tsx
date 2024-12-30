import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductVariant } from "@/types/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  userId: string | null;
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  productPrice,
  userId
}: ProductOverviewDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Fetch product variants
  const { data: variants } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      console.log('Fetching variants for product:', productId);
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      console.log('Variants fetched:', data);
      return data as ProductVariant[];
    }
  });

  // Set default color when variants are loaded
  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedColor(variants[0].color);
      setSelectedSize(variants[0].size);
    }
  }, [variants]);

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log('Adding to cart:', { productId, selectedSize, selectedColor });
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!selectedSize || !selectedColor) {
        throw new Error('Please select size and color');
      }

      // First check if item already exists in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking cart:', fetchError);
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart:', updateError);
          throw updateError;
        }
      } else {
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: 1
          });

        if (insertError) {
          console.error('Error inserting to cart:', insertError);
          throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      if (error.message === 'User not authenticated') {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to cart.",
          variant: "destructive",
        });
      } else if (error.message === 'Please select size and color') {
        toast({
          title: "Selection required",
          description: "Please select both size and color.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Group variants by size and color
  const sizes = [...new Set(variants?.map(v => v.size) || [])];
  const colors = [...new Set(variants?.map(v => v.color) || [])];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Overview</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="text-lg font-medium">{productName}</h3>
          <p className="text-sm text-gray-500">${productPrice.toFixed(2)}</p>
          
          {variants && variants.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Size</Label>
                <RadioGroup 
                  value={selectedSize} 
                  onValueChange={setSelectedSize}
                  className="flex gap-2"
                >
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <RadioGroup 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  className="flex gap-2"
                >
                  {colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`color-${color}`} />
                      <Label htmlFor={`color-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No variants available</p>
          )}

          <Button 
            onClick={() => addToCart.mutate()}
            disabled={addToCart.isPending || !variants?.length}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}