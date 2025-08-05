# Pastry Shop App Implementation Plan

## Overview
This plan outlines the implementation of remaining components for the pastry shop management application, focusing on both admin and user-facing features.

## Project Structure
- Admin page components will be organized in `src/components/admin/`
- User page components will be organized in `src/components/user/`

## Implementation Priority

### Phase 1: Core Admin Functionality (High Priority)

#### 1. Dashboard (Panel de Control)
**Purpose**: Provide business owners with an overview of their performance.

**Components to Create**:
- `src/components/admin/dashboard/DashboardStats.tsx` - Cards showing key metrics
- `src/components/admin/dashboard/RecentOrdersTable.tsx` - Table with recent orders
- `src/components/admin/dashboard/SalesChart.tsx` - Visual representation of sales
- `src/components/admin/dashboard/PopularItemsCard.tsx` - Display of best-selling items
- `src/components/admin/dashboard/NotificationsPanel.tsx` - Important alerts
- `src/components/admin/dashboard/QuickActions.tsx` - Shortcuts to frequently used features

**Existing Components to Utilize**: Button, ProgressBar, LoadingSpinner

#### 2. Orders (Pedidos)
**Purpose**: Manage incoming and historical orders.

**Components to Create**:
- `src/components/admin/orders/OrdersFilter.tsx` - Filter by date, status, customer
- `src/components/admin/orders/OrdersList.tsx` - Display orders with key details
- `src/components/admin/orders/OrderDetailsModal.tsx` - Detailed view of a specific order
- `src/components/admin/orders/OrderStatusUpdate.tsx` - Component to change order status
- `src/components/admin/orders/OrderSearch.tsx` - Search functionality
- `src/components/admin/orders/BulkActions.tsx` - Actions for multiple orders

**Existing Components to Utilize**: Button, Select, FormInput, LoadingSpinner, Notification

### Phase 2: Business Management Features (Medium Priority)

#### 3. Analytics (Análisis)
**Purpose**: Provide detailed business performance insights.

**Components to Create**:
- `src/components/admin/analytics/DateRangePicker.tsx` - Select time periods
- `src/components/admin/analytics/SalesChart.tsx` - Detailed sales visualization
- `src/components/admin/analytics/CustomerAnalytics.tsx` - Customer behavior insights
- `src/components/admin/analytics/ItemPerformanceTable.tsx` - Performance metrics
- `src/components/admin/analytics/ExportButton.tsx` - Export analytics data
- `src/components/admin/analytics/ComparisonMetrics.tsx` - Compare time periods

**Existing Components to Utilize**: Button, Select, ProgressBar, LoadingSpinner

#### 4. Inventory (Inventario)
**Purpose**: Manage stock levels for all menu items.

**Components to Create**:
- `src/components/admin/inventory/InventoryList.tsx` - Display items with stock levels
- `src/components/admin/inventory/StockUpdateModal.tsx` - Update quantities
- `src/components/admin/inventory/LowStockAlerts.tsx` - Notifications for low stock
- `src/components/admin/inventory/InventorySearch.tsx` - Search specific items
- `src/components/admin/inventory/StockHistory.tsx` - Historical stock movements
- `src/components/admin/inventory/InventoryForecast.tsx` - Predict future needs

**Existing Components to Utilize**: Button, FormInput, LoadingSpinner, Notification, FormSuccess, FormError

#### 5. Business Profile (Perfil del Negocio)
**Purpose**: Manage business information and settings.

**Components to Create**:
- `src/components/admin/businessProfile/BusinessInfoForm.tsx` - Update business details
- `src/components/admin/businessProfile/BusinessHoursForm.tsx` - Set operating hours
- `src/components/admin/businessProfile/LogoUpload.tsx` - Change business logo
- `src/components/admin/businessProfile/BusinessDescriptionForm.tsx` - Edit description
- `src/components/admin/businessProfile/LocationPicker.tsx` - Set business location
- `src/components/admin/businessProfile/SocialMediaLinks.tsx` - Manage social profiles

**Existing Components to Utilize**: Button, FormInput, ImageUpload, FormSuccess, FormError, LoadingSpinner, Notification

