import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  // Calculate all values in a single pass to ensure consistency
  const calculations = items.reduce((acc, item) => {
    const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
    const variantPrice = selectedVariant?.price ?? 0;
    const quantity = item.quantity;
    const discount = item.product?.discount;
    const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
    const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
    const itemTotal = discountedPrice * quantity;

    console.log('Item calculation:', {
      productName: item.product?.name,
      variantPrice,
      quantity,
      discount,
      discountedPrice,
      itemTotal,
      runningSubtotal: acc.subtotal + itemTotal
    });

    return {
      subtotal: acc.subtotal + itemTotal,
      itemCount: acc.itemCount + quantity
    };
  }, {
    subtotal: 0,
    itemCount: 0
  });

  const subtotal = calculations.subtotal;
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