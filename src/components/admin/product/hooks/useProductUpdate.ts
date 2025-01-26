import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useProductUpdate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, variants }: { formData: Product, variants: ProductVariant[] }) => {
      console.log('Starting product update with data:', formData);
      console.log('Secondary categories before update:', formData.secondary_categories);
      
      // Ensure secondary_categories is an array
      const secondary_categories = Array.isArray(formData.secondary_categories) 
        ? formData.secondary_categories 
        : [];

      const productData = {
        name: formData.name,
        description: formData.description,
        main_category: formData.main_category,
        secondary_categories, // Ensure we're passing the array directly
        image_url: formData.image_url,
        sku: formData.sku,
        discount: formData.discount,
      };

      console.log('Sending update with product data:', productData);

      const { data: updatedProduct, error: productError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", formData.id)
        .select();

      if (productError) {
        console.error('Error updating product:', productError);
        throw productError;
      }

      console.log('Product updated successfully:', updatedProduct);

      // Delete existing variants
      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", formData.id);

      if (deleteError) {
        console.error('Error deleting variants:', deleteError);
        throw deleteError;
      }

      // Insert new variants with properly formatted parameters
      const variantsData = variants.map(variant => ({
        product_id: formData.id,
        parameters: Object.fromEntries(
          Object.entries(variant.parameters)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        ),
        stock: variant.stock,
        price: variant.price
      }));

      console.log('Inserting variants with data:', variantsData);

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData);

      if (variantsError) {
        console.error('Error saving variants:', variantsError);
        throw variantsError;
      }

      if (formData.product_images && formData.product_images.length > 0) {
        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", formData.id);

        if (deleteImagesError) {
          console.error('Error deleting images:', deleteImagesError);
          throw deleteImagesError;
        }

        const imagesData = formData.product_images.map((image, index) => ({
          product_id: formData.id,
          image_url: image.image_url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesData);

        if (imagesError) {
          console.error('Error saving images:', imagesError);
          throw imagesError;
        }
      }

      return updatedProduct;
    },
    onSuccess: (_, { formData }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["product-details", formData.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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