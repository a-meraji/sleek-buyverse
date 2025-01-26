import React from 'react';
import { CartItemProps } from '@/types';
import { formatParameters } from '@/lib/utils';
import { CartItemHeader } from './item/CartItemHeader';
import { CartItemImage } from './item/CartItemImage';
import { CartItemPrice } from './item/CartItemPrice';
import { CartItemQuantity } from './item/CartItemQuantity';

export function CartItem({ item, onQuantityChange, onRemove, readonly = false }: CartItemProps) {
  const parameters = item.variant?.parameters 
    ? formatParameters(item.variant.parameters)
    : null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onQuantityChange(item.id, newQuantity);
  };

  const variantPrice = item.variant?.price ?? 0;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <CartItemImage 
        imageUrl={item.product?.image_url ?? ''} 
        productName={item.product?.name ?? ''} 
        discount={item.product?.discount}
      />
      
      <div className="flex-1 space-y-2">
        <CartItemHeader 
          productName={item.product?.name ?? ''} 
          parameters={parameters}
          onRemove={() => onRemove(item.id)}
          readonly={readonly}
        />
        
        <div className="flex items-center justify-between mt-4">
          <CartItemQuantity 
            quantity={item.quantity} 
            onQuantityChange={handleQuantityChange}
          />
          
          <CartItemPrice 
            variantPrice={variantPrice}
            quantity={item.quantity}
            discount={item.product?.discount}
          />
        </div>
      </div>
    </div>
  );
}