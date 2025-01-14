import { CartItem } from "@/types";
import { OrderItem } from "./OrderItem";

interface OrderItemsListProps {
  items: CartItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  console.log('Rendering OrderItemsList with items:', items);
  
  return (
    <div className="space-y-4 mb-6">
      {items.map((item) => (
        <OrderItem key={item.id} item={item} />
      ))}
    </div>
  );
};