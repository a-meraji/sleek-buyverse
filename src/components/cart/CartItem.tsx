import React from 'react';
import { CartItemProps } from '@/types';
import { formatParameters } from '@/lib/utils';

export function CartItem({ item, onQuantityChange, onRemove, readonly = false }: CartItemProps) {
  const parameters = item.variant?.parameters 
    ? formatParameters(item.variant.parameters)
    : null;

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="flex-1">
        <h4 className="font-semibold">{item.product?.name}</h4>
        {parameters && <p className="text-sm text-gray-500">{parameters}</p>}
      </div>
      <div className="flex items-center">
        <span className="text-lg font-bold">${item.variant?.price.toFixed(2)}</span>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
          className="w-16 mx-2 border rounded"
          min="1"
          disabled={readonly}
        />
        <button onClick={() => onRemove(item.id)} className="text-red-500" disabled={readonly}>
          Remove
        </button>
      </div>
    </div>
  );
}
