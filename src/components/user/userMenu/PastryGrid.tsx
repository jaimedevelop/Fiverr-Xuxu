// src/components/user/userMenu/PastryGrid.tsx
import React from 'react';
import { Pastry } from '../../../types/pastry';
import PastryCard from './PastryCard';

interface PastryGridProps {
  pastries: Pastry[];
  onPastryClick: (pastry: Pastry) => void;
}

const PastryGrid = ({ pastries, onPastryClick }: PastryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pastries.map((pastry) => (
        <PastryCard
          key={pastry.id}
          pastry={pastry}
          onClick={() => onPastryClick(pastry)}
        />
      ))}
    </div>
  );
};

export default PastryGrid;