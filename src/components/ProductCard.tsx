import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  return (
    <Link 
      to={`/product/${id}`}
      className="group animate-fadeIn"
    >
      <div className="overflow-hidden bg-secondary rounded-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-medium text-primary">{name}</h3>
        <p className="text-sm text-primary/80">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
};