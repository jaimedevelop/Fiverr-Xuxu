// src/hooks/useOperatingHours.ts
import { useState } from 'react';
import { OperatingHours, DayHours } from '../types/business';

const defaultDayHours: DayHours = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '17:00'
};

const defaultOperatingHours: OperatingHours = {
  monday: { ...defaultDayHours },
  tuesday: { ...defaultDayHours },
  wednesday: { ...defaultDayHours },
  thursday: { ...defaultDayHours },
  friday: { ...defaultDayHours },
  saturday: { isOpen: false, ...defaultDayHours },
  sunday: { isOpen: false, ...defaultDayHours }
};

export const useOperatingHours = (initialHours: OperatingHours = defaultOperatingHours) => {
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(initialHours);

  const updateDayHours = (day: keyof OperatingHours, dayHours: DayHours) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: dayHours
    }));
  };

  const toggleDayStatus = (day: keyof OperatingHours) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const copyToAllDays = (sourceDay: keyof OperatingHours) => {
    const sourceHours = operatingHours[sourceDay];
    const updatedHours = { ...operatingHours };
    
    Object.keys(updatedHours).forEach(day => {
      if (day !== sourceDay) {
        updatedHours[day as keyof OperatingHours] = { ...sourceHours };
      }
    });
    
    setOperatingHours(updatedHours);
  };

  return {
    operatingHours,
    updateDayHours,
    toggleDayStatus,
    copyToAllDays
  };
};