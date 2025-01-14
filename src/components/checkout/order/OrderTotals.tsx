interface OrderTotalsProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const OrderTotals = ({ subtotal, tax, shipping, total }: OrderTotalsProps) => {
  return (
    <div className="bg-secondary p-4 rounded-lg space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax (8%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold pt-2 border-t">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};