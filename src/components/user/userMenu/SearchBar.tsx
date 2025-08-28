// src/components/user/userMenu/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue: string;
}

const SearchBar = ({ onSearch, initialValue }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate" />
      </div>
      <input
        type="text"
        className="input-base pl-12"
        placeholder="Buscar pasteles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;