# Supabase Project Setup Guide

## Initial Setup

1. Create a new Supabase project
2. Note down your project URL and anon key
3. Enable the required auth providers in Authentication > Providers

## Database Setup

### Create Types
```sql
-- Create role type for admin users
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
```

### Create Tables
Follow the schema in [SCHEMA.md](SCHEMA.md) to create all required tables.

### Row Level Security (RLS)
Apply the security policies from [AUTH_FULL.md](AUTH_FULL.md) to protect your data.

### Database Functions
```sql
-- Popular Products Function
CREATE OR REPLACE FUNCTION get_popular_products()
RETURNS TABLE (product_id uuid, order_count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    oi.product_id,
    COUNT(*) as order_count
  FROM order_items oi
  WHERE oi.product_id IS NOT NULL
  GROUP BY oi.product_id
  ORDER BY order_count DESC;
$$;

-- Admin Check Function
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

-- New User Handler
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

-- Chat Session Update
CREATE OR REPLACE FUNCTION update_last_message_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NEW.created_at
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;
```

### Database Triggers
```sql
-- User Creation Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Chat Message Trigger
CREATE TRIGGER update_chat_session_timestamp
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_last_message_timestamp();
```

## Storage Setup

1. Create a bucket named 'images'
2. Make it public
3. Set up the following CORS configuration:
```json
{
  "cors": [
    {
      "origin": "*",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedHeaders": ["*"]
    }
  ]
}
```

## Environment Variables

Required environment variables for the project:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_ANON_KEY`: Your project's anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your project's service role key (for admin operations)

## API Reference

See [API_FULL.md](API_FULL.md) for complete API documentation.

## Authentication

See [AUTH_FULL.md](AUTH_FULL.md) for complete authentication setup and policies.

## Deployment Checklist

1. [ ] All tables created
2. [ ] All RLS policies applied
3. [ ] All functions and triggers created
4. [ ] Storage bucket configured
5. [ ] Environment variables set
6. [ ] Auth providers enabled
7. [ ] Initial admin user created

## Initial Data

Create an initial admin user:
```sql
-- After creating a user through registration, make them an admin:
INSERT INTO admin_users (id, role)
VALUES ('USER_UUID', 'super_admin');
```

## Testing

1. Test authentication flows
2. Verify RLS policies
3. Test storage uploads
4. Verify admin functionality
5. Test chat system
6. Verify order creation
7. Test product management

For complete database schema details, see [SCHEMA.md](SCHEMA.md)
For complete API documentation, see [API_FULL.md](API_FULL.md)
For complete authentication documentation, see [AUTH_FULL.md](AUTH_FULL.md)