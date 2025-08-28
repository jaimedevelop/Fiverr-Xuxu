// src/components/admin/analytics/TimeRangeSelector.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { TimeRange } from '../../../types/analytics';
import { getButtonClass } from '../../../utils/themeHelper';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange & { label?: string };
  onChange: (range: TimeRange & { label?: string }) => void;
  className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  selectedRange, 
  onChange, 
  className = '' 
}) => {
  const [internalValue, setInternalValue] = useState('today');
  
  // Update internal value when selectedRange changes
  useEffect(() => {
    if (selectedRange?.label) {
      // Find the option value that matches the label
      const option = timeRangeOptions.find(opt => opt.label === selectedRange.label);
      if (option) {
        setInternalValue(option.value);
      }
    }
  }, [selectedRange]);

  const timeRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'thisWeek', label: 'Esta semana' },
    { value: 'lastWeek', label: 'Semana pasada' },
    { value: 'thisMonth', label: 'Este mes' },
    { value: 'lastMonth', label: 'Mes pasado' },
    { value: 'thisQuarter', label: 'Este trimestre' },
    { value: 'lastQuarter', label: 'Trimestre pasado' },
    { value: 'thisYear', label: 'Este año' },
    { value: 'lastYear', label: 'Año pasado' },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInternalValue(value);
    
    const option = timeRangeOptions.find(opt => opt.value === value);
    if (option) {
      // Calculate the actual date range based on the selected option
      const today = new Date();
      let start = new Date();
      let end = new Date();
      
      switch (option.value) {
        case 'today':
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'yesterday':
          start.setDate(today.getDate() - 1);
          start.setHours(0, 0, 0, 0);
          end.setDate(today.getDate() - 1);
          end.setHours(23, 59, 59, 999);
          break;
        case 'thisWeek':
          const dayOfWeek = today.getDay();
          start.setDate(today.getDate() - dayOfWeek);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'lastWeek':
          const lastWeekStart = new Date(today);
          lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
          start = new Date(lastWeekStart);
          start.setHours(0, 0, 0, 0);
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case 'thisMonth':
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'lastMonth':
          start.setMonth(today.getMonth() - 1);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(today.getMonth() - 1);
          end.setDate(new Date(today.getFullYear(), today.getMonth(), 0).getDate());
          end.setHours(23, 59, 59, 999);
          break;
        case 'thisQuarter':
          const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
          start.setMonth(quarterStartMonth);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(quarterStartMonth + 3);
          end.setDate(0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'lastQuarter':
          const lastQuarterStartMonth = Math.floor(today.getMonth() / 3) * 3 - 3;
          start.setMonth(lastQuarterStartMonth);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(lastQuarterStartMonth + 3);
          end.setDate(0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'thisYear':
          start.setMonth(0);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'lastYear':
          start.setFullYear(today.getFullYear() - 1);
          start.setMonth(0);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setFullYear(today.getFullYear() - 1);
          end.setMonth(11);
          end.setDate(31);
          end.setHours(23, 59, 59, 999);
          break;
      }
      
      onChange({
        start,
        end,
        label: option.label
      });
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <select
          value={internalValue}
          onChange={handleSelectChange}
          className="input-base w-56 pr-10 appearance-none font-medium"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSelector;