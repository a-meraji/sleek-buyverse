import { useReducer } from 'react';
import { cartReducer } from '../cartReducer';
import { CartState } from '../types';

export const useCartState = () => {
  return useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });
};