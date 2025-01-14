import { useOrderCalculations } from "@/hooks/useOrderCalculations";

export function OrderSummary() {
  const { subtotal, tax, shipping, total } = useOrderCalculations();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="bg-secondary p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
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
    </div>
  );
}