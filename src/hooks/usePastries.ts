// src/hooks/usePastries.ts - Modified to support optional businessId
import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Pastry, FilterOptions, SortOption } from '../types/pastry';
import { Category } from '../types/category';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

interface UsePastriesOptions {
  businessId?: string; // NEW: Optional businessId to filter by specific business
}

export const usePastries = (options: UsePastriesOptions = {}) => {
  const { user } = useUser();
  const { logout } = useAuth();
  const [allPastries, setAllPastries] = useState<Pastry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: null,
  });
  const [sort, setSort] = useState<SortOption>('newest');

  // Fetch data from Firebase with business filtering
  useEffect(() => {
    console.log('🥐 usePastries: Setting up data fetch', {
      hasUser: !!user,
      userRole: user?.role,
      userBusinessId: user?.businessId,
      optionsBusinessId: options.businessId
    });

    // Don't fetch if we don't have user data yet (unless we have a specific businessId)
    if (!user && !options.businessId) {
      console.log('🥐 usePastries: No user data and no businessId, waiting...');
      return;
    }

    // Check if admin user has businessId (only if not using specific businessId)
    if (!options.businessId && user?.role === 'admin' && !user.businessId) {
      console.error('❌ usePastries: Admin user without businessId detected');
      setError('Error: Cuenta de administrador sin negocio asignado. Cerrando sesión...');
      setTimeout(() => {
        logout();
      }, 2000);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up categories listener (same for all users)
    const categoriesQuery = query(collection(db, 'categories'), orderBy('name'));
    const unsubscribeCategories = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        console.log('📂 usePastries: Categories loaded:', categoriesData.length);
        setCategories(categoriesData);
      },
      (error) => {
        console.error('❌ usePastries: Categories error:', error);
        setError('Error al cargar las categorías');
      }
    );

    // Set up pastries listener based on options and user role
    let pastriesQuery;
    
    if (options.businessId) {
      // Specific business pastries (for business menu page)
      console.log('🏪 usePastries: Setting up query for specific businessId:', options.businessId);
      pastriesQuery = query(
        collection(db, 'pastries'),
        where('businessId', '==', options.businessId),
        orderBy('createdAt', 'desc')
      );
    } else if (user?.role === 'admin') {
      // Admin users: only their business pastries
      console.log('👨‍💼 usePastries: Setting up admin query for businessId:', user.businessId);
      pastriesQuery = query(
        collection(db, 'pastries'),
        where('businessId', '==', user.businessId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Regular users: all pastries (marketplace view)
      console.log('👤 usePastries: Setting up user query for all pastries');
      pastriesQuery = query(
        collection(db, 'pastries'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribePastries = onSnapshot(
      pastriesQuery,
      (snapshot) => {
        const pastriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Pastry[];
        
        console.log(`🥐 usePastries: Pastries loaded:`, {
          count: pastriesData.length,
          businessId: options.businessId || (user?.role === 'admin' ? user.businessId : 'all')
        });
        
        setAllPastries(pastriesData);
        setLoading(false);
      },
      (error) => {
        console.error('❌ usePastries: Pastries error:', error);
        setError('Error al cargar los postres');
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      console.log('🧹 usePastries: Cleaning up listeners');
      unsubscribeCategories();
      unsubscribePastries();
    };
  }, [user, logout, options.businessId]);

  // Apply filters and sorting using useMemo for performance
  const filteredAndSortedPastries = useMemo(() => {
    console.log('🔍 usePastries: Applying filters and sorting', { filters, sort });
    
    let filtered = [...allPastries];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pastry => {
        // Check name (highest priority)
        if (pastry.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Check tags
        if (pastry.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        // Check description (lowest priority)
        if (pastry.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        return false;
      });
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(pastry => pastry.categoryId === filters.category);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    
    console.log(`✅ usePastries: Filtered ${allPastries.length} → ${filtered.length} pastries`);
    return filtered;
  }, [allPastries, filters, sort]);

  return {
    pastries: filteredAndSortedPastries,
    allPastries, // Expose raw data for statistics
    categories,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  };
};