# User Features Implementation Plan

## Overview
This plan outlines the implementation of user-facing features for the pastry shop application, focusing on favorites, cart functionality, ordering, and pre-ordering capabilities.

## Current State Analysis

### Existing Components
- `UserProfile.tsx` - Basic user profile management
- `UserOrders.tsx` - Displays user orders (fixed require issue)
- `PastryCard.tsx` - Displays pastry items with basic favorite functionality
- `PastryDetailModal.tsx` - Shows pastry details with basic add to cart and pre-order buttons
- `FavoriteButton.tsx` - Basic favorite functionality (not connected to Firebase)
- `OrderContext.tsx` - Order management context (focused on admin functionality)
- `orderService.ts` - Order service with Firebase integration

### Missing Components
1. Cart functionality
2. Order and pre-order modals
3. User favorites integration with Firebase
4. User cart context
5. Order confirmation and tracking

## Implementation Plan

### Phase 1: Core User Functionality (High Priority)

#### 1. User Favorites System
**Purpose**: Allow users to favorite items and save them to their profile.

**Components to Create**:
- `src/components/user/favorites/FavoritesContext.tsx` - Context for managing user favorites
- `src/components/user/favorites/FavoritesService.ts` - Service for Firebase integration
- `src/components/user/favorites/UserFavorites.tsx` - Page to display user's favorite items
- `src/components/user/favorites/FavoriteItemCard.tsx` - Card for displaying favorite items

**Implementation Details**:
- Update `FavoriteButton.tsx` to use the new FavoritesContext
- Create Firebase collection for user favorites
- Add favorites to user profile page
- Implement add/remove favorites functionality

#### 2. Shopping Cart System
**Purpose**: Allow users to add items to cart and manage their order before checkout.

**Components to Create**:
- `src/components/user/cart/CartContext.tsx` - Context for managing cart state
- `src/components/user/cart/CartItem.tsx` - Individual item in cart
- `src/components/user/cart/CartSidebar.tsx` - Slide-out cart sidebar
- `src/components/user/cart/CartIcon.tsx` - Icon in header to show cart count
- `src/components/user/cart/QuantitySelector.tsx` - Component to adjust item quantities

**Implementation Details**:
- Create cart state management with CartContext
- Add items to cart from PastryDetailModal and PastryCard
- Implement quantity adjustments and item removal
- Calculate subtotal, tax, and total
- Persist cart in localStorage for session continuity

#### 3. Order Modal
**Purpose**: Allow users to complete their order with delivery details and payment method.

**Components to Create**:
- `src/components/user/orders/OrderModal.tsx` - Modal for order completion
- `src/components/user/orders/DeliveryAddressForm.tsx` - Form for delivery address
- `src/components/user/orders/PaymentMethodSelector.tsx` - Payment method selection
- `src/components/user/orders/OrderSummary.tsx` - Summary of order details
- `src/components/user/orders/OrderConfirmation.tsx` - Order confirmation page

**Implementation Details**:
- Create order modal triggered from cart
- Implement delivery address form with validation
- Add payment method selection (cash, card, digital)
- Display order summary with all costs
- Implement order submission to Firebase
- Update OrderContext to handle user orders
- Create order confirmation page with tracking details

#### 4. Pre-order System
**Purpose**: Allow users to schedule orders for future dates/times.

**Components to Create**:
- `src/components/user/orders/PreOrderModal.tsx` - Modal for pre-order scheduling
- `src/components/user/orders/DateTimePicker.tsx` - Date and time selection
- `src/components/user/orders/PreOrderConfirmation.tsx` - Pre-order confirmation

**Implementation Details**:
- Create pre-order modal with date/time selection
- Implement business hours validation
- Add pre-order specific fields to Order model
- Integrate with OrderContext and orderService
- Create pre-order confirmation with scheduled time details

### Phase 2: Enhanced User Experience (Medium Priority)

#### 5. Order Tracking
**Purpose**: Allow users to track their order status in real-time.

**Components to Create**:
- `src/components/user/orders/OrderTracking.tsx` - Order status tracking component
- `src/components/user/orders/OrderTimeline.tsx` - Visual timeline of order progress
- `src/components/user/orders/OrderStatusBadge.tsx` - Badge showing current status

**Implementation Details**:
- Create real-time order status updates
- Implement visual timeline with status milestones
- Add estimated delivery time updates
- Integrate with Firebase for real-time updates

#### 6. User Order History
**Purpose**: Allow users to view their past orders and reorder.

