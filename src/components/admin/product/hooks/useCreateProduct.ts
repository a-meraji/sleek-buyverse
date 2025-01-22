import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

export const useCreateProduct = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      formData: Partial<Product>;
      variants: any[];
      additionalImages: any[];
    }) => {
      const { formData, variants, additionalImages } = data;
      
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([formData])
        .select()
        .single();

      if (productError) throw productError;

      if (additionalImages.length > 0) {
        const imagesData = additionalImages.map((img, index) => ({
          product_id: product.id,
          image_url: img.image_url,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesData);

        if (imagesError) throw imagesError;
      }

      if (variants.length > 0) {
        const variantsData = variants.map(variant => ({
          product_id: product.id,
          ...variant,
        }));

        const { error: variantsError } = await supabase
          .from("product_variants")
          .insert(variantsData);

        if (variantsError) throw variantsError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });
};