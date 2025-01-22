import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { useToast } from "@/hooks/use-toast";

interface CreateProductData {
  formData: Partial<Product>;
  variants: ProductVariant[];
  additionalImages: { image_url: string }[];
}

export const useCreateProduct = (onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, variants, additionalImages }: CreateProductData) => {
      console.log('Creating product with data:', { formData, variants, additionalImages });
      
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([formData])
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        throw productError;
      }

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
        ...variant,
        product_id: product.id
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
      onSuccess();
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