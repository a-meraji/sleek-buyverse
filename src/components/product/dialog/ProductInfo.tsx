interface ProductInfoProps {
  name: string;
  price: number;
}

export function ProductInfo({ name, price }: ProductInfoProps) {
  return (
    <>
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-sm text-gray-500">${price.toFixed(2)}</p>
    </>
  );
}