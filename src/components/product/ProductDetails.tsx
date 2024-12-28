import { Product } from "@/types";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";

interface ProductDetailsProps {
  product: Product;
  userId: string | null;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export const ProductDetails = ({ product, userId, selectedSize, onSizeSelect }: ProductDetailsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl">${product.price.toFixed(2)}</p>
      <p className="text-gray-600">{product.description}</p>
      
      <SizeSelector 
        selectedSize={selectedSize} 
        onSizeSelect={onSizeSelect}
      />
      
      <AddToCartButton
        productId={product.id}
        userId={userId}
        selectedSize={selectedSize}
        productName={product.name}
      />
    </div>
  );
};