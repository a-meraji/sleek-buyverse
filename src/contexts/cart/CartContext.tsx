import React, { createContext, useContext } from 'react';
import { CartContextType } from './types';
import { useCartState } from './hooks/useCartState';
import { useCartOperations } from './hooks/useCartOperations';
import { useCartSync } from './hooks/useCartSync';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useCartState();
  const operations = useCartOperations();

  useCartSync(state.items, dispatch);

  const value: CartContextType = {
    state,
    ...operations,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};