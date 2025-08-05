export interface InventoryItem {
  id: string;
  businessId: string;
  pastryId: string;
  currentStock: number;
  minimumStock: number;
  lastUpdated: Date;
}

export interface StockChange {
  date: Date;
  quantity: number;
  type: 'addition' | 'subtraction' | 'adjustment';
  reason: string;
  userId: string;
}

export interface InventoryWithDetails extends InventoryItem {
  pastryName: string;
  categoryName: string;
  unitPrice: number;
  isLowStock: boolean;
}

export interface StockAlert {
  id: string;
  businessId: string;
  pastryId: string;
  pastryName: string;
  currentStock: number;
  minimumStock: number;
  severity: 'low' | 'critical';
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface InventoryForecast {
  pastryId: string;
  pastryName: string;
  currentStock: number;
  averageDailyUsage: number;
  daysRemaining: number;
  recommendedOrderDate: Date;
  recommendedOrderQuantity: number;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  topSellingItems: {
    pastryId: string;
    name: string;
    quantitySold: number;
  }[];
}