# Frontend Documentation

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication related components
│   ├── cart/          # Shopping cart components
│   ├── chat/          # Customer support chat components
│   ├── home/          # Homepage specific components
│   ├── layout/        # Layout components (header, footer, etc)
│   ├── navbar/        # Navigation components
│   ├── product/       # Product related components
│   ├── products/      # Product listing components
│   ├── profile/       # User profile components
│   └── ui/            # Shadcn UI components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations
├── lib/              # Utility functions
├── pages/            # Page components
└── types/            # TypeScript type definitions
```

## Core Components

### Layout Components
- `RootLayout`: Main layout wrapper with navigation and footer
- `Navbar`: Main navigation bar with search, cart, and user menu
- `Footer`: Site-wide footer with links and information

### Product Components
- `ProductCard`: Displays product preview in grid/list views
- `ProductDetails`: Detailed product view with variants
- `ProductImageCarousel`: Image gallery for product photos
- `AddToCartButton`: Handles adding items to cart
- `VariantSelector`: Product variant selection UI

### Cart Components
- `CartDrawer`: Sliding cart panel
- `CartItem`: Individual cart item display
- `CartSummary`: Order summary with totals
- `CartProvider`: Cart state management context

### Authentication Components
- `AuthForm`: Login/Registration form
- `ProfileButton`: User profile menu
- `SessionManager`: Handles auth state

## Key Features

### Product Management
- Product listing with filters and search
- Variant selection with stock tracking
- Image carousel with thumbnails
- Add to cart functionality
- Favorites system

### Shopping Cart
- Persistent cart across sessions
- Real-time quantity updates
- Variant management
- Price calculations with discounts

### User Authentication
- Email/password authentication
- Social login options
- Protected routes
- Profile management

### Admin Dashboard
- Product management
- Order management
- User management
- Analytics dashboard
- Chat support system

## State Management

### Cart Context
```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
```

### Authentication State
Managed through Supabase Auth with local state sync:
```typescript
const [user, setUser] = useState<User | null>(null);
```

## API Integration

### Product API
```typescript
// Fetch products
const { data: products } = await supabase
  .from('products')
  .select('*, product_variants(*)')
```

### Cart API
```typescript
// Add to cart
const { data, error } = await supabase
  .from('cart_items')
  .insert({
    user_id: userId,
    product_id: productId,
    variant_id: variantId,
    quantity: quantity
  })
```

## Component Dependencies

### Product Page Flow
```
ProductContainer
├── ProductImageCarousel
├── ProductDetails
│   ├── VariantSelector
│   ├── AddToCartButton
│   └── FavoriteButton
└── RelatedProducts
```

### Cart Flow
```
CartDrawer
├── CartHeader
├── CartContent
│   └── CartItem
├── CartSummary
└── CheckoutButton
```

## Type Definitions

### Product Types
```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  sku?: string;
  discount?: number | null;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

interface ProductVariant {
  id: string;
  product_id: string;
  stock: number;
  price: number;
  parameters: Record<string, string | number>;
}
```

### Cart Types
```typescript
interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}
```

## Styling

The project uses Tailwind CSS for styling with additional utilities from shadcn/ui:

### Theme Configuration
- Color scheme defined in `tailwind.config.js`
- Dark mode support via `next-themes`
- Responsive breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Component Styling
- Consistent spacing using Tailwind's spacing scale
- Responsive design patterns
- Accessible color contrast
- Interactive states (hover, focus, active)

## Error Handling

### API Errors
```typescript
try {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
} catch (error) {
  toast({
    title: "Error",
    description: "Failed to fetch products",
    variant: "destructive"
  });
}
```

### Form Validation
- Using `react-hook-form` with `zod` schemas
- Client-side validation
- Server response handling

## Performance Considerations

### Data Fetching
- React Query for caching and state management
- Optimistic updates for better UX
- Pagination for large datasets

### Image Optimization
- Lazy loading for images
- Proper sizing and formats
- Loading states and placeholders

## Testing

### Component Testing
- Unit tests for utility functions
- Component rendering tests
- Integration tests for user flows

### E2E Testing
- Critical path testing
- Authentication flows
- Checkout process

## Deployment

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Required variables for frontend:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Best Practices

### Code Organization
- Component-first architecture
- Feature-based folder structure
- Shared utilities in `lib/`
- Type definitions in `types/`

### State Management
- Local state for UI
- Context for shared state
- React Query for server state
- Supabase for real-time updates

### Performance
- Lazy loading of routes
- Optimized images
- Efficient re-renders
- Proper memoization

### Accessibility
- ARIA labels
- Keyboard navigation
- Color contrast
- Screen reader support

## Common Patterns

### Form Handling
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    // ...
  }
});
```

### Data Fetching
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData
});
```

### Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorComponent />}>
  <Component />
</ErrorBoundary>
```

## Troubleshooting

### Common Issues
1. Authentication state not persisting
2. Cart synchronization issues
3. Image loading failures
4. Form submission errors

### Debugging Tools
- Browser DevTools
- React DevTools
- Network tab monitoring
- Console logging

## Security Considerations

### Authentication
- Protected routes
- Token management
- Session handling
- Role-based access

### Data Protection
- Input sanitization
- XSS prevention
- CSRF protection
- Secure forms

## Future Considerations

### Planned Features
- Enhanced search functionality
- Advanced filtering
- User reviews system
- Wishlist functionality

### Technical Debt
- Component refactoring
- Test coverage
- Performance optimization
- Accessibility improvements