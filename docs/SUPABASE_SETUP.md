# Supabase Project Setup Guide

This guide provides step-by-step instructions for creating a Supabase clone that matches the current project's functionality.

## Prerequisites

- A Supabase account
- Access to Supabase dashboard
- Basic understanding of SQL and database management

## Step 1: Create New Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Organization (create if needed)
   - Project name
   - Database password (save this securely)
   - Region (choose closest to your users)
4. Click "Create Project" and wait for initialization

## Step 2: Database Setup

1. Navigate to the SQL Editor in your project
2. Execute the SQL commands in order:
   - Create custom types (user_role)
   - Create core tables
   - Create dependent tables
   - Create functions
   - Create triggers
   - Enable RLS
   - Create policies

See [SCHEMA.md](SCHEMA.md) for complete table structures.

## Step 3: Storage Configuration

1. Go to Storage in Supabase dashboard
2. Create a new bucket:
   ```bash
   Name: images
   Public: Yes
   ```
3. Add CORS configuration:
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

## Step 4: Authentication Setup

1. Go to Authentication > Settings
2. Configure auth providers:
   - Enable Email auth
   - Set Site URL
   - Configure redirect URLs
3. For development:
   - Disable email confirmation (optional)
   - Configure additional providers if needed

## Step 5: Environment Variables

Create a `.env` file with:
```bash
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 6: Initial Admin User

1. Create a user through registration
2. Execute in SQL editor:
   ```sql
   INSERT INTO admin_users (id, role)
   VALUES ('YOUR_USER_UUID', 'super_admin');
   ```

## Step 7: Testing Checklist

- [ ] Authentication flows
- [ ] RLS policies
- [ ] Storage uploads
- [ ] Admin functionality
- [ ] Chat system
- [ ] Order creation
- [ ] Product management

## Database Functions

The following functions should be created:

1. `get_popular_products()`
   - Returns popular products based on order count

2. `handle_new_user()`
   - Trigger function for new user registration
   - Creates user profile

3. `is_admin()`
   - Checks if a user has admin privileges

4. `update_last_message_timestamp()`
   - Updates chat session timestamp on new messages

## Database Triggers

1. `on_auth_user_created`
   - Fires after new user creation
   - Creates user profile

2. `update_chat_session_timestamp`
   - Updates chat session last message timestamp

## Security Policies

Refer to [AUTH_FULL.md](AUTH_FULL.md) for complete RLS policy configurations.

## Troubleshooting

Common issues and solutions:

1. RLS Policy Issues
   - Verify policies are correctly applied
   - Test with authenticated and anonymous users

2. Storage Access
   - Check bucket permissions
   - Verify CORS configuration

3. Authentication Problems
   - Confirm redirect URLs
   - Check email provider settings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [API Documentation](API_FULL.md)
- [Authentication Guide](AUTH_FULL.md)
- [Database Schema](SCHEMA.md)