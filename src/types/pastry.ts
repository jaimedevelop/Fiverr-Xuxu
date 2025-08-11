// src/types/pastry.ts
export interface Pastry {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  available: boolean;
  availabilityMode: 'manual' | 'inventory';
  inventory: number;
  tags: string[];
  businessId: string; 
  createdAt: Date;
  updatedAt: Date;
}

export type SortOption = 'oldest' | 'newest' | 'name-asc' | 'name-desc' | 'price-high' | 'price-low';

export interface FilterOptions {
  search: string;
  category: string | null;
}