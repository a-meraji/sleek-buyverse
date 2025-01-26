import React from 'react';
import { CartItemProps } from '@/types';
import { CartItemHeader } from './item/CartItemHeader';
import { CartItemPrice } from './item/CartItemPrice';
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded"
            min="1"
            disabled={readonly}
          />
        </div>
        
        <CartItemPrice
          price={item.variant?.price || 0}
          variantPrice={item.variant?.price || 0}
          quantity={item.quantity}
          discount={item.product?.discount || 0}
        />
      </div>
    </div>
  );
}