import React from 'react';
import { CartItemProps } from '@/types';
import { CartItemHeader } from './item/CartItemHeader';
import { CartItemPrice } from './item/CartItemPrice';
import { CartItemImage } from './item/CartItemImage';
import { CartItemQuantity } from './item/CartItemQuantity';
import { formatParameters } from '@/lib/utils';

export function CartItem({ item, onQuantityChange, onRemove, readonly = false }: CartItemProps) {
  const parameters = item.variant?.parameters 
    ? formatParameters(item.variant.parameters)
    : null;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm">
      <CartItemHeader
        name={item.product?.name || ''}
        productName={item.product?.name || ''}
        parameters={parameters || ''}
        onRemove={() => onRemove(item.id)}
        readonly={readonly}
      />
      
      <div className="flex items-start gap-4">
        <CartItemImage
          imageUrl={item.product?.image_url || ''}
          productName={item.product?.name || ''}
          discount={item.product?.discount}
        />
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CartItemQuantity
              quantity={item.quantity}
              onQuantityChange={(delta) => {
                const newQuantity = Math.max(1, item.quantity + delta);
                onQuantityChange(item.id, newQuantity);
              }}
            />
            
            <CartItemPrice
              price={item.variant?.price || 0}
              variantPrice={item.variant?.price || 0}
              quantity={item.quantity}
              discount={item.product?.discount || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}