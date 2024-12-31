import { useState } from "react";
import { ProductFormData } from "@/types/product";
import { ProductVariant } from "@/types/variant";

export function useProductForm(initialData?: Partial<ProductFormData>) {
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: "",
    description: "",
    category: "",
    image_url: "",
    sku: "",
    ...initialData
  });
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);

  const handleFormChange = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    variants,
    setVariants,
    handleFormChange
  };
}