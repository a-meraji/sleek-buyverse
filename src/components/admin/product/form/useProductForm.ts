import { useState } from "react";
import { Product } from "@/types";
import { ProductVariant } from "@/types";

export function useProductForm() {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    image_url: "",
    sku: "",
    discount: null,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    variants,
    setVariants,
    handleFormChange
  };
}