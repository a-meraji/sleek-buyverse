import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Product } from "@/types";

export const useProducts = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      console.log("useProducts: Fetching products", {
        isAuthenticated: !!user,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants (*),
          product_images (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("useProducts: Error fetching products:", error);
        throw error;
      }

      console.log("useProducts: Fetch successful", {
        productsCount: data?.length || 0,
        timestamp: new Date().toISOString(),
      });

      return (data || []) as Product[];
    },
    enabled: !isAuthLoading,
  });
};