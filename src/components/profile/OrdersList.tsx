import { Accordion } from "@/components/ui/accordion";
import { OrderItem } from "./orders/OrderItem";

interface OrdersListProps {
  orders: any[];
  isLoading: boolean;
}

export const OrdersList = ({ orders, isLoading }: OrdersListProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </Accordion>
  );
};