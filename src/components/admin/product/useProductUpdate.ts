import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useProductUpdate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, variants }: { formData: Product, variants: ProductVariant[] }) => {
      console.log('Updating product with data:', formData);
      console.log('Updating variants:', variants);
      
      // First update the product
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

      if (productError) {
        console.error('Error updating product:', productError);
        throw productError;
      }

      // Delete cart items referencing the variants we're about to update
      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", formData.id);

      if (cartError) {
        console.error('Error deleting cart items:', cartError);
        throw cartError;
      }

      // Handle variants
      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", formData.id);

      if (deleteError) {
        console.error('Error deleting variants:', deleteError);
        throw deleteError;
      }

      const variantsData = variants.map(variant => ({
        product_id: formData.id,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData);

      if (variantsError) {
        console.error('Error creating variants:', variantsError);
        throw variantsError;
      }

      // Handle additional images
      if (formData.product_images && formData.product_images.length > 0) {
        // First delete existing images
        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", formData.id);

        if (deleteImagesError) {
          console.error('Error deleting images:', deleteImagesError);
          throw deleteImagesError;
        }

        // Then insert new images
        const imagesData = formData.product_images.map((image, index) => ({
          product_id: formData.id,
          image_url: image.image_url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesData);

        if (imagesError) {
          console.error('Error creating images:', imagesError);
          throw imagesError;
        }
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