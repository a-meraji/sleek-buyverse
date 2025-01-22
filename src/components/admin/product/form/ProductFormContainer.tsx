import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage } from "@/types";
import { ProductVariant } from "@/types/variant";
import { ProductForm } from "./ProductForm";
import { useProductForm } from "./useProductForm";

interface ProductFormContainerProps {
  onClose: () => void;
  initialData?: Product;
}

export function ProductFormContainer({ onClose, initialData }: ProductFormContainerProps) {
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<ProductImage[]>(
    initialData?.product_images || []
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formData, variants, setVariants, handleFormChange } = useProductForm();

  const generateSKU = (name: string): string => {
    const timestamp = Date.now().toString().slice(-4);
    const namePrefix = name.slice(0, 3).toUpperCase();
    return `${namePrefix}-${timestamp}`;
  };

  const validateForm = (): boolean => {
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.image_url || formData.image_url.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Product image is required",
        variant: "destructive",
      });
      return false;
    }
    if (variants.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one variant is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!validateForm()) {
        throw new Error("Validation failed");
      }

      const productData = {
        name: formData.name,
        description: formData.description || "",
        category: formData.category || "",
        image_url: formData.image_url,
        sku: formData.sku?.trim() || generateSKU(formData.name),
      };

      console.log('Creating product with data:', productData);
      
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) {
        if (productError.code === '23505' && productError.message.includes('products_sku_key')) {
          throw new Error("A product with this SKU already exists. Please use a different SKU.");
        }
        throw productError;
      }

      // Insert additional images
      if (additionalImages.length > 0) {
        const imagesData = additionalImages.map((img, index) => ({
          product_id: product.id,
          image_url: img.image_url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesData);

        if (imagesError) throw imagesError;
      }

      const variantsData = variants.map(variant => ({
        product_id: product.id,
        parameters: {
          size: variant.parameters.size,
          color: variant.parameters.color
        },
        stock: variant.stock,
        price: variant.price
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData);

      if (variantsError) throw variantsError;

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate();
  };

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    if (isSelectingMainImage) {
      handleFormChange({ image_url: url });
    } else {
      const newImage: ProductImage = {
        id: `temp-${Date.now()}`,
        product_id: initialData?.id || '',
        image_url: url,
        display_order: additionalImages.length
      };
      setAdditionalImages(prev => [...prev, newImage]);
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

  return (
    <ProductForm
      onClose={onClose}
    />
  );
}