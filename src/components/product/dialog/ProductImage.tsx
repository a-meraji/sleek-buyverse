interface ProductImageProps {
  image: string;
  name: string;
}

export function ProductImage({ image, name }: ProductImageProps) {
  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover"
      />
    </div>
  );
}