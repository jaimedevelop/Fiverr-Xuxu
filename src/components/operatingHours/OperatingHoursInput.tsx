// src/components/operatingHours/OperatingHoursInput.tsx
import React from 'react';
import { useOperatingHours } from '../../hooks/useOperatingHours';
import DayHoursSelector from './DayHoursSelector';
import ClosedDayToggle from './ClosedDayToggle';

interface OperatingHoursInputProps {
  operatingHours?: any;
  onChange: (operatingHours: any) => void;
}

const OperatingHoursInput = ({ 
  operatingHours: propOperatingHours, 
  onChange 
}: OperatingHoursInputProps) => {
  const { operatingHours, updateDayHours, toggleDayStatus, copyToAllDays } = useOperatingHours(propOperatingHours);

  // Sync with parent component when operating hours change
  React.useEffect(() => {
    if (propOperatingHours !== operatingHours) {
      onChange(operatingHours);
    }
  }, [operatingHours, onChange, propOperatingHours]);

  const daysOfWeek = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => copyToAllDays('monday')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Copiar horario de lunes a todos los días
        </button>
      </div>
      
      <div className="space-y-3">
        {daysOfWeek.map(day => (
          <div key={day.id} className="flex items-center">
            <div className="w-24 text-sm font-medium text-gray-700">
              {day.name}
            </div>
            
            <div className="flex-1 flex items-center">
              <ClosedDayToggle
                isOpen={operatingHours[day.id as keyof typeof operatingHours].isOpen}
                onChange={(isOpen) => {
                  toggleDayStatus(day.id as keyof typeof operatingHours);
                }}
              />
              
              {operatingHours[day.id as keyof typeof operatingHours].isOpen && (
                <DayHoursSelector
                  dayHours={operatingHours[day.id as keyof typeof operatingHours]}
                  onChange={(dayHours) => {
                    updateDayHours(day.id as keyof typeof operatingHours, dayHours);
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatingHoursInput;