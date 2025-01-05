import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ImageSelector } from "./ImageSelector";
import { EditProductContent } from "./product/EditProductContent";
import { useProductUpdate } from "./product/useProductUpdate";
import { useProductDelete } from "./products/useProductDelete";
import { useToast } from "@/hooks/use-toast";

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [variants, setVariants] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const updateProduct = useProductUpdate();
  const deleteProduct = useProductDelete();
  const { toast } = useToast();

  // Fetch variants and images for this product
  const { data: productData } = useQuery({
    queryKey: ["product-details", product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      
      console.log('Fetching product details:', product.id);
      const [variantsResponse, imagesResponse] = await Promise.all([
        supabase.from("product_variants").select("*").eq("product_id", product.id),
        supabase.from("product_images").select("*").eq("product_id", product.id)
      ]);

      if (variantsResponse.error) {
        console.error('Error fetching variants:', variantsResponse.error);
        throw variantsResponse.error;
      }
      if (imagesResponse.error) {
        console.error('Error fetching images:', imagesResponse.error);
        throw imagesResponse.error;
      }

      console.log('Fetched product details:', {
        variants: variantsResponse.data,
        images: imagesResponse.data
      });

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

  const handleClose = () => {
    setIsOpen(false);
    setShowImageSelector(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    
    try {
      await deleteProduct.mutateAsync(product.id);
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      handleClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    console.log('Submitting form with data:', { formData, variants });
    updateProduct.mutate({ formData, variants }, {
      onSuccess: () => handleClose(),
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

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Edit Product</DialogTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Product
            </Button>
          </DialogHeader>
          
          {formData && (
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
              onClose={handleClose}
              isSubmitting={updateProduct.isPending}
            />
          )}
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