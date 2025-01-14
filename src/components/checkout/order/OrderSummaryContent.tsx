import { CartItem } from "@/types";
import { OrderHeader } from "./OrderHeader";
import { OrderItemsList } from "./OrderItemsList";
import { OrderTotals } from "./OrderTotals";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OrderSummaryContentProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const OrderSummaryContent = ({ 
  items, 
  subtotal, 
  tax, 
  shipping, 
  total 
}: OrderSummaryContentProps) => {
  const { toast } = useToast();

  console.log('OrderSummaryContent rendering with:', {
    itemsCount: items.length,
    items,
    subtotal,
    total
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <OrderHeader />
      
      <div className="bg-secondary/50 rounded-lg p-6 space-y-6">
        <OrderItemsList items={items} />
        
        <OrderTotals
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
        />

        <Button 
          className="w-full" 
          size="lg"
          onClick={() => {
            console.log('Proceeding to checkout with total:', total);
            toast({
              title: "Processing Order",
              description: "Redirecting to payment...",
            });
          }}
        >
          Proceed to Payment (${total.toFixed(2)})
        </Button>
      </div>
    </div>
  );
};