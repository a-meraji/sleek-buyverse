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
      
      console.log('Processing item:', {
        itemId: item.id,
        productName: item.product?.name,
        variantId: item.variant_id,
        selectedVariant,
        quantity: item.quantity,
        discount: item.product?.discount
      });

      if (!selectedVariant?.price) {
        console.warn('Missing or invalid variant price:', {
          itemId: item.id,
          productName: item.product?.name,
          variantId: item.variant_id,
          selectedVariant
        });
        return total;
      }

      const quantity = item.quantity;
      const discount = item.product?.discount ?? 0;
      const finalPrice = discount > 0 ? selectedVariant.price * (1 - discount / 100) : selectedVariant.price;
      const itemTotal = finalPrice * quantity;
      
      console.log('Item calculation result:', {
        itemId: item.id,
        variantPrice: selectedVariant.price,
        quantity,
        discount,
        finalPrice,
        itemTotal,
        runningTotal: total + itemTotal
      });
      
      return total + itemTotal;
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