import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[] | null | undefined;
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={Number(product.price)}
          image={product.image_url}
          variants={product.product_variants}
        />
      ))}
    </div>
  );
};