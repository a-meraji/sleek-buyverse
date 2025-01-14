import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  console.log('Calculating order totals for items:', items);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      // Find the correct variant from product_variants
      const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
      const variantPrice = selectedVariant?.price;
      
      if (!variantPrice) {
        console.error('Missing variant price for item:', {
          itemId: item.id,
          productName: item.product?.name,
          variantId: item.variant_id,
          selectedVariant
        });
        return total;
      }
      
      const quantity = item.quantity;
      const discount = item.product?.discount ?? 0;
      const finalPrice = discount > 0 ? variantPrice * (1 - discount / 100) : variantPrice;
      
      console.log('Item calculation:', {
        itemId: item.id,
        productName: item.product?.name,
        variantId: item.variant_id,
        selectedVariant,
        variantPrice,
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