import React from 'react';
import { DayHours } from '../../types/business';

interface DayHoursSelectorProps {
  dayHours: DayHours;
  onChange: (dayHours: DayHours) => void;
}

const DayHoursSelector = ({ dayHours, onChange }: DayHoursSelectorProps) => {
  const handleTimeChange = (field: 'openTime' | 'closeTime', value: string) => {
    onChange({
      ...dayHours,
      [field]: value
    });
  };

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex items-center space-x-2">
      <select
        value={dayHours.openTime}
        onChange={(e) => handleTimeChange('openTime', e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {timeOptions.map(time => (
          <option key={`open-${time}`} value={time}>
            {time}
          </option>
        ))}
      </select>
      
      <span className="text-gray-500">a</span>
      
      <select
        value={dayHours.closeTime}
        onChange={(e) => handleTimeChange('closeTime', e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {timeOptions.map(time => (
          <option key={`close-${time}`} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DayHoursSelector;