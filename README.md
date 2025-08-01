
# Kombee E-commerce Frontend

A modern e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS, integrating with Saleor GraphQL API.

## 🚀 Features

### Core Pages
- **Login Page** - Authentication with JWT tokens
- **Product Listing Page (PLP)** - With filters, search, and sorting
- **Product Detail Page (PDP)** - Dynamic routes with variant selection
- **Cart Page** - Full cart management
- **Checkout Page** - Complete checkout flow with address forms

### Tech Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL
- **Zustand** for state management
- **React Hook Form** for form handling
- **Heroicons** for icons

### Performance Features
- **SSR/SSG** - Server-side rendering for SEO
- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic route-based splitting
- **Caching** - Apollo Client caching for GraphQL queries

### UX Features
- **Responsive Design** - Mobile-first approach
- **Loading Skeletons** - Better perceived performance
- **Error Boundaries** - Graceful error handling
- **Optimistic Updates** - Instant UI feedback
- **Debounced Search** - Smooth search experience

### State Management
- **Auth Store** - User authentication state
- **Cart Store** - Shopping cart with persistence
- **Local Storage** - Persistent cart and auth data

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Environment Variables

The app connects to the Saleor demo API:
- GraphQL Endpoint: `https://saleor-kombee.onrender.com/graphql/`
- Demo credentials: `admin1@example.com` / `admin`

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── products/          # Product listing & details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── order-confirmation/ # Order success
├── components/
│   ├── layout/            # Header, Footer
│   ├── products/          # Product components
│   ├── ui/                # Reusable UI components
│   └── providers/         # Context providers
├── lib/
│   ├── apollo-client.ts   # GraphQL client setup
│   ├── graphql/           # Queries and mutations
│   └── types.ts           # TypeScript definitions
└── store/                 # Zustand stores
    ├── auth-store.ts      # Authentication
    └── cart-store.ts      # Shopping cart
```

## 🎯 Key Features Implemented

### 1. Authentication
- JWT-based login with Saleor
- Persistent auth state
- Protected routes handling

### 2. Product Catalog
- Infinite scroll for products
- Advanced filtering by attributes
- Real-time search with debouncing
- Product variants support

### 3. Shopping Cart
- Add/remove/update items
- Persistent cart across sessions
- Real-time quantity updates
- Cart badge in header

### 4. Checkout Flow
- Multi-step checkout process
- Address validation
- Payment integration (demo mode)
- Order confirmation

### 5. Performance
- Image lazy loading
- Skeleton loading states
- Optimistic UI updates
- Efficient GraphQL queries

## 🔧 Technical Decisions

### State Management
- **Zustand** chosen for simplicity and TypeScript support
- **Persistent storage** for cart and auth
- **Optimistic updates** for better UX

### Styling
- **Tailwind CSS** for utility-first styling
- **Custom CSS components** for reusable patterns
- **Responsive design** with mobile-first approach

### GraphQL Integration
- **Apollo Client** for caching and state management
- **Type-safe queries** with generated types
- **Error handling** with user-friendly messages

### Form Handling
- **React Hook Form** for performance and validation
- **Custom validation** for checkout forms
- **Progressive enhancement** for accessibility

## 🚀 Deployment

The app is optimized for deployment on Replit:

```bash
npm run build
npm start
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User login/logout
- [ ] Product browsing and filtering
- [ ] Search functionality
- [ ] Add to cart from PLP and PDP
- [ ] Cart management (add/remove/update)
- [ ] Checkout process
- [ ] Responsive design
- [ ] Error states

### Demo Account
- Email: `admin1@example.com`
- Password: `admin`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔮 Future Enhancements

- User registration
- Wishlist functionality
- Product reviews
- Advanced search filters
- Email notifications
- Payment gateway integration
- Order tracking
- Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js 14 and modern web technologies.
