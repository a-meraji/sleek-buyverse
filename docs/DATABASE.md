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
- parameters (jsonb)
- stock (integer)
- price (numeric)
- created_at (timestamp)
```

### Marketing Campaigns
```sql
- id (uuid, PK)
- title (text)
- description (text, nullable)
- image_url (text)
- status (text, default: 'inactive')
- start_date (timestamp)
- end_date (timestamp)
- is_timeless (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)
```

### Campaign Products
```sql
- id (uuid, PK)
- campaign_id (uuid, FK -> marketing_campaigns.id)
- product_id (uuid, FK -> products.id)
- created_at (timestamp)
```

For complete schema including all tables and relationships, see [SCHEMA.md](SCHEMA.md)