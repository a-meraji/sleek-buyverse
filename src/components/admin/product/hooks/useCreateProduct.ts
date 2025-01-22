import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductVariant } from "@/types/product";

export function useCreateProduct(onClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateSKU = (name: string): string => {
    const timestamp = Date.now().toString().slice(-4);
    const namePrefix = name.slice(0, 3).toUpperCase();
    return `${namePrefix}-${timestamp}`;
  };

  const validateForm = (formData: Partial<Product>, variants: ProductVariant[]): boolean => {
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.image_url || formData.image_url.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Product image is required",
        variant: "destructive",
      });
      return false;
    }
    if (variants.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one variant is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return useMutation({
    mutationFn: async (data: { formData: Partial<Product>, variants: ProductVariant[] }) => {
      if (!validateForm(data.formData, data.variants)) {
        throw new Error("Validation failed");
      }

      const productData = {
        name: data.formData.name,
        description: data.formData.description || "",
        category: data.formData.category || "",
        image_url: data.formData.image_url,
        sku: data.formData.sku?.trim() || generateSKU(data.formData.name!),
        discount: data.formData.discount || 0,
      };

      console.log('Creating product with data:', productData);
      
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        if (productError.code === '23505' && productError.message.includes('products_sku_key')) {
          throw new Error("A product with this SKU already exists. Please use a different SKU.");
        }
        throw productError;
      }

      console.log('Product created:', product);

      // Ensure parameters are properly formatted before saving
      const variantsData = data.variants.map(variant => ({
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

      if (variantsError) {
        console.error('Error saving variants:', variantsError);
        throw variantsError;
      }

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
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });
}