import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AnalyticsData, 
  SalesDataPoint, 
  TimeRange, 
  ItemPerformance, 
  CustomerAnalytics, 
  CategoryPerformance, 
  SalesComparison 
} from '../types/analytics';
import analyticsService from '../services/analyticsService';
import { useAuth } from './AuthContext';

interface AnalyticsContextType {
  salesData: SalesDataPoint[] | null;
  salesComparison: SalesComparison | null;
  topItems: ItemPerformance[] | null;
  customerAnalytics: CustomerAnalytics | null;
  categoryPerformance: CategoryPerformance[] | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: (timeRange: TimeRange) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const user = authState.user;
  const [salesData, setSalesData] = useState<SalesDataPoint[] | null>(null);
  const [salesComparison, setSalesComparison] = useState<SalesComparison | null>(null);
  const [topItems, setTopItems] = useState<ItemPerformance[] | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics | null>(null);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (timeRange: TimeRange) => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch sales data
      const sales = await analyticsService.getSalesData(user.businessId, timeRange);
      setSalesData(sales);
      
      // Fetch sales comparison (need to calculate previous period)
      const previousPeriodStart = new Date(timeRange.start);
      const previousPeriodEnd = new Date(timeRange.start);
      const periodLength = timeRange.end.getTime() - timeRange.start.getTime();
      previousPeriodStart.setTime(previousPeriodStart.getTime() - periodLength);
      previousPeriodEnd.setTime(previousPeriodEnd.getTime() - periodLength);
      
      const comparison = await analyticsService.getSalesComparison(
        user.businessId,
        timeRange,
        { start: previousPeriodStart, end: previousPeriodEnd }
      );
      setSalesComparison(comparison);
      
      // Fetch top items
      const items = await analyticsService.getItemPerformance(user.businessId, timeRange);
      setTopItems(items);
      
      // Fetch customer analytics
      const customers = await analyticsService.getCustomerAnalytics(user.businessId, timeRange);
      setCustomerAnalytics(customers);
      
      // Fetch category performance
      const categories = await analyticsService.getCategoryPerformance(user.businessId, timeRange);
      setCategoryPerformance(categories);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las analíticas');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    salesData,
    salesComparison,
    topItems,
    customerAnalytics,
    categoryPerformance,
    loading,
    error,
    fetchAnalytics,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};