### Phase 3: Advanced Features (Lower Priority)

#### 6. Payments (Pagos)
**Purpose**: Manage payment methods and view transaction history.

**Components to Create**:
- `src/components/admin/payments/PaymentMethodsList.tsx` - Display active payment methods
- `src/components/admin/payments/AddPaymentMethodForm.tsx` - Add new payment options
- `src/components/admin/payments/TransactionHistory.tsx` - Show past transactions
- `src/components/admin/payments/PayoutSettings.tsx` - Configure payout preferences
- `src/components/admin/payments/EarningsSummary.tsx` - Display revenue summary
- `src/components/admin/payments/TaxSettings.tsx` - Configure tax information

**Existing Components to Utilize**: Button, FormInput, Select, FormSuccess, FormError, LoadingSpinner, Notification

#### 7. Promotions (Promociones)
**Purpose**: Create and manage promotional offers.

**Components to Create**:
- `src/components/admin/promotions/PromotionsList.tsx` - Display active and past promotions
- `src/components/admin/promotions/CreatePromotionForm.tsx` - Form to create new promotions
- `src/components/admin/promotions/PromotionAnalytics.tsx` - Performance metrics
- `src/components/admin/promotions/DiscountCodeGenerator.tsx` - Create discount codes
- `src/components/admin/promotions/PromotionCalendar.tsx` - Schedule future promotions
- `src/components/admin/promotions/PromotionPreview.tsx` - Preview how promotion appears

**Existing Components to Utilize**: Button, FormInput, Select, FormSuccess, FormError, LoadingSpinner, Notification

#### 8. Settings (Configuración)
**Purpose**: Manage account and application settings.

**Components to Create**:
- `src/components/admin/settings/AccountSettingsForm.tsx` - Update email, password
- `src/components/admin/settings/NotificationPreferences.tsx` - Configure notifications
- `src/components/admin/settings/UserManagement.tsx` - Manage users with permissions
- `src/components/admin/settings/TaxSettings.tsx` - Configure tax information
- `src/components/admin/settings/IntegrationSettings.tsx` - Connect with other services
- `src/components/admin/settings/SecuritySettings.tsx` - Advanced security options

**Existing Components to Utilize**: Button, FormInput, Select, PasswordStrength, FormSuccess, FormError, LoadingSpinner, Notification

### Phase 4: User-Facing Features (Medium Priority)

#### 1. Orders/Cart (Pedidos/Carrito)
**Purpose**: Allow users to place orders and manage their cart.

**Components to Create**:
- `src/components/user/orders/CartItems.tsx` - Display items in cart
- `src/components/user/orders/QuantitySelector.tsx` - Adjust item quantities
- `src/components/user/orders/OrderSummary.tsx` - Show subtotal, taxes, total
- `src/components/user/orders/CheckoutForm.tsx` - Delivery and payment information
- `src/components/user/orders/OrderHistory.tsx` - Show past orders
- `src/components/user/orders/OrderTracking.tsx` - Track current order status
- `src/components/user/orders/DeliveryTimePicker.tsx` - Select delivery time
- `src/components/user/orders/SpecialInstructions.tsx` - Add order notes

**Existing Components to Utilize**: Button, FormInput, Select, FormSuccess, FormError, LoadingSpinner, Notification

#### 2. Profile/Settings (Perfil/Configuración)
**Purpose**: Manage user account and preferences.

**Components to Create**:
- `src/components/user/profile/UserProfileForm.tsx` - Update personal information
- `src/components/user/profile/AddressBook.tsx` - Manage delivery addresses
- `src/components/user/profile/PaymentMethods.tsx` - Saved payment options
- `src/components/user/profile/OrderPreferences.tsx` - Default order settings
- `src/components/user/profile/NotificationSettings.tsx` - Configure notifications
- `src/components/user/profile/AccountSecurity.tsx` - Password change, 2FA
- `src/components/user/profile/FavoriteItems.tsx` - List of favorite menu items
- `src/components/user/profile/OrderHistory.tsx` - View past orders

