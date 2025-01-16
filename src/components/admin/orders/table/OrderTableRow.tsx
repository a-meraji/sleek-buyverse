import { TableCell, TableRow } from "@/components/ui/table";
import { OrderStatus, OrderStatusSelect } from "../OrderStatusSelect";
import { OrderDetailsDialog } from "../OrderDetailsDialog";
import { Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/types/variant";

interface OrderTableRowProps {
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
      variant?: ProductVariant;
      quantity: number;
      price_at_time: number;
    }>;
    user?: {
      first_name: string;
      last_name: string;
    } | null;
  };
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const formatVariantParameters = (parameters: Record<string, string | number>) => {
    return Object.entries(parameters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <TableRow>
      <TableCell>{order.id.slice(0, 8)}</TableCell>
      <TableCell>
        {order.user?.first_name 
          ? `${order.user.first_name} ${order.user.last_name || ''}`
          : 'Unknown User'}
      </TableCell>
      <TableCell>
        <OrderStatusSelect
          orderId={order.id}
          currentStatus={order.status}
        />
      </TableCell>
      <TableCell>${order.total_amount}</TableCell>
      <TableCell>
        {new Date(order.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {order.order_items && order.order_items.length > 0 ? (
          <div className="space-y-2">
            {order.order_items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-2 p-1 rounded-md bg-muted/50"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{item.product.name}</p>
                  {item.variant && item.variant.parameters && (
                    <p className="text-xs text-muted-foreground">
                      {formatVariantParameters(item.variant.parameters)}
                    </p>
                  )}
                  <p className="text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No items</span>
        )}
      </TableCell>
      <TableCell>
        <OrderDetailsDialog order={order}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </OrderDetailsDialog>
      </TableCell>
    </TableRow>
  );
}