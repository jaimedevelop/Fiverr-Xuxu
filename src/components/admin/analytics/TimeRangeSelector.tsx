import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { TimeRange } from '../../../types/analytics';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

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

  const handleCustomRange = () => {
    // In a real implementation, this would open a date picker modal
    // For now, we'll just set a default custom range
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    onChange({
      start: lastWeek,
      end: today,
      label: 'Personalizado'
    } as TimeRange & { label: string });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Select
          value={selectedRange.label || 'today'}
          onChange={(e) => {
            const option = timeRangeOptions.find(opt => opt.value === e.target.value);
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
              } as TimeRange & { label: string });
            }
          }}
          options={timeRangeOptions}
          className="w-48 pr-10 appearance-none"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={handleCustomRange}
        className="flex items-center"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Personalizado
      </Button>
    </div>
  );
};

export default TimeRangeSelector;