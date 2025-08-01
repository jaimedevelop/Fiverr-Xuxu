import React from 'react';

interface ClosedDayToggleProps {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
}

const ClosedDayToggle = ({ isOpen, onChange }: ClosedDayToggleProps) => {
  return (
    <div className="mr-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={(e) => onChange(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600 rounded"
        />
        <span className="ml-2 text-sm text-gray-700">
          {isOpen ? 'Abierto' : 'Cerrado'}
        </span>
      </label>
    </div>
  );
};

export default ClosedDayToggle;