import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductSize } from "@/types";
import { ImageSelector } from "./ImageSelector";
import { ProductDetailsFields } from "./product/ProductDetailsFields";
import { PriceStockFields } from "./product/PriceStockFields";
import { CategorySelector } from "./product/CategorySelector";
import { ImagePreview } from "./product/ImagePreview";
import { SizeSelector } from "./product/SizeSelector";
import { Button } from "@/components/ui/button";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async () => {
      if (!formData) return;
      
      console.log('Updating product with data:', formData);
      
      const { data, error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          image_url: formData.image_url,
          sku: formData.sku,
          sizes: formData.sizes,
        })
        .eq("id", formData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    setFormData(prev => prev ? { ...prev, image_url: url } : null);
    setShowImageSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct.mutate();
  };

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null);
  };

  if (!product || !formData) return null;

  return (
    <>
      <Dialog open={!!product} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <ProductDetailsFields
              name={formData.name}
              description={formData.description ?? ""}
              sku={formData.sku ?? ""}
              onNameChange={(value) => handleFormChange({ name: value })}
              onDescriptionChange={(value) => handleFormChange({ description: value })}
              onSkuChange={(value) => handleFormChange({ sku: value })}
            />

            <PriceStockFields
              price={formData.price}
              stock={formData.stock ?? 0}
              onPriceChange={(value) => handleFormChange({ price: value })}
              onStockChange={(value) => handleFormChange({ stock: value })}
            />

            <CategorySelector
              value={formData.category ?? ""}
              onChange={(value) => handleFormChange({ category: value })}
            />

            <SizeSelector
              selectedSizes={formData.sizes as ProductSize[] ?? []}
              onChange={(sizes) => handleFormChange({ sizes })}
            />

            <ImagePreview
              imageUrl={formData.image_url}
              productName={formData.name}
              onChooseImage={() => setShowImageSelector(true)}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProduct.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}