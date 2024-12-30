import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types/product";
import { ImageSelector } from "./ImageSelector";
import { ProductDetailsFields } from "./product/ProductDetailsFields";
import { PriceStockFields } from "./product/PriceStockFields";
import { CategorySelector } from "./product/CategorySelector";
import { ImagePreview } from "./product/ImagePreview";
import { VariantsManager } from "./product/VariantsManager";
import { Button } from "@/components/ui/button";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch variants for this product
  const { data: productVariants } = useQuery({
    queryKey: ["product-variants", product?.id],
    queryFn: async () => {
      if (!product?.id) return [];
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id);

      if (error) throw error;
      return data;
    },
    enabled: !!product?.id,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    if (productVariants) {
      setVariants(productVariants);
    }
  }, [product, productVariants]);

  const updateProduct = useMutation({
    mutationFn: async () => {
      if (!formData) return;
      
      console.log('Updating product with data:', formData);
      console.log('Updating variants:', variants);
      
      // First update the product
      const { error: productError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image_url: formData.image_url,
          sku: formData.sku,
        })
        .eq("id", formData.id);

      if (productError) throw productError;

      // Then handle variants
      // First, delete all existing variants
      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", formData.id);

      if (deleteError) throw deleteError;

      // Then insert all current variants
      const variantsData = variants.map(variant => ({
        product_id: formData.id,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData);

      if (variantsError) throw variantsError;
    },
    onSuccess: () => {
      // Invalidate both the products list and the specific product variants query
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product-variants", product?.id] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct.mutate();
  };

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    handleFormChange({ image_url: url });
    setShowImageSelector(false);
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
              onPriceChange={(value) => handleFormChange({ price: value })}
            />

            <CategorySelector
              value={formData.category ?? ""}
              onChange={(value) => handleFormChange({ category: value })}
            />

            <VariantsManager
              variants={variants}
              onChange={setVariants}
              productId={formData.id}
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