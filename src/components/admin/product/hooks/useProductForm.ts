import { useState } from "react";
import { Product, ProductVariant } from "@/types";
import { useCreateProduct } from "./useCreateProduct";

interface UseProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export function useProductForm({ onClose, initialData }: UseProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: "",
    description: "",
    category: "",
    image_url: "",
    sku: "",
    discount: 0,
  });
  
  const [additionalImages, setAdditionalImages] = useState<{ image_url: string }[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);

  const createProduct = useCreateProduct(onClose);

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    if (isSelectingMainImage) {
      handleFormChange({ image_url: url });
    } else {
      setAdditionalImages(prev => [...prev, { image_url: url }]);
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
    createProduct,
  };
}