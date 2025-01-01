import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelectionPanel } from "./dialog/VariantSelectionPanel";
import { DialogActions } from "./dialog/DialogActions";
import { ProductVariant } from "@/types";
import { useState } from "react";
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
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  variants = []
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { toast } = useToast();

  const handleAddToFavorites = async () => {
    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .upsert({ 
          user_id: userId,
          product_id: productId
        });

      if (error) throw error;

      toast({
        title: "Added to favorites",
        description: "Product has been added to your favorites"
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add product to favorites",
        variant: "destructive"
      });
    }
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
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 py-4 px-1">
            <ProductImage image={productImage} name={productName} />
            <ProductInfo name={productName} variants={variants} />
            
            <VariantSelectionPanel
              variants={variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            <div className="flex gap-2">
              <DialogActions
                productId={productId}
                userId={userId}
                selectedSize={selectedSize}
                productName={productName}
                disabled={!selectedSize || !selectedColor}
                variants={variants}
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