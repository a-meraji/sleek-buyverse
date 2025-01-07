import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductOverviewDialog } from "./product/ProductOverviewDialog";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useProductDialog } from "./product/hooks/useProductDialog";
import { PriceDisplay } from "./product/card/PriceDisplay";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  product_variants?: Product['product_variants'];
  discount?: number | null;
}

export function ProductCard({ id, name, image, product_variants, discount }: ProductCardProps) {
  const { userId, isDialogOpen, setIsDialogOpen, productData } = useProductDialog(id);

  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-lg transition-shadow">
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {hasValidDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              {discount}% OFF
            </Badge>
          )}
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">{name}</h3>
          <PriceDisplay variants={product_variants} discount={discount} />
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

      {productData && (
        <ProductOverviewDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={productData}
          userId={userId}
        />
      )}
    </div>
  );
}