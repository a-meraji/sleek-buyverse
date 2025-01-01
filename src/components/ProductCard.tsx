import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductOverviewDialog } from "./product/ProductOverviewDialog";
import { Product } from "@/types";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  product_variants?: Product['product_variants'];
  discount?: number | null;
}

export function ProductCard({ id, name, image, product_variants, discount }: ProductCardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate the minimum price from variants
  const minPrice = product_variants?.length 
    ? Math.min(...product_variants.map(v => v.price))
    : 0;

  // Calculate discounted price if discount exists
  const discountedPrice = discount && minPrice
    ? minPrice * (1 - discount / 100)
    : null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('ProductCard auth state changed:', event, session);
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('ProductCard rendering:', {
    id,
    name,
    variants: product_variants,
    minPrice,
    discount,
    discountedPrice
  });

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-lg transition-shadow">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {product_variants?.length ? (
              discount ? (
                <span className="space-x-2">
                  <span className="line-through">${minPrice.toFixed(2)}</span>
                  <span className="text-red-500">${discountedPrice?.toFixed(2)}</span>
                  <span className="text-red-500">({discount}% off)</span>
                </span>
              ) : (
                <>From ${minPrice.toFixed(2)}</>
              )
            ) : (
              "Price not available"
            )}
          </p>
        </div>
      </Link>
      <div className="mt-4">
        <Button 
          className="w-full" 
          onClick={() => setIsDialogOpen(true)}
        >
          Add to Cart
        </Button>
      </div>

      <ProductOverviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        productId={id}
        productName={name}
        productImage={image}
        userId={userId}
        variants={product_variants}
        discount={discount}
      />
    </div>
  );
}