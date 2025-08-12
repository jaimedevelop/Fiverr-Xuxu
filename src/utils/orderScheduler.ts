// src/utils/orderScheduler.ts
import { format, addDays, setHours, setMinutes, isAfter, isBefore, isWithinInterval, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export interface OrderSettings {
  cutoffTime: string; // e.g., "17:00" for 5pm
  morningOrderDeadline: string; // e.g., "12:00" for 12pm  
  sameDayCompletionHour: string; // e.g., "15:00" for 3pm
  enableOrderQueue: boolean;
  defaultQueueDelay: number; // in minutes
  minOrderAdvanceTime: number; // minimum minutes ahead for scheduling
}

export interface BusinessHours {
  monday: { isOpen: boolean; openTime: string; closeTime: string };
  tuesday: { isOpen: boolean; openTime: string; closeTime: string };
  wednesday: { isOpen: boolean; openTime: string; closeTime: string };
  thursday: { isOpen: boolean; openTime: string; closeTime: string };
  friday: { isOpen: boolean; openTime: string; closeTime: string };
  saturday: { isOpen: boolean; openTime: string; closeTime: string };
  sunday: { isOpen: boolean; openTime: string; closeTime: string };
}

export interface OrderScheduleResult {
  isScheduledForNextDay: boolean;
  isMorningPriority: boolean;
  isQueuedOrder: boolean;
  suggestedCompletionTime: Date;
  availableTimeSlots: Date[];
  message: string;
}

export const DEFAULT_ORDER_SETTINGS: OrderSettings = {
  cutoffTime: "17:00",
  morningOrderDeadline: "12:00",
  sameDayCompletionHour: "15:00",
  enableOrderQueue: true,
  defaultQueueDelay: 60,
  minOrderAdvanceTime: 30
};

/**
 * Converts time string (HH:mm) to Date object for today
 */
export const timeStringToDate = (timeString: string, baseDate: Date = new Date()): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Gets the day of week key for BusinessHours
 */
export const getDayKey = (date: Date): keyof BusinessHours => {
  const days: (keyof BusinessHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

/**
 * Checks if business is open at given time
 */
export const isBusinessOpen = (checkTime: Date, businessHours: BusinessHours): boolean => {
  const dayKey = getDayKey(checkTime);
  const dayHours = businessHours[dayKey];
  
  if (!dayHours.isOpen) return false;
  
  const openTime = timeStringToDate(dayHours.openTime, checkTime);
  const closeTime = timeStringToDate(dayHours.closeTime, checkTime);
  
  return isWithinInterval(checkTime, { start: openTime, end: closeTime });
};

/**
 * Gets next business day
 */
export const getNextBusinessDay = (startDate: Date, businessHours: BusinessHours): Date => {
  let checkDate = addDays(startDate, 1);
  let attempts = 0;
  
  while (attempts < 7) { // Check up to 7 days ahead
    const dayKey = getDayKey(checkDate);
    if (businessHours[dayKey].isOpen) {
      return checkDate;
    }
    checkDate = addDays(checkDate, 1);
    attempts++;
  }
  
  // Fallback to tomorrow if no business days found
  return addDays(startDate, 1);
};

/**
 * Main function to determine order scheduling
 */
export const calculateOrderSchedule = (
  orderTime: Date,
  businessHours: BusinessHours,
  orderSettings: OrderSettings
): OrderScheduleResult => {
  const cutoffTime = timeStringToDate(orderSettings.cutoffTime, orderTime);
  const morningDeadline = timeStringToDate(orderSettings.morningOrderDeadline, orderTime);
  const sameDayCompletionTime = timeStringToDate(orderSettings.sameDayCompletionHour, orderTime);
  
  const isBusinessCurrentlyOpen = isBusinessOpen(orderTime, businessHours);
  const isAfterCutoff = isAfter(orderTime, cutoffTime);
  const isMorningOrder = isBefore(orderTime, morningDeadline) && isBusinessCurrentlyOpen;
  
  let result: OrderScheduleResult = {
    isScheduledForNextDay: false,
    isMorningPriority: false,
    isQueuedOrder: false,
    suggestedCompletionTime: new Date(),
    availableTimeSlots: [],
    message: ""
  };

  // Rule 1: After cutoff time (5pm) - schedule for next day
  if (isAfterCutoff || !isBusinessCurrentlyOpen) {
    const nextBusinessDay = getNextBusinessDay(orderTime, businessHours);
    const nextDayKey = getDayKey(nextBusinessDay);
    const nextDayOpenTime = timeStringToDate(businessHours[nextDayKey].openTime, nextBusinessDay);
    
    result.isScheduledForNextDay = true;
    result.suggestedCompletionTime = addDays(nextDayOpenTime, 0);
    result.availableTimeSlots = generateTimeSlots(nextBusinessDay, businessHours, orderSettings);
    result.message = `Tu pedido será procesado mañana. Horario disponible desde las ${format(nextDayOpenTime, 'HH:mm', { locale: es })}.`;
    
    if (orderSettings.enableOrderQueue) {
      result.isQueuedOrder = true;
    }
    
    return result;
  }

  // Rule 2: Morning priority orders (9am-12pm) - ready until X hour
  if (isMorningOrder) {
    result.isMorningPriority = true;
    result.suggestedCompletionTime = sameDayCompletionTime;
    result.availableTimeSlots = generateTimeSlots(orderTime, businessHours, orderSettings, sameDayCompletionTime);
    result.message = `¡Pedido prioritario! Puede estar listo hasta las ${format(sameDayCompletionTime, 'HH:mm', { locale: es })} hoy.`;
    return result;
  }

  // Rule 3: Regular business hours - standard processing
  if (isBusinessCurrentlyOpen) {
    const standardCompletionTime = new Date(orderTime.getTime() + (orderSettings.defaultQueueDelay * 60000));
    result.suggestedCompletionTime = standardCompletionTime;
    result.availableTimeSlots = generateTimeSlots(orderTime, businessHours, orderSettings);
    result.message = `Tu pedido estará listo en aproximadamente ${orderSettings.defaultQueueDelay} minutos.`;
    return result;
  }

  // Rule 4: Outside business hours - queue for next available time
  if (orderSettings.enableOrderQueue) {
    const nextBusinessDay = getNextBusinessDay(orderTime, businessHours);
    result.isQueuedOrder = true;
    result.isScheduledForNextDay = true;
    result.availableTimeSlots = generateTimeSlots(nextBusinessDay, businessHours, orderSettings);
    result.message = "Estamos cerrados. Tu pedido será procesado en el próximo día hábil.";
    return result;
  }

  return result;
};

/**
 * Generates available time slots for pickup/delivery
 */
export const generateTimeSlots = (
  date: Date,
  businessHours: BusinessHours,
  orderSettings: OrderSettings,
  maxTime?: Date
): Date[] => {
  const dayKey = getDayKey(date);
  const dayHours = businessHours[dayKey];
  
  if (!dayHours.isOpen) return [];
  
  const slots: Date[] = [];
  const startTime = timeStringToDate(dayHours.openTime, date);
  const endTime = maxTime || timeStringToDate(dayHours.closeTime, date);
  const minAdvanceTime = new Date(date.getTime() + (orderSettings.minOrderAdvanceTime * 60000));
  
  // Generate 30-minute intervals
  let currentSlot = new Date(Math.max(startTime.getTime(), minAdvanceTime.getTime()));
  
  // Round up to next 30-minute mark
  const minutes = currentSlot.getMinutes();
  if (minutes % 30 !== 0) {
    currentSlot.setMinutes(minutes < 30 ? 30 : 60);
  }
  currentSlot.setSeconds(0, 0);
  
  while (isBefore(currentSlot, endTime)) {
    slots.push(new Date(currentSlot));
    currentSlot = new Date(currentSlot.getTime() + (30 * 60000)); // Add 30 minutes
  }
  
  return slots;
};

/**
 * Formats order schedule information for display
 */
export const formatOrderScheduleInfo = (result: OrderScheduleResult): string => {
  let info = result.message;
  
  if (result.isScheduledForNextDay) {
    info += " Puedes elegir una hora específica para recoger o recibir tu pedido.";
  }
  
  if (result.isMorningPriority) {
    info += " ¡Tu pedido tiene prioridad de la mañana!";
  }
  
  if (result.isQueuedOrder) {
    info += " Tu pedido se agregó a la cola y será procesado en orden.";
  }
  
  return info;
};

/**
 * Validates if a selected time slot is available
 */
export const isTimeSlotAvailable = (
  selectedTime: Date,
  orderTime: Date,
  businessHours: BusinessHours,
  orderSettings: OrderSettings
): boolean => {
  const schedule = calculateOrderSchedule(orderTime, businessHours, orderSettings);
  return schedule.availableTimeSlots.some(slot => 
    slot.getTime() === selectedTime.getTime()
  );
};