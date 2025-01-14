import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
      const price = variant?.price ?? 0;
      const quantity = item.quantity;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_RATE : 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};