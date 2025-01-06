import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReviewDialog } from "./ReviewDialog";

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

const OrderItem = ({ order }: { order: any }) => {
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
            <OrderItemDetails key={item.id} item={item} />
          ))}
          {order.shipping_address && (
            <ShippingAddress address={order.shipping_address} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const OrderItemDetails = ({ item }: { item: any }) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  if (!item.product) {
    console.log('Missing product data for order item:', item);
    return (
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded" />
          <div>
            <p className="font-medium text-gray-500">Product not available</p>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          </div>
        </div>
        <p className="font-medium">${item.price_at_time}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.product.name}</p>
          {item.variant && (
            <p className="text-sm text-gray-500">
              Size: {item.variant.size}, Color: {item.variant.color}
            </p>
          )}
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setIsReviewDialogOpen(true)}
          >
            Write a Review
          </Button>
        </div>
      </div>
      <div>
        <p className="font-medium">${item.price_at_time}</p>
        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          productId={item.product.id}
          defaultValues={{
            reviewer_first_name: "",  // These will be populated from the profile data
            reviewer_last_name: "",
          }}
        />
      </div>
    </div>
  );
};

const ShippingAddress = ({ address }: { address: any }) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Shipping Address</h4>
      <p className="text-sm text-gray-500">
        {address.street}<br />
        {address.city}, {address.state} {address.zipCode}
      </p>
    </div>
  );
};