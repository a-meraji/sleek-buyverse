import { useReducer } from 'react';
import { cartReducer } from '../cartReducer';
import { CartState } from '../types';

export const useCartState = () => {
  const initialState: CartState = {
    items: [],
    isLoading: false,
  };
  
  return useReducer(cartReducer, initialState);
};