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
      console.log('Updating variants:', variants);
      
      // Update product
      const { data: updatedProduct, error: productError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          sku: formData.sku,
          discount: formData.discount,
        })
        .eq("id", formData.id)
        .select()
        .single();

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
        console.error('Error deleting existing variants:', deleteError);
        throw deleteError;
      }

      console.log('Existing variants deleted successfully');

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

      console.log('Inserting new variants with data:', variantsData);

      const { data: newVariants, error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsData)
        .select();

      if (variantsError) {
        console.error('Error inserting new variants:', variantsError);
        throw variantsError;
      }

      console.log('New variants inserted successfully:', newVariants);

      // Handle product images
      if (formData.product_images && formData.product_images.length > 0) {
        console.log('Updating product images');
        
        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", formData.id);

        if (deleteImagesError) {
          console.error('Error deleting existing images:', deleteImagesError);
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
          console.error('Error inserting new images:', imagesError);
          throw imagesError;
        }

        console.log('Product images updated successfully');
      }

      return updatedProduct;
    },
    onSuccess: (_, { formData }) => {
      console.log('Product update completed successfully');
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
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
}