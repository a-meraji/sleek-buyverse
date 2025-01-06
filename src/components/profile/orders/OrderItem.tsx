import { Badge } from "@/components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { OrderItemDetails } from "./OrderItemDetails";
import { ShippingAddress } from "./ShippingAddress";

interface OrderItemProps {
  order: any;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'shipped':
        return 'success';
      case 'processing':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <AccordionItem value={order.id} className="border rounded-lg p-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="font-medium text-left">Order #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-500 text-left">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">${order.total_amount}</p>
            <Badge variant={getBadgeVariant(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="mt-4 space-y-4">
          {order.order_items?.map((item: any) => (
            <OrderItemDetails 
              key={item.id} 
              item={item} 
              showRateButton={order.status === 'shipped'}
            />
          ))}
          {order.shipping_address && (
            <ShippingAddress address={order.shipping_address} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};