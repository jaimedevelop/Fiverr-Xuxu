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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'digital';

// NEW: Order fulfillment type
export type FulfillmentType = 'delivery' | 'pickup';

// NEW: Pickup time slot interface
export interface PickupTimeSlot {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
  datetime: Date; // Full datetime object - will be converted to Firestore Timestamp
  timestamp?: number; // Unix timestamp for easier sorting/filtering
}

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
  
  // NEW: Fulfillment type and conditional fields
  fulfillmentType: FulfillmentType;
  deliveryAddress?: Address; // Optional for pickup orders
  pickupTime?: PickupTimeSlot; // Optional for delivery orders
  
  specialInstructions?: string;
  estimatedDeliveryTime: Date; // For delivery orders, this is delivery time; for pickup, this is pickup time
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  search?: string;
  fulfillmentType?: FulfillmentType; // NEW: Filter by fulfillment type
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  // NEW: Pickup vs delivery stats
  deliveryOrders: number;
  pickupOrders: number;
}