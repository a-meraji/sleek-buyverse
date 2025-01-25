# Project Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase CLI
- Visual Studio Code (recommended)

## Initial Setup

1. Clone the Repository
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install Dependencies
```bash
npm install
```

3. Environment Configuration
Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Supabase Setup
- Create a Supabase project
- Set up database tables
- Configure authentication
- Set up storage buckets
- Apply RLS policies

5. Development Server
```bash
npm run dev
```

## Database Setup

1. Core Tables
- products
- product_variants
- orders
- reviews
- profiles
- marketing_campaigns

2. Run Migrations
```bash
supabase db reset
```

3. Seed Data
```bash
npm run seed
```

## Authentication Setup

1. Enable Providers
- Email/Password
- OAuth providers (optional)

2. Configure Policies
- RLS policies
- User roles

## Storage Setup

1. Create Buckets
- images (public)
- avatars (private)

2. Configure Policies
- Upload permissions
- Download permissions

## Edge Functions

1. Deploy Functions
```bash
supabase functions deploy
```

2. Set Secrets
```bash
supabase secrets set --env-file ./supabase/.env
```

## Development Workflow

1. Branch Strategy
- main: production
- develop: staging
- feature/*: features
- bugfix/*: fixes

2. Code Quality
- ESLint
- Prettier
- TypeScript
- Husky hooks

3. Testing
- Unit tests
- Integration tests
- E2E tests

## Deployment

1. Build
```bash
npm run build
```

2. Preview
```bash
npm run preview
```

3. Deploy
```bash
npm run deploy
```

## Troubleshooting

1. Common Issues
- Database connection
- Authentication errors
- Build failures

2. Debugging
- Console logs
- Network tab
- Supabase logs

## Additional Resources
- Documentation
- API Reference
- Component Library
- Design System