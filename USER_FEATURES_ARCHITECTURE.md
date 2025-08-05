# User Features Architecture

## System Architecture Overview

```mermaid
graph TD
    A[User Interface] --> B[Favorites System]
    A --> C[Cart System]
    A --> D[Order System]
    A --> E[Pre-order System]
    
    B --> F[FavoritesContext]
    B --> G[FavoritesService]
    B --> H[Firebase Favorites Collection]
    
    C --> I[CartContext]
    C --> J[LocalStorage]
    
    D --> K[OrderContext]
    D --> L[OrderService]
    D --> M[Firebase Orders Collection]
    
    E --> K
    E --> L
    E --> M
    
    F --> N[UserProfile]
    I --> O[PastryCard]
    I --> P[PastryDetailModal]
    K --> Q[UserOrders]
    K --> R[OrderTracking]
    
    M --> S[Admin Orders Page]
```

## Component Relationships

```mermaid
graph LR
    PastryCard --> FavoriteButton
    PastryCard --> CartIcon
    PastryCard --> PastryDetailModal
    
    PastryDetailModal --> AddToCartButton
    PastryDetailModal --> PreOrderButton
    
    AddToCartButton --> CartContext
    PreOrderButton --> PreOrderModal
    
    CartContext --> CartSidebar
    CartContext --> CartIcon
    
    CartSidebar --> OrderModal
    PreOrderModal --> PreOrderConfirmation
    
    OrderModal --> OrderService
    PreOrderModal --> OrderService
    
    OrderService --> Firebase
    OrderService --> OrderContext
    
    OrderContext --> UserOrders
    OrderContext --> OrderTracking
    OrderContext --> AdminOrders
    
    FavoriteButton --> FavoritesContext
    FavoritesContext --> FavoritesService
    FavoritesService --> Firebase
    FavoritesContext --> UserFavorites
    FavoritesContext --> UserProfile
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Component
    participant C as Context
    participant S as Service
    participant F as Firebase
    
    U->>UI: Click Favorite Button
    UI->>C: addFavorite(pastryId)
    C->>S: createFavorite(userId, pastryId)
    S->>F: Save to Favorites Collection
    F-->>S: Return success
    S-->>C: Return updated favorites
    C-->>UI: Update UI
    UI-->>U: Show favorited state
    
    U->>UI: Add to Cart
    UI->>C: addItem(pastry)
    C->>C: Update cart state
    C-->>UI: Update cart UI
    UI-->>U: Show updated cart
    
    U->>UI: Checkout
    UI->>C: getCartItems()
    C-->>UI: Return cart items
    UI->>UI: Show Order Modal
    U->>UI: Fill order details
    UI->>C: createOrder(orderData)
    C->>S: createOrder(orderData)
    S->>F: Save to Orders Collection
    F-->>S: Return order ID
    S-->>C: Return order
    C-->>UI: Show confirmation
    UI-->>U: Show order confirmation
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> FavoritesLoading
    FavoritesLoading --> FavoritesLoaded: fetchFavorites success
    FavoritesLoading --> FavoritesError: fetchFavorites error
    FavoritesLoaded --> FavoritesLoaded: addFavorite/removeFavorite
    FavoritesLoaded --> FavoritesError: operation error
    FavoritesError --> FavoritesLoading: retry
    
    [*] --> CartEmpty
    CartEmpty --> CartHasItems: addItem
    CartHasItems --> CartEmpty: removeItem/clearCart
    CartHasItems --> CartHasItems: updateQuantity/addItem
    
    [*] --> OrderIdle
    OrderIdle --> OrderCreating: createOrder
    OrderCreating --> OrderSuccess: success
    OrderCreating --> OrderError: error
    OrderSuccess --> OrderIdle
    OrderError --> OrderIdle: retry/cancel
```

## Firebase Schema

### Favorites Collection
```mermaid
erDiagram
    FAVORITES {
        string id PK
        string userId FK
        string pastryId FK
        timestamp createdAt
    }
    
    USERS {
        string id PK
        string email
        string displayName
        timestamp createdAt
    }
    
    PASTRIES {
        string id PK
        string name
        string description
        number price
        boolean available
        timestamp createdAt
    }
    
    FAVORITES }|--|| USERS : "belongs to"
    FAVORITES }|--|| PASTRIES : "references"
```

### Orders Collection
```mermaid
erDiagram
    ORDERS {
        string id PK
        string userId FK
        string businessId FK
        string status
        number subtotal
        number tax
        number deliveryFee
        number total
        string paymentMethod
        json deliveryAddress
        string specialInstructions
        timestamp estimatedDeliveryTime
        timestamp createdAt
        timestamp updatedAt
        boolean isPreOrder
        timestamp scheduledFor
    }
    
    ORDER_ITEMS {
        string id PK
        string orderId FK
        string pastryId FK
        string name
        number price
        number quantity
        string notes
    }
    
    USERS {
        string id PK
        string email
        string displayName
        timestamp createdAt
    }
    
    BUSINESSES {
        string id PK
        string name
        string description
        timestamp createdAt
    }
    
    PASTRIES {
        string id PK
        string name
        string description
        number price
        boolean available
        timestamp createdAt
    }
    
    ORDERS }|--|| USERS : "placed by"
    ORDERS }|--|| BUSINESSES : "for"
    ORDER_ITEMS }|--|| ORDERS : "part of"
    ORDER_ITEMS }|--|| PASTRIES : "references"
```

## Component Hierarchy

```mermaid
graph TD
    App --> UserProfile
    App --> UserMenu
    App --> UserOrders
    
    UserProfile --> UserFavorites
    UserProfile --> OrderPreferences
    UserProfile --> SavedAddresses
    UserProfile --> PaymentMethods
    
    UserMenu --> PastryGrid
    PastryGrid --> PastryCard
    PastryCard --> FavoriteButton
    PastryCard --> AddToCartButton
    
    UserMenu --> CartSidebar
    CartSidebar --> CartItem
    CartSidebar --> OrderSummary
    CartSidebar --> CheckoutButton
    
    UserMenu --> PastryDetailModal
    PastryDetailModal --> AddToCartButton
    PastryDetailModal --> PreOrderButton
    
    UserOrders --> OrderHistoryItem
    UserOrders --> OrderFilters
    UserOrders --> OrderTracking
    
    CheckoutButton --> OrderModal
    OrderModal --> DeliveryAddressForm
    OrderModal --> PaymentMethodSelector
    OrderModal --> OrderSummary
    
    PreOrderButton --> PreOrderModal
    PreOrderModal --> DateTimePicker
    PreOrderModal --> OrderSummary
```

This architecture provides a comprehensive overview of how the user features will be implemented, including the relationships between components, data flow, state management, and Firebase schema.