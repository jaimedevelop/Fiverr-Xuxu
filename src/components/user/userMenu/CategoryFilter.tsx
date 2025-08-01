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
      <span className="mr-3 text-sm font-medium text-gray-700 whitespace-nowrap">Categorías:</span>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              selectedCategory === category.id
                ? 'text-white'
                : 'text-gray-800 hover:bg-gray-300'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : '#E5E7EB',
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