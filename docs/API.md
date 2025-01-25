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
  .select('*, order_items(*, products(*))')
  .eq('user_id', userId)
```

## Marketing Campaigns

```typescript
// Get active campaigns
const { data: campaigns } = await supabase
  .from('marketing_campaigns')
  .select(`
    *,
    campaign_products(
      products(
        id,
        name,
        image_url,
        discount,
        product_variants(*)
      )
    )
  `)
  .eq('status', 'active')
  .or(`is_timeless.eq.true,and(is_timeless.eq.false,end_date.gte.${now})`)

// Create campaign
const { data: campaign } = await supabase
  .from('marketing_campaigns')
  .insert({
    title,
    description,
    image_url,
    start_date,
    end_date,
    is_timeless
  })
  .select()
  .single()
```

For complete API documentation, see [API_FULL.md](API_FULL.md)