# E-commerce Project Supabase Setup Guide

## Database Schema

### Tables

1. **admin_users**
   ```sql
   - id (uuid, PK, references auth.users)
   - role (enum: user, admin, super_admin)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

2. **products**
   ```sql
   - id (uuid, PK)
   - name (text)
   - description (text, nullable)
   - price (numeric)
   - image_url (text)
   - category (text, nullable)
   - sku (text, nullable)
   - created_at (timestamp)
   ```

3. **product_variants**
   ```sql
   - id (uuid, PK)
   - product_id (uuid, FK -> products.id)
   - size (text)
   - color (text)
   - stock (integer)
   - created_at (timestamp)
   ```

4. **orders**
   ```sql
   - id (uuid, PK)
   - user_id (uuid, FK -> auth.users.id)
   - status (text, default: 'pending')
   - total_amount (numeric)
   - shipping_address (jsonb)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

5. **order_items**
   ```sql
   - id (uuid, PK)
   - order_id (uuid, FK -> orders.id)
   - product_id (uuid, FK -> products.id)
   - quantity (integer)
   - price_at_time (numeric)
   - created_at (timestamp)
   ```

6. **cart_items**
   ```sql
   - id (uuid, PK)
   - user_id (uuid, FK -> auth.users.id)
   - product_id (uuid, FK -> products.id)
   - quantity (integer)
   - created_at (timestamp)
   ```

7. **profiles**
   ```sql
   - id (uuid, PK, references auth.users)
   - first_name (text, nullable)
   - last_name (text, nullable)
   - created_at (timestamp)
   ```

8. **chat_sessions**
   ```sql
   - id (uuid, PK)
   - user_id (uuid, FK -> auth.users.id)
   - admin_id (uuid, FK -> auth.users.id)
   - status (text)
   - created_at (timestamp)
   - updated_at (timestamp)
   - last_message_at (timestamp)
   ```

9. **chat_messages**
   ```sql
   - id (uuid, PK)
   - session_id (uuid, FK -> chat_sessions.id)
   - sender_id (uuid, FK -> auth.users.id)
   - content (text)
   - is_read (boolean)
   - created_at (timestamp)
   ```

## Row Level Security (RLS) Policies

### Products Table
```sql
-- Everyone can view products
CREATE POLICY "Products are viewable by everyone" ON products
FOR SELECT USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products" ON products
FOR ALL USING (is_admin(auth.uid()));
```

### Cart Items Table
```sql
-- Users can view their own cart items
CREATE POLICY "Users can view their own cart items" ON cart_items
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items" ON cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items" ON cart_items
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items" ON cart_items
FOR DELETE USING (auth.uid() = user_id);
```

### Orders Table
```sql
-- Only admins can manage orders
CREATE POLICY "Admins can manage orders" ON orders
FOR ALL USING (is_admin(auth.uid()));
```

### Chat Related Tables
```sql
-- Users can view their own chat sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id OR is_admin(auth.uid()));

-- Users can create chat sessions
CREATE POLICY "Users can create chat sessions" ON chat_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their chat sessions
CREATE POLICY "Users and admins can update chat sessions" ON chat_sessions
FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = admin_id);
```

## Database Functions

1. **is_admin Function**
```sql
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role IN ('admin', 'super_admin')
  );
END;
$$;
```

2. **Handle New User Function**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Storage Setup

1. Create a public bucket named 'images' for product images
```sql
-- Enable storage
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);
```

## Step-by-Step Setup Guide

1. **Create New Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Fill in project details
   - Save the project URL and anon key

2. **Database Setup**
   - Go to SQL Editor in Supabase Dashboard
   - Create tables using the schema provided above
   - Create RLS policies
   - Create database functions
   - Create triggers

3. **Storage Setup**
   - Create 'images' bucket
   - Set bucket to public
   - Configure CORS if needed

4. **Authentication Setup**
   - Enable Email auth provider
   - Configure email templates if needed
   - Set up any additional auth providers if required

5. **Environment Setup**
   - Update the Supabase client configuration in `src/integrations/supabase/client.ts`
   ```typescript
   const SUPABASE_URL = "your-project-url"
   const SUPABASE_ANON_KEY = "your-anon-key"
   ```

6. **Testing**
   - Create a test admin user
   - Insert test products
   - Verify RLS policies
   - Test all CRUD operations

## API Structure

The project uses Supabase's client library for all database operations. Here are the main API endpoints:

### Products
```typescript
// Get all products
const { data: products } = await supabase
  .from('products')
  .select('*')

// Get single product
const { data: product } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('id', productId)
  .single()
```

### Cart
```typescript
// Get user's cart
const { data: cartItems } = await supabase
  .from('cart_items')
  .select('*, product:products(*)')
  .eq('user_id', userId)

// Add to cart
const { data: newItem } = await supabase
  .from('cart_items')
  .insert({ user_id: userId, product_id: productId, quantity: 1 })
```

### Orders
```typescript
// Create order
const { data: order } = await supabase
  .from('orders')
  .insert({ user_id: userId, total_amount, shipping_address })

// Get user's orders
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, product:products(*))')
  .eq('user_id', userId)
```

### Chat
```typescript
// Get chat sessions
const { data: sessions } = await supabase
  .from('chat_sessions')
  .select('*, messages:chat_messages(*)')
  .eq('user_id', userId)

// Send message
const { data: message } = await supabase
  .from('chat_messages')
  .insert({ session_id, sender_id: userId, content })
```

## Common Issues & Solutions

1. **RLS Policy Issues**
   - Ensure tables have RLS enabled
   - Verify policy expressions
   - Test with both authenticated and anonymous users

2. **Foreign Key Constraints**
   - Check referential integrity
   - Ensure referenced records exist
   - Handle cascade deletes appropriately

3. **Authentication Issues**
   - Verify JWT token configuration
   - Check auth provider settings
   - Ensure proper role assignments

4. **Performance Optimization**
   - Create appropriate indexes
   - Use efficient joins
   - Implement proper caching strategies

## Security Considerations

1. **Data Access**
   - All tables must have RLS policies
   - Use security definer functions carefully
   - Implement proper role-based access

2. **API Security**
   - Use proper error handling
   - Validate all user inputs
   - Implement rate limiting

3. **File Storage**
   - Restrict file types
   - Implement size limits
   - Use secure URLs when needed