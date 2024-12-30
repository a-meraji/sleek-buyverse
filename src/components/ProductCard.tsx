import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductOverviewDialog } from "./product/ProductOverviewDialog";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('ProductCard auth state changed:', event, session);
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</p>
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
        productPrice={price}
        userId={userId}
      />
    </div>
  );
}