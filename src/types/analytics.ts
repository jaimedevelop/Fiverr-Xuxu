export interface AnalyticsData {
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

export interface SalesDataPoint {
  date: Date;
  orders: number;
  revenue: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export type DateRange = 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'thisMonth' | 'lastMonth' | 'custom';

export interface ItemPerformance {
  pastryId: string;
  name: string;
  categoryId: string;
  categoryName: string;
  ordersCount: number;
  totalQuantity: number;
  revenue: number;
  popularityScore: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrdersPerCustomer: number;
  topCustomers: {
    userId: string;
    name: string;
    ordersCount: number;
    totalSpent: number;
  }[];
}

export interface SalesComparison {
  currentPeriod: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
  };
  previousPeriod: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
  };
  revenueChange: number; // percentage
  ordersChange: number; // percentage
  aovChange: number; // percentage
}

export interface HourlySalesData {
  hour: number; // 0-23
  orders: number;
  revenue: number;
}

export interface DailySalesData {
  date: Date;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  orders: number;
  revenue: number;
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  ordersCount: number;
  revenue: number;
  percentageOfTotal: number;
}