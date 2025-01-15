import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReviewFilters } from "./reviews/ReviewFilters";
import { ReviewsTable } from "./reviews/ReviewsTable";

export function AdminReviews() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: products = [], isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      console.log("Fetching products for review filters");
      const { data, error } = await supabase
        .from("products")
        .select("id, name");
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Fetched products:", data);
      return data || [];
    }
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["admin-reviews", selectedProduct, selectedStatus],
    queryFn: async () => {
      console.log("Fetching reviews with filters:", { selectedProduct, selectedStatus });
      let query = supabase
        .from("reviews")
        .select(`
          *,
          product:products (
            name
          )
        `);

      if (selectedProduct) {
        query = query.eq("product_id", selectedProduct);
      }
      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      console.log("Fetched reviews:", data);
      return data || [];
    }
  });

  if (isLoadingProducts) {
    return <div className="flex items-center justify-center p-8">Loading products...</div>;
  }

  if (productsError) {
    return <div className="flex items-center justify-center p-8 text-red-500">Error loading products</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      
      <ReviewFilters
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {isLoadingReviews ? (
        <div className="flex items-center justify-center p-8">Loading reviews...</div>
      ) : (
        <ReviewsTable reviews={reviews} />
      )}
    </div>
  );
}