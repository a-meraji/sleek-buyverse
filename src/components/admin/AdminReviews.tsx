import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReviewsTable } from "./reviews/ReviewsTable";
import { ReviewFilters } from "./reviews/ReviewFilters";
import { useState } from "react";
import { Product, Review } from "@/types";

export function AdminReviews() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["admin-reviews", selectedProduct, selectedStatus],
    queryFn: async () => {
      console.log("Fetching reviews with filters:", { selectedProduct, selectedStatus });
      let query = supabase
        .from("reviews")
        .select(`
          *,
          product:products(name)
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
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products-for-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name");

      if (error) throw error;
      return data as Pick<Product, "id" | "name">[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
      </div>

      <ReviewFilters
        products={products || []}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {isLoadingReviews ? (
        <div>Loading reviews...</div>
      ) : (
        <ReviewsTable reviews={reviews || []} />
      )}
    </div>
  );
}