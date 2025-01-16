import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrderStatus } from "./OrderStatusSelect";
import { cloneElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsDialogProps {
  order: {
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    shipping_address?: any;
    order_items?: Array<{
      id: string;
      product: {
        name: string;
        image_url: string;
      };
      variant?: {
        id: string;
        parameters: Record<string, string | number>;
        price: number;
      };
      quantity: number;
      price_at_time: number;
    }>;
    user?: {
      first_name: string;
      last_name: string;
    } | null;
  };
  children: JSX.Element;
}

export function OrderDetailsDialog({ order, children }: OrderDetailsDialogProps) {
  const formatVariantParameters = (parameters: Record<string, string | number>) => {
    return Object.entries(parameters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {cloneElement(children, {
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            if (children.props.onClick) {
              children.props.onClick(e);
            }
          },
        })}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <p className="text-sm text-muted-foreground">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Customer</h3>
                <p className="text-sm text-muted-foreground">
                  {order.user?.first_name 
                    ? `${order.user.first_name} ${order.user.last_name || ''}`
                    : 'Unknown User'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <Badge variant="outline" className="mt-1">
                  {order.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium">Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Total Amount</h3>
                <p className="text-sm text-muted-foreground">
                  ${order.total_amount}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Order Items</h3>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.name}</h4>
                      {item.variant && item.variant.parameters && (
                        <p className="text-sm text-muted-foreground">
                          {formatVariantParameters(item.variant.parameters)}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        ${item.price_at_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.shipping_address && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.shipping_address.street_address}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}