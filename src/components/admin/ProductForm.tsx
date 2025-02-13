import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ImageSelector } from "@/components/admin/ImageSelector";
import { ProductDetailsFields } from "@/components/admin/product/ProductDetailsFields";
import { CategorySelector } from "@/components/admin/product/CategorySelector";
import { ImagePreview } from "@/components/admin/product/ImagePreview";
import { VariantsManager } from "@/components/admin/product/VariantsManager";

interface ProductFormProps {
  onClose: () => void;
}

export function ProductForm({ onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    main_category: "",
    secondary_categories: [],
    image_url: "",
    sku: "",
    brand: "",
    discount: 0,
  });
  const [additionalImages, setAdditionalImages] = useState<{ image_url: string }[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isSelectingMainImage, setIsSelectingMainImage] = useState(true);
  const [multipleSelect, setMultipleSelect] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        main_category: formData.main_category || "",
        secondary_categories: formData.secondary_categories || [],
        image_url: formData.image_url,
        sku: formData.sku?.trim() || generateSKU(formData.name),
        brand: formData.brand || "",
        discount: formData.discount || 0,
      };

      console.log('Creating product with data:', productData);
      
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        if (productError.code === '23505' && productError.message.includes('products_sku_key')) {
          throw new Error("A product with this SKU already exists. Please use a different SKU.");
        }
        throw productError;
      }

      console.log('Product created:', product);

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
        parameters: Object.fromEntries(
          Object.entries(variant.parameters)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        ),
        stock: variant.stock,
        price: variant.price
      }));

      console.log('Saving variants with data:', variantsData);

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData);

      if (variantsError) {
        console.error('Error saving variants:', variantsError);
        throw variantsError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-variants"] });
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

  const handleFormChange = (updates: Partial<Product>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageSelect = (url: string | string[]) => {
    console.log('Selected image URL:', url);
    if (isSelectingMainImage) {
      if (typeof url === 'string') {
        handleFormChange({ image_url: url });
      }
    } else {
      const newImages = Array.isArray(url) ? url : [url];
      const additionalImagesData = newImages.map(imageUrl => ({
        image_url: imageUrl
      }));
      setAdditionalImages(prev => [...prev, ...additionalImagesData]);
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
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <ProductDetailsFields
          name={formData.name ?? ""}
          description={formData.description ?? ""}
          sku={formData.sku ?? ""}
          brand={formData.brand ?? ""}
          discount={formData.discount}
          onNameChange={(value) => handleFormChange({ name: value })}
          onDescriptionChange={(value) => handleFormChange({ description: value })}
          onSkuChange={(value) => handleFormChange({ sku: value })}
          onBrandChange={(value) => handleFormChange({ brand: value })}
          onDiscountChange={(value) => handleFormChange({ discount: value })}
        />

        <CategorySelector
          mainCategory={formData.main_category ?? ""}
          secondaryCategories={formData.secondary_categories ?? []}
          onMainCategoryChange={(value) => handleFormChange({ main_category: value })}
          onSecondaryCategoriesChange={(categories) => 
            handleFormChange({ secondary_categories: categories })
          }
        />

        <VariantsManager
          variants={variants}
          onChange={setVariants}
        />

        <ImagePreview
          imageUrl={formData.image_url}
          productName={formData.name}
          additionalImages={additionalImages.map((img, index) => ({
            id: `new-${index}`,
            image_url: img.image_url,
            product_id: '',
            display_order: index
          }))}
          onChooseImage={() => {
            setIsSelectingMainImage(true);
            setShowImageSelector(true);
          }}
          onAddAdditionalImage={() => {
            setIsSelectingMainImage(false);
            setShowImageSelector(true);
          }}
          onRemoveImage={handleRemoveImage}
          multipleSelect={multipleSelect}
          onMultipleSelectChange={setMultipleSelect}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createProduct.isPending}>
            Create Product
          </Button>
        </div>
      </form>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
        multiple={!isSelectingMainImage && multipleSelect}
      />
    </>
  );
}