import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Truck, Calendar } from "lucide-react";
import { OrderStatus } from "./OrderStatusSelect";

interface OrderDetailsDialogProps {
  order: {
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    shipping_address: any;
    order_items?: Array<{
      id: string;
      product: {
        name: string;
        image_url: string;
      };
      variant?: {
        size: string;
        color: string;
      };
      quantity: number;
      price_at_time: number;
    }>;
    user?: {
      first_name: string;
      last_name: string;
      phone?: string;
    } | null;
  };
}

export function OrderDetailsDialog({ order }: OrderDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1">
              <p>
                {order.user
                  ? `${order.user.first_name} ${order.user.last_name}`
                  : "Unknown Customer"}
              </p>
              {order.user?.phone && <p className="text-sm">📞 {order.user.phone}</p>}
            </div>
          </div>

          {/* Shipping Information */}
          {order.shipping_address && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items
            </h3>
            <div className="divide-y">
              {order.order_items?.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        Size: {item.variant.size}, Color: {item.variant.color}
                      </p>
                    )}
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.price_at_time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(order.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="capitalize">{order.status}</span>
              </div>
              <p className="font-semibold">
                Total: ${order.total_amount}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}