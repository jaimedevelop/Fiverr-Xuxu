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
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  search?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}