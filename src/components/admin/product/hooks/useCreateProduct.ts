import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CreateProductParams {
  formData: Partial<Product>;
  variants: ProductVariant[];
  additionalImages: { image_url: string }[];
}

export function useCreateProduct(onClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, variants, additionalImages }: CreateProductParams) => {
      const generateSKU = (name: string): string => {
        const timestamp = Date.now().toString().slice(-4);
        const namePrefix = name.slice(0, 3).toUpperCase();
        return `${namePrefix}-${timestamp}`;
      };

      const productData = {
        name: formData.name,
        description: formData.description || "",
        category: formData.category || "",
        image_url: formData.image_url,
        sku: formData.sku?.trim() || generateSKU(formData.name || ""),
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

      if (variantsError) throw variantsError;

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
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });
}