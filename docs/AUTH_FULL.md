# Complete Authentication Guide

## Row Level Security (RLS) Policies

### Products Table
```sql
-- Everyone can view products
CREATE POLICY "Anyone can view products"
ON products FOR SELECT
USING (true);

-- Only admins can manage products
CREATE POLICY "Only admins can modify products"
ON products FOR ALL
USING (is_admin(auth.uid()));
```

### Orders Table
```sql
-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all orders
CREATE POLICY "Admins can manage orders"
ON orders FOR ALL
USING (is_admin(auth.uid()));
```

### Cart Items Table
```sql
-- Users can manage their own cart
CREATE POLICY "Users can view their own cart items"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON cart_items FOR DELETE
USING (auth.uid() = user_id);
```

### Reviews Table
```sql
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON reviews FOR SELECT
USING (status = 'approved');

-- Users can view their own reviews regardless of status
CREATE POLICY "Users can view their own reviews"
ON reviews FOR SELECT
USING (reviewer_id = auth.uid() OR status = 'approved');

-- Authenticated users can create reviews
CREATE POLICY "Users can insert reviews with their id"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
ON reviews FOR ALL
USING (is_admin(auth.uid()));
```

### Chat Tables
```sql
-- Chat Sessions
CREATE POLICY "Users can create their own chat sessions"
ON chat_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can update their chat sessions"
ON chat_sessions FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = admin_id);

CREATE POLICY "Admins can view all chat sessions"
ON chat_sessions FOR SELECT
USING (is_admin(auth.uid()) OR auth.uid() = user_id OR auth.uid() = admin_id);

-- Chat Messages
CREATE POLICY "Users and admins can insert messages to their sessions"
ON chat_messages FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM chat_sessions
  WHERE id = session_id
  AND (user_id = auth.uid() OR admin_id = auth.uid())
));

CREATE POLICY "Admins can view all chat messages"
ON chat_messages FOR SELECT
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE id = session_id
    AND (user_id = auth.uid() OR admin_id = auth.uid())
  )
);

CREATE POLICY "Admins can update chat messages"
ON chat_messages FOR UPDATE
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE id = session_id
    AND (admin_id = auth.uid() OR user_id = auth.uid())
  )
);
```

### User Profiles
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (is_admin(auth.uid()));
```

### Admin Users
```sql
-- Anyone can view admin users
CREATE POLICY "Anyone can view admin users"
ON admin_users FOR SELECT
USING (true);

-- Only super admins can update admin users
CREATE POLICY "admin_users_update"
ON admin_users FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM admin_users au
  WHERE au.id = auth.uid()
  AND au.role = 'super_admin'
));
```

## Authentication Flow

1. **Sign Up**
```typescript
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
```

2. **Sign In**
```typescript
const { data: { session }, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

3. **Sign Out**
```typescript
const { error } = await supabase.auth.signOut();
```

4. **Password Reset**
```typescript
// Request reset
const { data, error } = await supabase.auth.resetPasswordForEmail(email);

// Update password
const { data, error } = await supabase.auth.updateUser({
  password: newPassword
});
```

5. **Session Management**
```typescript
// Get current session
const { data: { session }, error } = await supabase.auth.getSession();

// Subscribe to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
});
```

## Admin Functions

1. **Check Admin Status**
```typescript
const isAdmin = await supabase.rpc('is_admin', {
  user_id: userId
});
```

2. **Admin Role Types**
```sql
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
```

## Security Best Practices

1. **Always use RLS policies** to restrict access to data
2. **Never trust client-side role checks** - always enforce through RLS
3. **Use secure password policies**
4. **Implement rate limiting** for authentication attempts
5. **Regular security audits** of RLS policies
6. **Monitor auth logs** for suspicious activity
7. **Keep auth tokens secure** and implement proper token rotation
8. **Use SSL/TLS** for all API communications
9. **Implement proper session management**
10. **Regular backups** of auth-related data