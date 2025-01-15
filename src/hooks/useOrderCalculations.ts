import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  const calculateTotal = () => {
    const total = items.reduce((total, item) => {
      const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
      const variantPrice = selectedVariant?.price ?? 0;
      const quantity = item.quantity;
      const discount = item.product?.discount;
      const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
      const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
      const itemTotal = discountedPrice * quantity;

      return total + itemTotal;
    }, 0);

    return total;
  };

  const subtotal = calculateTotal();
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_RATE : 0;
  const total = subtotal + tax + shipping;

  console.log('Order calculations:', { subtotal, tax, shipping, total });

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};