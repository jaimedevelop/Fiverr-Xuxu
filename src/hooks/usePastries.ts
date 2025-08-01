import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Pastry, FilterOptions, SortOption } from '../types/pastry';
import { Category } from '../types/category';

export const usePastries = () => {
  const [pastries, setPastries] = useState<Pastry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: null,
  });
  const [sort, setSort] = useState<SortOption>('newest');

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'), orderBy('sortOrder'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);

        // Fetch pastries
        const pastriesSnapshot = await getDocs(collection(db, 'pastries'));
        const pastriesData = pastriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Pastry[];
        setPastries(pastriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting
  const filteredPastries = pastries
    .filter(pastry => {
      // Category filter
      if (filters.category && pastry.categoryId !== filters.category) {
        return false;
      }

      // Search filter (priority: name > tag > description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        
        // Check name
        if (pastry.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Check tags
        if (pastry.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        // Check description
        if (pastry.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        return false;
      }

      return true;
    })
    .sort((a, b) => {
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

  return {
    pastries: filteredPastries,
    categories,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
  };
};