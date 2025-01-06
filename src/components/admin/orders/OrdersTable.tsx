import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { OrderStatus } from "./OrderStatusSelect";
import { OrderTableHeader } from "./table/OrderTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";

interface OrdersTableProps {
  orders: Array<{
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
        size: string;
        color: string;
      };
      quantity: number;
      price_at_time: number;
    }>;
    user?: {
      first_name: string;
      last_name: string;
    } | null;
  }>;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <OrderTableHeader />
      <TableBody>
        {orders?.map((order) => (
          <OrderTableRow key={order.id} order={order} />
        ))}
      </TableBody>
    </Table>
  );
}