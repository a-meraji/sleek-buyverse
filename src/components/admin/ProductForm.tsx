import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ImageSelector } from "./ImageSelector";
import { ProductDetailsFields } from "./product/ProductDetailsFields";
import { PriceStockFields } from "./product/PriceStockFields";
import { CategorySelector } from "./product/CategorySelector";
import { ImagePreview } from "./product/ImagePreview";

interface ProductFormProps {
  onClose: () => void;
}

export function ProductForm({ onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image_url: "",
    sku: "",
  });
  const [showImageSelector, setShowImageSelector] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async () => {
      console.log('Creating product with data:', formData);
      const { data, error } = await supabase
        .from("products")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
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

  const handleImageSelect = (url: string) => {
    console.log('Selected image URL:', url);
    handleFormChange({ image_url: url });
    setShowImageSelector(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <ProductDetailsFields
          name={formData.name ?? ""}
          description={formData.description ?? ""}
          sku={formData.sku ?? ""}
          onNameChange={(value) => handleFormChange({ name: value })}
          onDescriptionChange={(value) => handleFormChange({ description: value })}
          onSkuChange={(value) => handleFormChange({ sku: value })}
        />

        <PriceStockFields
          price={formData.price ?? 0}
          stock={formData.stock ?? 0}
          onPriceChange={(value) => handleFormChange({ price: value })}
          onStockChange={(value) => handleFormChange({ stock: value })}
        />

        <CategorySelector
          value={formData.category ?? ""}
          onChange={(value) => handleFormChange({ category: value })}
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
          <Button type="submit" disabled={createProduct.isPending}>
            Create Product
          </Button>
        </div>
      </form>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}