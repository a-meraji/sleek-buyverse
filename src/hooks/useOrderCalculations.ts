import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  console.log('Calculating order totals for items:', items);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      // Get the variant price directly from the variant if it exists
      const price = item.variant?.price ?? item.product?.price ?? 0;
      const quantity = item.quantity;
      
      // Apply discount if it exists
      const discount = item.product?.discount ?? 0;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
      
      console.log('Item calculation:', {
        itemId: item.id,
        price,
        quantity,
        discount,
        finalPrice,
        subtotal: finalPrice * quantity
      });
      
      return total + (finalPrice * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_RATE : 0;
  const total = subtotal + tax + shipping;

  console.log('Final calculations:', { subtotal, tax, shipping, total });

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};