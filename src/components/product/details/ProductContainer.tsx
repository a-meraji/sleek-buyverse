import { Product } from "@/types";
import { ProductImage } from "@/types/product";

interface ProductContainerProps {
  product: Product;
}

export function ProductContainer({ product }: ProductContainerProps) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.main_category}</span>
      <div>
        {product.product_images?.map((image: ProductImage) => (
          <img key={image.id} src={image.image_url} alt={product.name} />
        ))}
      </div>
      <div>
        {product.product_variants?.map((variant) => (
          <div key={variant.id}>
            <p>Variant: {JSON.stringify(variant.parameters)}</p>
            <p>Price: ${variant.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
