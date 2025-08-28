import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { format, addMinutes, isToday, isTomorrow, startOfHour, addHours } from 'date-fns';
import { es } from 'date-fns/locale';

// Updated interface to match what OrderModal is passing
interface PickupTimeSelectorProps {
  operatingHours: any; // Business operating hours from context
  selectedPickupTime: PickupTimeSlot | null;
  onPickupTimeSelect: (time: PickupTimeSlot) => void;
  error?: string;
}

// Define PickupTimeSlot type to match OrderModal expectations
interface PickupTimeSlot {
  datetime: Date;
  displayTime: string;
  isToday: boolean;
  estimatedPreparationTime: number;
}

interface TimeSlot {
  time: Date;
  available: boolean;
  label: string;
  displayDate: string;
  isRecommended?: boolean;
}

const PickupTimeSelector: React.FC<PickupTimeSelectorProps> = ({
  operatingHours,
  selectedPickupTime,
  onPickupTimeSelect,
  error
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showAllSlots, setShowAllSlots] = useState(false);

  useEffect(() => {
    generateTimeSlots();
  }, [operatingHours]);

  const generateTimeSlots = () => {
    const now = new Date();
    const slots: TimeSlot[] = [];
    
    // Get current time + preparation buffer (30 minutes minimum)
    const earliestPickup = addMinutes(now, 30);
    
    // Generate slots for today if still within business hours
    const todaySlots = generateSlotsForDate(now, earliestPickup);
    slots.push(...todaySlots);
    
    // Generate slots for tomorrow
    const tomorrow = addHours(now, 24);
    const tomorrowSlots = generateSlotsForDate(tomorrow, startOfHour(tomorrow));
    slots.push(...tomorrowSlots);
    
    setTimeSlots(slots);
  };

  const generateSlotsForDate = (date: Date, earliestTime: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    // Default business hours if operatingHours is not available
    const defaultHours = {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: true }
    };
    
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase() as keyof typeof defaultHours;
    const businessHours = operatingHours?.[dayName] || defaultHours[dayName];
    
    if (!businessHours?.isOpen) {
      return slots;
    }
    
    // Parse business hours
    const [openHour, openMin] = businessHours.open.split(':').map(Number);
    const [closeHour, closeMin] = businessHours.close.split(':').map(Number);
    
    const openTime = new Date(date);
    openTime.setHours(openHour, openMin, 0, 0);
    
    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMin, 0, 0);
    
    // Start from either business opening or earliest pickup time
    let currentTime = new Date(Math.max(openTime.getTime(), earliestTime.getTime()));
    
    // Round up to next 30-minute interval
    const minutes = currentTime.getMinutes();
    if (minutes % 30 !== 0) {
      currentTime.setMinutes(minutes < 30 ? 30 : 60, 0, 0);
    }
    
    // Generate 30-minute intervals until close time (minus 1 hour for preparation)
    const lastPickupTime = addMinutes(closeTime, -60);
    
    while (currentTime <= lastPickupTime) {
      const isRecommended = isToday(currentTime) && 
        currentTime.getTime() === addMinutes(earliestTime, 30).getTime();
      
      slots.push({
        time: new Date(currentTime),
        available: true,
        label: format(currentTime, 'HH:mm'),
        displayDate: isToday(currentTime) ? 'Hoy' : isTomorrow(currentTime) ? 'Mañana' : format(currentTime, 'dd/MM'),
        isRecommended
      });
      
      currentTime = addMinutes(currentTime, 30);
    }
    
    return slots;
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;
    
    const pickupTimeSlot = {
      datetime: timeSlot.time,
      displayTime: `${timeSlot.displayDate} a las ${timeSlot.label}`,
      isToday: timeSlot.displayDate === 'Hoy',
      estimatedPreparationTime: 30
    };
    
    console.log('PickupTimeSelector: handleTimeSelect called with:', pickupTimeSlot);
    onPickupTimeSelect(pickupTimeSlot);
  };

  const visibleSlots = showAllSlots ? timeSlots : timeSlots.slice(0, 8);
  const hasMoreSlots = timeSlots.length > 8;

  return (
    <div className="space-y-4">
      {/* Information banner */}
      <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-4">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-saffron-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-orange-800">
            <p className="font-semibold">Selecciona tu horario de recogida</p>
            <p className="text-orange-700 mt-1">
              Preparamos tu pedido con 30 minutos de anticipación mínimo
            </p>
          </div>
        </div>
      </div>

      {/* Time slots grid */}
      {timeSlots.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {visibleSlots.map((slot, index) => {
              const isSelected = selectedPickupTime?.datetime.getTime() === slot.time.getTime();
              
              return (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 relative transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-saffron text-orange-900 border-saffron-500 shadow-saffron'
                      : slot.available
                      ? 'bg-white/90 text-gray-700 border-gray-200 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-orange-50 hover:border-saffron-300 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{slot.label}</div>
                    <div className={`text-xs mt-1 ${
                      isSelected ? 'text-orange-700' : 'text-gray-500'
                    }`}>
                      {slot.displayDate}
                    </div>
                  </div>
                  
                  {slot.isRecommended && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                  )}
                </button>
              );
            })}
          </div>

          {hasMoreSlots && (
            <div className="text-center">
              <button
                onClick={() => setShowAllSlots(!showAllSlots)}
                className="text-sm text-saffron-600 hover:text-saffron-800 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-saffron-50"
              >
                {showAllSlots 
                  ? 'Ver menos horarios' 
                  : `Ver ${timeSlots.length - 8} horarios más`
                }
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600 font-semibold mb-2">
            No hay horarios disponibles
          </p>
          <p className="text-xs text-gray-500">
            El negocio está cerrado o fuera del horario de servicio
          </p>
        </div>
      )}

      {/* Selected time confirmation */}
      {selectedPickupTime && (
        <div className="bg-gradient-to-r from-emerald-50 to-mint-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Horario seleccionado
              </p>
              <p className="text-sm text-emerald-700">
                {selectedPickupTime.displayTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-coral-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
        <p>• Los horarios mostrados son estimados</p>
        <p>• Te notificaremos si hay algún retraso</p>
        <p>• Puedes llamar al negocio si necesitas cambiar el horario</p>
      </div>
    </div>
  );
};

export default PickupTimeSelector;