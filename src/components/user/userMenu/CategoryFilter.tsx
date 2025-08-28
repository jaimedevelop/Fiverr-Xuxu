// src/components/user/common/CategoryFilter.tsx
import React from 'react';
import { Category } from '../../../types/category';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex items-center">
      <span className="mr-3 text-sm font-medium text-charcoal whitespace-nowrap">Categorías:</span>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-gradient-saffron text-orange-900 shadow-saffron'
              : 'bg-gray-200 text-slate hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap flex items-center transition-all duration-200 shadow-sm hover:shadow-md ${
              selectedCategory === category.id
                ? 'text-white shadow-lg'
                : 'text-charcoal hover:bg-gray-300'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : '#f3f4f6',
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            ></span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;