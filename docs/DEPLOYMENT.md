# Deployment Guide

## Quick Start

1. Set up Supabase project
2. Configure environment variables
3. Build and deploy frontend
4. Verify deployment

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Vercel account (recommended)

## Environment Setup

Required variables:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Supabase Setup

1. Create new project
2. Run database migrations
3. Configure auth providers
4. Set up storage bucket

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## Frontend Deployment

### Vercel (Recommended)
1. Connect repository
2. Configure environment variables
3. Deploy

### Manual Deployment
1. Build project: `npm run build`
2. Deploy to hosting service

## Post-Deployment

1. Verify authentication
2. Test core features
3. Monitor error logs
4. Set up analytics

For detailed instructions, see [DEPLOYMENT_FULL.md](./DEPLOYMENT_FULL.md).