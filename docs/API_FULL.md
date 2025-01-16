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

// Filter products by category
const { data: filteredProducts } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('category', category)

// Get products with discount
const { data: discountedProducts } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .not('discount', 'is', null)
  .gt('discount', 0)
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
  .select()
  .single()

// Get user orders with items
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      product:products(*),
      variant:product_variants(*)
    )
  `)
  .eq('user_id', userId)

// Update order status
const { data: updatedOrder } = await supabase
  .from('orders')
  .update({ status })
  .eq('id', orderId)
  .select()
  .single()
```

## Cart

```typescript
// Add item to cart
const { data: cartItem } = await supabase
  .from('cart_items')
  .insert({
    user_id: userId,
    product_id: productId,
    variant_id: variantId,
    quantity
  })
  .select()
  .single()

// Get user cart items
const { data: cartItems } = await supabase
  .from('cart_items')
  .select(`
    *,
    product:products(*),
    variant:product_variants(*)
  `)
  .eq('user_id', userId)

// Update cart item quantity
const { data: updatedItem } = await supabase
  .from('cart_items')
  .update({ quantity })
  .eq('id', cartItemId)
  .select()
  .single()

// Remove item from cart
const { error } = await supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItemId)
```

## Reviews

```typescript
// Create review
const { data: review } = await supabase
  .from('reviews')
  .insert({
    product_id: productId,
    reviewer_id: userId,
    reviewer_first_name,
    reviewer_last_name,
    title,
    review_text,
    rating
  })
  .select()
  .single()

// Get product reviews
const { data: reviews } = await supabase
  .from('reviews')
  .select('*')
  .eq('product_id', productId)
  .eq('status', 'approved')

// Update review status (admin only)
const { data: updatedReview } = await supabase
  .from('reviews')
  .update({ status })
  .eq('id', reviewId)
  .select()
  .single()
```

## Chat

```typescript
// Create chat session
const { data: session } = await supabase
  .from('chat_sessions')
  .insert({
    user_id: userId
  })
  .select()
  .single()

// Send message
const { data: message } = await supabase
  .from('chat_messages')
  .insert({
    session_id: sessionId,
    sender_id: userId,
    content
  })
  .select()
  .single()

// Get session messages
const { data: messages } = await supabase
  .from('chat_messages')
  .select('*')
  .eq('session_id', sessionId)
  .order('created_at', { ascending: true })

// Mark messages as read
const { data: updatedMessages } = await supabase
  .from('chat_messages')
  .update({ is_read: true })
  .eq('session_id', sessionId)
  .neq('sender_id', userId)
  .select()
```

## User Profile

```typescript
// Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()

// Update profile
const { data: updatedProfile } = await supabase
  .from('profiles')
  .update({
    first_name,
    last_name,
    phone,
    street_address,
    city,
    state,
    postal_code
  })
  .eq('id', userId)
  .select()
  .single()
```

## Favorites

```typescript
// Add to favorites
const { data: favorite } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    product_id: productId
  })
  .select()
  .single()

// Get user favorites
const { data: favorites } = await supabase
  .from('favorites')
  .select('*, product:products(*)')
  .eq('user_id', userId)

// Remove from favorites
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('user_id', userId)
  .eq('product_id', productId)
```

## Analytics

```typescript
// Record site visit
const { data: visit } = await supabase
  .from('site_visits')
  .insert({
    visitor_id: visitorId
  })
  .select()
  .single()

// Get visit statistics (admin only)
const { data: visits } = await supabase
  .from('site_visits')
  .select('*')
  .gte('visited_at', startDate)
  .lte('visited_at', endDate)
```