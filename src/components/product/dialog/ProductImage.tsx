interface ProductImageProps {
  image: string;
  name: string;
  discount?: number;
}

export function ProductImage({ image, name, discount }: ProductImageProps) {
  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover"
      />
      {discount && discount > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
          {discount}% OFF
        </div>
      )}
    </div>
  );
}