**Components to Create**:
- `src/components/user/orders/OrderHistoryItem.tsx` - Individual order in history
- `src/components/user/orders/OrderHistoryFilters.tsx` - Filters for order history
- `src/components/user/orders/ReorderButton.tsx` - Button to reorder past items

**Implementation Details**:
- Display past orders with details
- Implement filtering by date, status, etc.
- Add reorder functionality
- Show order status and tracking information

#### 7. User Profile Enhancements
**Purpose**: Enhance user profile with order-related information.

**Components to Create**:
- `src/components/user/profile/OrderPreferences.tsx` - User order preferences
- `src/components/user/profile/SavedAddresses.tsx` - Saved delivery addresses
- `src/components/user/profile/PaymentMethods.tsx` - Saved payment methods
- `src/components/user/profile/OrderStats.tsx` - User order statistics

**Implementation Details**:
- Add order preferences to profile
- Implement saved addresses for faster checkout
- Add saved payment methods
- Display user order statistics

## Data Models

### Favorites Model
```typescript
interface Favorite {
  id: string;
  userId: string;
  pastryId: string;
  createdAt: Date;
}
```

### Cart Item Model
```typescript
interface CartItem {
  id: string;
  pastryId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}
```

### Pre-order Model Extension
```typescript
interface PreOrder extends Order {
  isPreOrder: true;
  scheduledFor: Date;
  preOrderStatus: 'scheduled' | 'preparing' | 'ready' | 'completed';
}
```

## Context Enhancements

### FavoritesContext
```typescript
interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  addFavorite: (pastryId: string) => Promise<void>;
  removeFavorite: (pastryId: string) => Promise<void>;
  isFavorite: (pastryId: string) => boolean;
  fetchFavorites: () => Promise<void>;
}
```

### CartContext
```typescript
interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
```

## Service Layer Enhancements

### FavoritesService
- CRUD operations for favorites
- User-specific favorites retrieval
- Batch operations for multiple items

### Enhanced OrderService
- User-specific order retrieval
- Pre-order creation and management
- Order status updates with real-time capabilities
- Reorder functionality

## Implementation Steps

1. **Create Favorites System** (2 days)
   - Implement FavoritesContext and FavoritesService
   - Update FavoriteButton component
   - Create UserFavorites page
   - Integrate with UserProfile

2. **Implement Cart System** (3 days)
   - Create CartContext and cart components
   - Update PastryCard and PastryDetailModal
   - Implement CartSidebar and CartIcon
   - Add cart persistence

3. **Build Order Modal** (3 days)
   - Create OrderModal and related components
   - Implement delivery address form
   - Add payment method selection
   - Integrate with OrderContext

4. **Implement Pre-order System** (2 days)
   - Create PreOrderModal and DateTimePicker
   - Extend Order model for pre-orders
   - Add pre-order confirmation
   - Update orderService

5. **Add Order Tracking** (2 days)
   - Create OrderTracking and OrderTimeline
   - Implement real-time status updates
   - Add OrderStatusBadge
   - Update UserOrders page

6. **Build Order History** (2 days)
   - Create OrderHistoryItem and filters
   - Implement ReorderButton
   - Add search and filtering
   - Integrate with UserProfile

7. **Enhance User Profile** (2 days)
   - Create order-related profile components
   - Implement saved addresses
   - Add payment methods
   - Display order statistics

8. **Testing and Refinement** (2 days)
   - Test all new components
   - Fix any bugs or issues
   - Optimize performance
   - Ensure responsive design

## Integration Points

### With Existing Components
- Update `PastryCard.tsx` to use CartContext and FavoritesContext
- Enhance `PastryDetailModal.tsx` with cart and pre-order functionality
- Update `UserProfile.tsx` with new order-related components
- Enhance `UserOrders.tsx` with tracking and history features

### With Firebase
- Create favorites collection
- Extend orders collection for pre-orders
- Implement real-time updates for order status
- Add user-specific data retrieval

### With Admin Components
- Ensure user orders appear in admin orders page
- Update order status flow to include pre-order states
- Add order statistics to admin dashboard

## Success Metrics

1. All user features implemented according to specifications
2. Seamless integration with existing Firebase backend
3. Real-time order status updates working correctly
4. Cart and favorites persistence across sessions
5. Responsive design working on all device sizes
6. All forms properly validated with appropriate error handling
7. Efficient state management with minimal prop drilling

## Notes

- Follow existing code style and patterns
- Use TypeScript interfaces for all props and state
- Implement responsive design using Tailwind CSS
- Ensure all text is in Spanish as per the existing application
- Reuse existing components where possible to maintain consistency
- Implement proper error handling and loading states
- Add accessibility features to all new components