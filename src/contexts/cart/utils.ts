import { CartItem } from './types';

export const mergeCartItems = (localItems: CartItem[], serverItems: CartItem[]): CartItem[] => {
  const mergedItems: CartItem[] = [...serverItems];
  
  localItems.forEach(localItem => {
    const existingItem = mergedItems.find(item => 
      item.product_id === localItem.product_id
    );
    
    if (existingItem) {
      existingItem.quantity += localItem.quantity;
    } else {
      mergedItems.push(localItem);
    }
  });
  
  return mergedItems;
};