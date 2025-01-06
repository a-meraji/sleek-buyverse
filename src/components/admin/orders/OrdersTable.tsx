import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus, OrderStatusSelect } from "./OrderStatusSelect";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

interface OrdersTableProps {
  orders: Array<{
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    user?: {
      first_name: string;
      last_name: string;
    } | null;
  }>;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
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
              <OrderDetailsDialog order={order} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}