**Existing Components to Utilize**: Button, FormInput, Select, PasswordStrength, FormSuccess, FormError, LoadingSpinner, Notification

## Implementation Strategy

### Base Components to Create First

1. **BaseCard Component** (`src/components/common/BaseCard.tsx`)
   - Reusable card component with consistent styling
   - Support for title, content, actions, loading states
   - Extendable for specific card types

2. **DataTable Component** (`src/components/common/DataTable.tsx`)
   - Reusable table component with sorting, filtering, pagination
   - Support for different data types and actions
   - Export functionality

3. **FormWrapper Component** (`src/components/common/FormWrapper.tsx`)
   - Standardized form handling with validation
   - Loading states during submission
   - Error handling and success messages

### State Management Enhancements

1. **OrderContext** (`src/contexts/OrderContext.tsx`)
   - Manage order state across components
   - Provide CRUD operations for orders

2. **InventoryContext** (`src/contexts/InventoryContext.tsx`)
   - Manage inventory state
   - Handle stock updates and alerts

3. **BusinessContext** (`src/contexts/BusinessContext.tsx`)
   - Manage business profile and settings
   - Provide business-wide data to components

### Data Models to Define

1. **Order Model** (`src/types/order.ts`)
   ```typescript
   interface Order {
     id: string;
     userId: string;
     businessId: string;
     items: OrderItem[];
     status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
     subtotal: number;
     tax: number;
     deliveryFee: number;
     total: number;
     paymentMethod: 'cash' | 'card' | 'digital';
     deliveryAddress: Address;
     specialInstructions?: string;
     estimatedDeliveryTime: Date;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **Inventory Model** (`src/types/inventory.ts`)
   ```typescript
   interface InventoryItem {
     id: string;
     businessId: string;
     pastryId: string;
     currentStock: number;
     minimumStock: number;
     lastUpdated: Date;
   }
   ```

3. **Analytics Model** (`src/types/analytics.ts`)
   ```typescript
   interface AnalyticsData {
     businessId: string;
     date: Date;
     metrics: {
       totalOrders: number;
       revenue: number;
       averageOrderValue: number;
       popularItems: string[];
       customerCount: number;
       newCustomers: number;
     };
   }
   ```

### Service Layer Implementation

1. **OrderService** (`src/services/orderService.ts`)
   - CRUD operations for orders
   - Order status updates
   - Order filtering and searching

2. **InventoryService** (`src/services/inventoryService.ts`)
   - Stock management
   - Low stock alerts
   - Stock history tracking

3. **AnalyticsService** (`src/services/analyticsService.ts`)
   - Sales data retrieval
   - Performance metrics calculation
   - Data export functionality

## Implementation Steps

1. **Create Base Components** (1-2 days)
   - Implement BaseCard, DataTable, and FormWrapper components
   - Ensure they work with existing styling and components

2. **Implement Phase 1 Components** (3-4 days)
   - Implement Orders management components
   - Set up OrderContext and OrderService

3. **Implement Phase 2 Components** (4-5 days)
   - Create Analytics components
   - Implement Inventory management
   - Build Business Profile components
   - Set up InventoryContext and BusinessContext

4. **Implement Phase 3 Components** (3-4 days)
   - Create Payments management components
   - Implement Promotions system
   - Build Settings components

5. **Implement Phase 4 Components** (3-4 days)
   - Create user-facing Orders/Cart components
   - Implement user Profile/Settings components
   - Ensure seamless integration with existing user components
    - Create Dashboard components

6. **Testing and Refinement** (2-3 days)
   - Test all new components
   - Fix any bugs or issues
   - Optimize performance and user experience

## Success Metrics

1. All components implemented according to specifications
2. Consistent UI/UX across all new components
3. Proper integration with existing Firebase backend
4. Responsive design working on all device sizes
5. All forms properly validated with appropriate error handling
6. Efficient state management with minimal prop drilling

## Notes

- Follow existing code style and patterns
- Use TypeScript interfaces for all props and state
- Implement responsive design using Tailwind CSS
- Ensure all text is in Spanish as per the existing application
- Reuse existing components where possible to maintain consistency