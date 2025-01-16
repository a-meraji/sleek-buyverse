import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useProductUpdate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, variants }: { formData: Product, variants: ProductVariant[] }) => {
      console.log('Updating product with data:', formData);
      console.log('Updating variants:', variants);
      
      const { error: productError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          sku: formData.sku,
          discount: formData.discount,
        })
        .eq("id", formData.id);

      if (productError) throw productError;

      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", formData.id);

      if (cartError) throw cartError;

      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", formData.id);

      if (deleteError) throw deleteError;

      const variantsData = variants.map(variant => ({
        product_id: formData.id,
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

      if (formData.product_images && formData.product_images.length > 0) {
        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", formData.id);

        if (deleteImagesError) throw deleteImagesError;

        const imagesData = formData.product_images.map((image, index) => ({
          product_id: formData.id,
          image_url: image.image_url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesData);

        if (imagesError) throw imagesError;
      }
    },
    onSuccess: (_, { formData }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["product-details", formData.id] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
}