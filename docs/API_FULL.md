# Complete API Reference

## Authentication

```typescript
// Sign up
const { data: { user }, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name,
      last_name
    }
  }
});

// Sign in
const { data: { session }, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## Products

```typescript
// Get all products with variants
const { data: products } = await supabase
  .from('products')
  .select('*, product_variants(*)')

// Get single product with variants
const { data: product } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('id', productId)
  .single()

// Get popular products
const { data: popularProducts } = await supabase
  .rpc('get_popular_products')
  .limit(50)

// Search products
const { data: searchResults } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .ilike('name', `%${searchQuery}%`)
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

// Add products to campaign
const { data: campaignProducts } = await supabase
  .from('campaign_products')
  .insert(
    selectedProducts.map(productId => ({
      campaign_id: campaignId,
      product_id: productId
    }))
  )
  .select()
```

For additional API documentation and examples, see individual feature documentation files.
