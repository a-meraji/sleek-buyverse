# Authentication Guide

## Row Level Security (RLS)

### Products
```sql
-- Everyone can view products
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products" 
ON products FOR ALL USING (is_admin(auth.uid()));
```

### Orders
```sql
-- Users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

-- Only admins can manage all orders
CREATE POLICY "Admins can manage orders" 
ON orders FOR ALL USING (is_admin(auth.uid()));
```

For complete authentication documentation, see [AUTH_FULL.md](AUTH_FULL.md)