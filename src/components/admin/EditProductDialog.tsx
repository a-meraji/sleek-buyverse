import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ImageSelector } from "./ImageSelector";
import { EditProductContent } from "./product/EditProductContent";
import { useProductUpdate } from "./product/useProductUpdate";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [variants, setVariants] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const updateProduct = useProductUpdate();

  // Fetch variants for this product
  const { data: productVariants } = useQuery({
    queryKey: ["product-variants", product?.id],
    queryFn: async () => {
      if (!product?.id) return [];
      console.log('Fetching variants for product:', product.id);
      
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id);

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }
      
      console.log('Fetched variants:', data);
      return data || [];
    },
    enabled: !!product?.id,
  });

  useEffect(() => {
    if (product) {
      // Ensure all required fields are present
      const normalizedProduct = {
        ...product,
        description: product.description || "",
        category: product.category || "",
        sku: product.sku || "",
      };
      console.log('Setting form data:', normalizedProduct);
      setFormData(normalizedProduct);
    }
    if (productVariants) {
      console.log('Setting variants:', productVariants);
      setVariants(productVariants);
    }
  }, [product, productVariants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    console.log('Submitting form with data:', formData);
    console.log('Submitting variants:', variants);
    updateProduct.mutate({ formData, variants }, {
      onSuccess: () => onClose(),
    });
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
          
          <EditProductContent
            formData={formData}
            variants={variants}
            onFormChange={handleFormChange}
            onVariantsChange={setVariants}
            onImageSelect={() => setShowImageSelector(true)}
            onSubmit={handleSubmit}
            onClose={onClose}
            isSubmitting={updateProduct.isPending}
          />
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