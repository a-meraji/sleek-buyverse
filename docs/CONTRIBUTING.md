# Contributing Guide

## Project Overview

This is a React-based e-commerce platform specializing in watches, built with:
- React + TypeScript
- Supabase for backend
- TanStack Query for data management
- Shadcn/UI for components
- Tailwind CSS for styling

## Key Features

- Product catalog with watch-specific features
- Marketing campaigns system
- Real-time chat support
- User authentication and profiles
- Shopping cart and favorites
- Order management
- Admin dashboard
- Review system

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Setup)
4. Start development server: `npm run dev`

## Development Workflow

1. Create a new branch for your feature
2. Write tests if applicable
3. Follow code style guidelines
4. Submit a pull request

## Code Structure

### Core Directories
```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (cart, auth)
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── pages/         # Route components
└── types/         # TypeScript definitions
```

### Key Components
- `watch/` - Watch-specific components
- `admin/` - Admin dashboard components
- `cart/` - Shopping cart components
- `product/` - Product display components

## Testing

- Run tests: `npm test`
- Write tests for new features
- Ensure existing tests pass

## Style Guide

### TypeScript
- Use TypeScript for all new code
- Define interfaces for component props
- Use proper type annotations

### Components
- Create small, focused components
- Use composition over inheritance
- Follow React hooks best practices

### CSS
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing

## Database Schema

See [SCHEMA.md](./SCHEMA.md) for complete database structure.

## API Reference

See [API_FULL.md](./API_FULL.md) for complete API documentation.

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure CI passes
4. Request review from maintainers

## Environment Setup

Required environment variables:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Additional Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Full Deployment Guide](./DEPLOYMENT_FULL.md)
- [API Documentation](./API_FULL.md)