import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ImageSelector } from "./ImageSelector";
import { EditProductContent } from "./product/EditProductContent";
import { useProductUpdate } from "./product/useProductUpdate";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
  open: boolean;
}

export function EditProductDialog({ product, onClose, open }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [variants, setVariants] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const updateProduct = useProductUpdate();

  // Fetch variants and images for this product
  const { data: productData } = useQuery({
    queryKey: ["product-details", product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      
      const [variantsResponse, imagesResponse] = await Promise.all([
        supabase.from("product_variants").select("*").eq("product_id", product.id),
        supabase.from("product_images").select("*").eq("product_id", product.id)
      ]);

      if (variantsResponse.error) throw variantsResponse.error;
      if (imagesResponse.error) throw imagesResponse.error;

      return {
        variants: variantsResponse.data,
        images: imagesResponse.data
      };
    },
    enabled: !!product?.id,
  });

  useEffect(() => {
    if (product && productData) {
      setFormData({
        ...product,
        product_images: productData.images
      });
      setVariants(productData.variants);
    }
  }, [product, productData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    console.log('Submitting form with data:', { formData, variants });
    updateProduct.mutate({ formData, variants }, {
      onSuccess: () => onClose(),
    });
  };

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    if (isSelectingMainImage) {
      handleFormChange({ image_url: url });
    } else {
      // Add new image to product_images array
      const newImage = {
        id: crypto.randomUUID(),
        product_id: formData?.id || '',
        image_url: url,
        display_order: formData?.product_images?.length || 0
      };
      handleFormChange({ 
        product_images: [...(formData?.product_images || []), newImage]
      });
    }
    setShowImageSelector(false);
  };

  const handleRemoveImage = (url: string) => {
    if (url === formData?.image_url) {
      handleFormChange({ image_url: "" });
    } else {
      handleFormChange({
        product_images: formData?.product_images?.filter(img => img.image_url !== url) || []
      });
    }
  };

  if (!product || !formData) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <EditProductContent
            formData={formData}
            variants={variants}
            onFormChange={handleFormChange}
            onVariantsChange={setVariants}
            onImageSelect={() => {
              setIsSelectingMainImage(true);
              setShowImageSelector(true);
            }}
            onAddAdditionalImage={() => {
              setIsSelectingMainImage(false);
              setShowImageSelector(true);
            }}
            onRemoveImage={handleRemoveImage}
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