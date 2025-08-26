export interface OrderItem {
  id: string;
  pastryId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Address {
  street: string;
  colonia: string;
  municipality: string;
  postalCode: string;
  state: string;
  reference?: string;
}

// Updated to match admin interface and support scheduling
export type OrderStatus = 
  | 'pending'      // Pendiente - Initial status when order is placed
  | 'confirmed'    // Confirmado - Business has confirmed the order
  | 'preparing'    // Preparando - Order is being prepared
  | 'ready'        // Listo - Ready for pickup/delivery
  | 'out-for-delivery' // En Camino - Only for delivery orders
  | 'delivered'    // Entregado/Recogido - Final status for completed orders
  | 'cancelled'    // Cancelado - Order was cancelled
  | 'scheduled';   // Programado - Order scheduled for future preparation

export type PaymentMethod = 'cash' | 'card' | 'digital';

// Order fulfillment type
export type FulfillmentType = 'delivery' | 'pickup';

// Pickup time slot interface
export interface PickupTimeSlot {
  datetime: Date;
  displayTime: string;
  isToday: boolean;
  estimatedPreparationTime: number;
}

// Priority level for orders
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Order {
  id: string;
  userId: string;
  businessId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  
  // Fulfillment type and conditional fields
  fulfillmentType: FulfillmentType;
  deliveryAddress?: Address; // Required for delivery orders
  pickupTime?: PickupTimeSlot; // Required for pickup orders
  
  // Additional order details
  specialInstructions?: string;
  estimatedDeliveryTime: Date; // For delivery orders, this is delivery time; for pickup, this is pickup time
  
  // Scheduling and priority
  priority?: OrderPriority; // Priority level for order processing
  scheduledCompletionTime?: Date; // When the order should be completed
  isScheduledForNextDay?: boolean; // Flag for next-day orders
  isMorningPriority?: boolean; // Flag for morning priority orders
  isQueuedOrder?: boolean; // Flag for queued orders
  scheduleMessage?: string; // Message explaining the scheduling
  
  // Timestamps for order lifecycle
  createdAt: Date; // When order was created
  updatedAt: Date; // Last update timestamp
  orderPlacedAt?: Date; // When customer actually placed the order
  preparationStartedAt?: Date; // When preparation began
  readyAt?: Date; // When order was marked as ready
  deliveredAt?: Date; // When order was delivered/picked up
  cancelledAt?: Date; // When order was cancelled
  
  // Customer communication
  customerNotes?: string; // Notes from customer
  businessNotes?: string; // Internal notes from business
  
  // Tracking and notifications
  trackingUpdates?: OrderTrackingUpdate[];
  notificationsSent?: string[]; // List of notification types sent
}

// Interface for tracking updates
export interface OrderTrackingUpdate {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  isVisibleToCustomer: boolean;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  businessId?: string;
  search?: string;
  fulfillmentType?: FulfillmentType;
  priority?: OrderPriority;
  scheduled?: boolean; // Filter for scheduled orders
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  
  // Status-based stats
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number; // delivered orders
  cancelledOrders: number;
  scheduledOrders: number;
  
  // Fulfillment type stats
  deliveryOrders: number;
  pickupOrders: number;
  
  // Priority stats
  priorityOrders: number; // high/urgent priority orders
  
  // Time-based stats
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
  
  // Performance metrics
  averagePreparationTime?: number; // in minutes
  averageDeliveryTime?: number; // in minutes
  onTimeDeliveryRate?: number; // percentage
}

// Helper type for order status transitions
export interface StatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  allowedRoles: ('admin' | 'user')[];
  requiresConfirmation?: boolean;
  notifyCustomer?: boolean;
}

// Predefined status transitions
export const ORDER_STATUS_TRANSITIONS: StatusTransition[] = [
  { from: 'pending', to: 'confirmed', allowedRoles: ['admin'], notifyCustomer: true },
  { from: 'confirmed', to: 'preparing', allowedRoles: ['admin'], notifyCustomer: true },
  { from: 'preparing', to: 'ready', allowedRoles: ['admin'], notifyCustomer: true },
  { from: 'ready', to: 'out-for-delivery', allowedRoles: ['admin'], notifyCustomer: true }, // delivery only
  { from: 'ready', to: 'delivered', allowedRoles: ['admin'], notifyCustomer: true }, // pickup orders
  { from: 'out-for-delivery', to: 'delivered', allowedRoles: ['admin'], notifyCustomer: true }, // delivery orders
  { from: 'scheduled', to: 'confirmed', allowedRoles: ['admin'], notifyCustomer: true },
  // Cancellation transitions
  { from: 'pending', to: 'cancelled', allowedRoles: ['admin', 'user'], requiresConfirmation: true, notifyCustomer: true },
  { from: 'confirmed', to: 'cancelled', allowedRoles: ['admin', 'user'], requiresConfirmation: true, notifyCustomer: true },
  { from: 'scheduled', to: 'cancelled', allowedRoles: ['admin', 'user'], requiresConfirmation: true, notifyCustomer: true }
];

// Helper function to check if status transition is allowed
export const isStatusTransitionAllowed = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  userRole: 'admin' | 'user',
  fulfillmentType?: FulfillmentType
): boolean => {
  // Special case: out-for-delivery is only for delivery orders
  if (newStatus === 'out-for-delivery' && fulfillmentType !== 'delivery') {
    return false;
  }
  
  // Find matching transition
  const transition = ORDER_STATUS_TRANSITIONS.find(
    t => t.from === currentStatus && t.to === newStatus
  );
  
  if (!transition) {
    return false;
  }
  
  return transition.allowedRoles.includes(userRole);
};

// Helper function to get next possible statuses
export const getNextPossibleStatuses = (
  currentStatus: OrderStatus,
  userRole: 'admin' | 'user',
  fulfillmentType: FulfillmentType
): OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS
    .filter(t => 
      t.from === currentStatus && 
      t.allowedRoles.includes(userRole) &&
      (t.to !== 'out-for-delivery' || fulfillmentType === 'delivery')
    )
    .map(t => t.to);
};