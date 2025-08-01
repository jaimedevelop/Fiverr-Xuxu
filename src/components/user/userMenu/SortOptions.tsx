import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortOptionsProps {
  currentSort: string;
  onSortChange: (sortOption: string) => void;
}

const SortOptions = ({ currentSort, onSortChange }: SortOptionsProps) => {
  const sortOptions = [
    { id: 'newest', label: 'Más Nuevo' },
    { id: 'oldest', label: 'Más Antiguo' },
    { id: 'name-asc', label: 'Nombre A-Z' },
    { id: 'name-desc', label: 'Nombre Z-A' },
    { id: 'price-high', label: 'Precio Mayor-Menor' },
    { id: 'price-low', label: 'Precio Menor-Mayor' },
  ];

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default SortOptions;