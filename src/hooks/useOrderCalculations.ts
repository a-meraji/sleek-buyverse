import { useMemo } from "react";
import { useCart } from "@/contexts/cart/CartContext";

const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_RATE = 5.99; // Flat shipping rate

const calculateItemTotal = (item: any) => {
  const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
  if (!selectedVariant || !item.product) {
    console.warn('Missing variant or product data for item:', item);
    return { itemSubtotal: 0, quantity: item.quantity };
  }

  const variantPrice = selectedVariant.price;
  const quantity = item.quantity;
  const discount = item.product.discount;
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const itemSubtotal = discountedPrice * quantity;

  console.log('Individual item calculation:', {
    productName: item.product.name,
    variantPrice,
    quantity,
    discount,
    discountedPrice,
    itemSubtotal
  });

  return { itemSubtotal, quantity };
};

export const useOrderCalculations = () => {
  const { state: { items } } = useCart();

  return useMemo(() => {
    console.log('Recalculating order totals with items:', items);

    // Calculate item totals first
    const itemTotals = items.map(calculateItemTotal);
    
    // Calculate base subtotal from item totals
    const subtotal = itemTotals.reduce((sum, { itemSubtotal }) => sum + itemSubtotal, 0);
    
    // Calculate tax based on subtotal
    const tax = subtotal * TAX_RATE;
    
    // Calculate shipping based on items existence
    const shipping = items.length > 0 ? SHIPPING_RATE : 0;
    
    // Calculate total after all other calculations are done
    const total = subtotal + tax + shipping;
    
    // Calculate total quantity
    const totalQuantity = itemTotals.reduce((sum, { quantity }) => sum + quantity, 0);

    console.log('Final order calculations:', {
      subtotal,
      tax,
      shipping,
      total,
      totalQuantity
    });

    return {
      subtotal,
      tax,
      shipping,
      total,
      totalQuantity
    };
  }, [items]); // Only recalculate when items change
};