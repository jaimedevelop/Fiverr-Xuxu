// src/utils/businessHours.ts
import { OperatingHours, DayHours } from '../types/business';

export interface BusinessStatus {
  isOpen: boolean;
  statusText: string;
  nextChange?: {
    time: string;
    action: 'opens' | 'closes';
  };
}

/**
 * Get the current day of week in Spanish
 */
export const getCurrentDayKey = (): keyof OperatingHours => {
  const days: (keyof OperatingHours)[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday'
  ];
  return days[new Date().getDay()];
};

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Get current time in minutes since midnight
 */
export const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Check if business is currently open
 */
export const getBusinessStatus = (operatingHours: OperatingHours): BusinessStatus => {
  const currentDayKey = getCurrentDayKey();
  const currentTimeMinutes = getCurrentTimeInMinutes();
  const todayHours = operatingHours[currentDayKey];

  // If business is closed today
  if (!todayHours.isOpen) {
    return {
      isOpen: false,
      statusText: 'Cerrado hoy',
      nextChange: getNextOpenTime(operatingHours)
    };
  }

  const openTime = timeToMinutes(todayHours.openTime);
  const closeTime = timeToMinutes(todayHours.closeTime);

  // Handle overnight hours (e.g., 22:00 - 02:00)
  const isOvernightHours = closeTime < openTime;

  let isCurrentlyOpen = false;

  if (isOvernightHours) {
    // Business is open if current time is after opening OR before closing
    isCurrentlyOpen = currentTimeMinutes >= openTime || currentTimeMinutes < closeTime;
  } else {
    // Normal hours: business is open if current time is between open and close
    isCurrentlyOpen = currentTimeMinutes >= openTime && currentTimeMinutes < closeTime;
  }

  if (isCurrentlyOpen) {
    return {
      isOpen: true,
      statusText: `Abierto hasta ${todayHours.closeTime}`,
      nextChange: {
        time: todayHours.closeTime,
        action: 'closes'
      }
    };
  } else {
    // Business is closed, find next opening time
    const nextOpen = getNextOpenTime(operatingHours);
    
    if (currentTimeMinutes < openTime) {
      // Business opens later today
      return {
        isOpen: false,
        statusText: `Cerrado - Abre a las ${todayHours.openTime}`,
        nextChange: {
          time: todayHours.openTime,
          action: 'opens'
        }
      };
    } else {
      // Business closed for the day
      return {
        isOpen: false,
        statusText: nextOpen ? `Cerrado - Abre ${nextOpen.time}` : 'Cerrado',
        nextChange: nextOpen
      };
    }
  }
};

/**
 * Find the next time the business opens
 */
export const getNextOpenTime = (operatingHours: OperatingHours): { time: string; action: 'opens' } | undefined => {
  const days: (keyof OperatingHours)[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday'
  ];
  
  const currentDay = new Date().getDay();
  
  // Check next 7 days starting from tomorrow
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (currentDay + i) % 7;
    const dayKey = days[dayIndex];
    const dayHours = operatingHours[dayKey];
    
    if (dayHours.isOpen) {
      const dayNames = [
        'domingo', 'lunes', 'martes', 'miércoles',
        'jueves', 'viernes', 'sábado'
      ];
      
      const dayName = i === 1 ? 'mañana' : dayNames[dayIndex];
      return {
        time: `${dayName} a las ${dayHours.openTime}`,
        action: 'opens'
      };
    }
  }
  
  return undefined; // Business never opens (shouldn't happen in practice)
};

/**
 * Get a formatted display of business hours for a specific day
 */
export const formatDayHours = (dayHours: DayHours): string => {
  if (!dayHours.isOpen) {
    return 'Cerrado';
  }
  return `${dayHours.openTime} - ${dayHours.closeTime}`;
};

/**
 * Get a summary of weekly operating hours
 */
export const getWeeklyHoursSummary = (operatingHours: OperatingHours): string => {
  const days = [
    { key: 'monday' as const, name: 'Lun' },
    { key: 'tuesday' as const, name: 'Mar' },
    { key: 'wednesday' as const, name: 'Mié' },
    { key: 'thursday' as const, name: 'Jue' },
    { key: 'friday' as const, name: 'Vie' },
    { key: 'saturday' as const, name: 'Sáb' },
    { key: 'sunday' as const, name: 'Dom' }
  ];

  const openDays = days.filter(day => operatingHours[day.key].isOpen);
  
  if (openDays.length === 0) {
    return 'Cerrado toda la semana';
  }
  
  if (openDays.length === 7) {
    const firstDay = operatingHours[openDays[0].key];
    const allSameHours = openDays.every(day => {
      const dayHours = operatingHours[day.key];
      return dayHours.openTime === firstDay.openTime && dayHours.closeTime === firstDay.closeTime;
    });
    
    if (allSameHours) {
      return `Todos los días ${firstDay.openTime} - ${firstDay.closeTime}`;
    }
  }

  // Return a simplified format showing the range of days open
  return `${openDays[0].name} - ${openDays[openDays.length - 1].name}`;
};