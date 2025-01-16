import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { OrderStatus } from "./OrderStatusSelect";
import { OrderTableHeader } from "./table/OrderTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";
import { ProductVariant } from "@/types/variant";

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
      variant?: ProductVariant;
      quantity: number;
      price_at_time: number;
    }>;
    user?: {
      first_name: string;
      last_name: string;
    } | null;
  }>;
  sortDirection: "asc" | "desc";
  onSortChange: (direction: "asc" | "desc") => void;
}

export function OrdersTable({ orders, sortDirection, onSortChange }: OrdersTableProps) {
  return (
    <Table>
      <OrderTableHeader sortDirection={sortDirection} onSortChange={onSortChange} />
      <TableBody>
        {orders?.map((order) => (
          <OrderTableRow key={order.id} order={order} />
        ))}
      </TableBody>
    </Table>
  );
}