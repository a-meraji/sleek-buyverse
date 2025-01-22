import { useState } from "react";
import { Product, ProductImage } from "@/types";
import { ProductVariant } from "@/types/variant";

export function useProductForm() {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    image_url: "",
    sku: "",
    discount: 0,
  });
  const [additionalImages, setAdditionalImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageSelect = (url: string) => {
    if (isSelectingMainImage) {
      handleFormChange({ image_url: url });
    } else {
      setAdditionalImages(prev => [...prev, {
        id: crypto.randomUUID(),
        product_id: '',
        image_url: url,
        display_order: prev.length
      }]);
    }
    setShowImageSelector(false);
  };

  const handleRemoveImage = (url: string) => {
    if (url === formData.image_url) {
      handleFormChange({ image_url: "" });
    } else {
      setAdditionalImages(prev => prev.filter(img => img.image_url !== url));
    }
  };

  return {
    formData,
    additionalImages,
    variants,
    showImageSelector,
    isSelectingMainImage,
    handleFormChange,
    handleImageSelect,
    handleRemoveImage,
    setVariants,
    setShowImageSelector,
    setIsSelectingMainImage,
  };
}