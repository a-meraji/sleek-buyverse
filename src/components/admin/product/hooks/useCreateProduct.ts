import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useCreateProduct = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      formData: Partial<Product>;
      variants: ProductVariant[];
      additionalImages: { image_url: string }[];
    }) => {
      const { formData, variants, additionalImages } = data;

      // Insert the product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([formData])
        .select()
        .single();

      if (productError) throw productError;

      // Insert variants if any
      if (variants.length > 0) {
        const variantsWithProductId = variants.map((variant) => ({
          ...variant,
          product_id: product.id,
        }));

        const { error: variantsError } = await supabase
          .from("product_variants")
          .insert(variantsWithProductId);

        if (variantsError) throw variantsError;
      }

      // Insert additional images if any
      if (additionalImages.length > 0) {
        const imagesWithProductId = additionalImages.map((image, index) => ({
          ...image,
          product_id: product.id,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesWithProductId);

        if (imagesError) throw imagesError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });
};