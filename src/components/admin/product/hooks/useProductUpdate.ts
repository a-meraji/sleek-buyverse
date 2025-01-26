import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useProductUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      formData, 
      variants 
    }: { 
      formData: Product; 
      variants: ProductVariant[] 
    }) => {
      const productData = {
        name: formData.name,
        description: formData.description,
        main_category: formData.main_category,
        secondary_categories: formData.secondary_categories,
        image_url: formData.image_url,
        sku: formData.sku,
        discount: formData.discount
      };

      const { error: productError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", formData.id);

      if (productError) throw productError;

      if (formData.product_images) {
        const { error: imagesError } = await supabase
          .from("product_images")
          .upsert(
            formData.product_images.map(img => ({
              ...img,
              product_id: formData.id
            }))
          );

        if (imagesError) throw imagesError;
      }

      const { error: variantsError } = await supabase
        .from("product_variants")
        .upsert(
          variants.map(variant => ({
            ...variant,
            product_id: formData.id
          }))
        );

      if (variantsError) throw variantsError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
}