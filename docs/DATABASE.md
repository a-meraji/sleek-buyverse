# Database Schema

## Core Tables

### Products
```sql
- id (uuid, PK)
- name (text)
- description (text, nullable)
- image_url (text)
- category (text, nullable)
- sku (text, nullable)
- discount (integer, nullable)
- created_at (timestamp)
```

### Product Variants
```sql
- id (uuid, PK)
- product_id (uuid, FK -> products.id)
- size (text)
- color (text)
- stock (integer)
- price (numeric)
- created_at (timestamp)
```

### Orders
```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users.id)
- status (text, default: 'pending')
- total_amount (numeric)
- shipping_address (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

For complete schema including all tables and relationships, see [SCHEMA.md](SCHEMA.md)