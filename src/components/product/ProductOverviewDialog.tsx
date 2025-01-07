import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelectionPanel } from "./dialog/VariantSelectionPanel";
import { DialogActions } from "./dialog/DialogActions";
import { ProductVariant } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  userId: string | null;
  variants?: ProductVariant[];
  discount?: number | null;
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  variants = [],
  discount
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Find the selected variant based on size and color
  const selectedVariant = variants.find(v => 
    v.size === selectedSize && v.color === selectedColor
  );

  useEffect(() => {
    if (userId) {
      const checkFavorite = async () => {
        const { data } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', userId)
          .eq('product_id', productId)
          .single();
        
        setIsFavorite(!!data);
      };
      
      checkFavorite();
    }
  }, [userId, productId]);

  const handleAddToFavorites = async () => {
    try {
      if (!userId) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to favorites",
          variant: "destructive"
        });
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) throw error;
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Product has been removed from your favorites"
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .upsert({ 
            user_id: userId,
            product_id: productId
          });

        if (error) throw error;
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Product has been added to your favorites"
        });
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const handleCartSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Product Overview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddToFavorites}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 py-4 px-1">
            <ProductImage image={productImage} name={productName} />
            <ProductInfo 
              name={productName} 
              variants={variants} 
              discount={discount}
              selectedVariant={selectedVariant}
            />
            
            <VariantSelectionPanel
              variants={variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            <div className="flex gap-2 items-center">
              <DialogActions
                productId={productId}
                userId={userId}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                productName={productName}
                disabled={!selectedSize || !selectedColor}
                variants={variants}
                onSuccess={handleCartSuccess}
              />
              <Link 
                to={`/product/${productId}`}
                className="flex-1"
              >
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}