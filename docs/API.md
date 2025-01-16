# API Reference

## Products

```typescript
// Get all products
const { data: products } = await supabase
  .from('products')
  .select('*, product_variants(*)')

// Get single product
const { data: product } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('id', productId)
  .single()
```

## Orders

```typescript
// Create order
const { data: order } = await supabase
  .from('orders')
  .insert({ 
    user_id: userId, 
    total_amount, 
    shipping_address 
  })

// Get user orders
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, product:products(*))')
  .eq('user_id', userId)
```

For complete API documentation, see [API_FULL.md](API_FULL.md)