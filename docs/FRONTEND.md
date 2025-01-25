# Frontend Documentation

## Project Structure

### Core Components
- `Navbar`: Main navigation component
- `Footer`: Site-wide footer
- `MainContent`: Primary content container
- `ProductCard`: Reusable product display component

### Watch Route Components
- `WatchCategories`: Horizontal scrollable category filters
- `WatchBrands`: Grid display of watch brands
- `WatchPolicies`: Display of shipping and warranty policies
- `WatchBanners`: Marketing banners specific to watches
- `CampaignBanner`: Dynamic campaign promotions

### Product Components
- `ProductDetails`: Detailed product view
- `ProductVariants`: Product size/color selection
- `ProductImageCarousel`: Product image gallery
- `AddToCartButton`: Cart functionality
- `ColorSelector`: Color variant selection
- `SizeSelector`: Size variant selection

### Cart & Checkout
- `CartDrawer`: Sliding cart panel
- `CartItem`: Individual cart item display
- `CheckoutForm`: Payment and shipping form

### User Components
- `AuthForm`: Login/Registration
- `ProfileForm`: User profile management
- `OrderHistory`: Past orders display

### Admin Components
- `AdminProducts`: Product management
- `AdminOrders`: Order processing
- `AdminReviews`: Review moderation
- `AdminCampaigns`: Campaign management

## State Management
- React Query for server state
- Context API for client state
- Supabase real-time subscriptions

## Styling
- Tailwind CSS for styling
- shadcn/ui component library
- Custom animations
- Responsive design principles

## Data Fetching
- Tanstack Query for data management
- Supabase client for database operations
- Optimistic updates for better UX

## Authentication
- Supabase Auth
- Protected routes
- Role-based access control

## Performance Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

## Error Handling
- Error boundaries
- Toast notifications
- Fallback UI components

## Testing
- Component testing
- Integration testing
- E2E testing with Cypress

## Development Guidelines
1. Component Structure
   - Functional components
   - Custom hooks for logic
   - Props validation

2. State Management
   - Local state for UI
   - React Query for server state
   - Context for global state

3. Styling
   - Tailwind utility classes
   - Component-specific styles
   - Responsive design

4. Performance
   - Memoization
   - Code splitting
   - Asset optimization

5. Accessibility
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## Best Practices
- Component composition
- Custom hooks
- TypeScript types
- Error boundaries
- Performance monitoring