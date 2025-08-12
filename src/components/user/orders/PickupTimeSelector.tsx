// src/components/user/orders/PickupTimeSelector.tsx - Enhanced version
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  calculateOrderSchedule, 
  generateTimeSlots,
  OrderSettings, 
  BusinessHours,
  OrderScheduleResult 
} from '../../../utils/orderScheduler';

interface PickupTimeSelectorProps {
  businessHours: BusinessHours;
  orderSettings: OrderSettings;
  onTimeSelected: (time: Date, scheduleInfo: OrderScheduleResult) => void;
  selectedTime?: Date;
  orderTime?: Date;
  className?: string;
}

interface TimeSlot {
  time: Date;
  available: boolean;
  label: string;
  isPriority?: boolean;
}

const PickupTimeSelector: React.FC<PickupTimeSelectorProps> = ({
  businessHours,
  orderSettings,
  onTimeSelected,
  selectedTime,
  orderTime = new Date(),
  className = ''
}) => {
  const [scheduleResult, setScheduleResult] = useState<OrderScheduleResult | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showAllSlots, setShowAllSlots] = useState(false);

  useEffect(() => {
    // Calculate order schedule
    const result = calculateOrderSchedule(orderTime, businessHours, orderSettings);
    setScheduleResult(result);

    // Generate time slots
    const slots = result.availableTimeSlots.map(time => ({
      time,
      available: true,
      label: format(time, 'HH:mm', { locale: es }),
      isPriority: result.isMorningPriority && time <= result.suggestedCompletionTime
    }));

    setTimeSlots(slots);
  }, [orderTime, businessHours, orderSettings]);

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available && scheduleResult) {
      onTimeSelected(timeSlot.time, scheduleResult);
    }
  };

  const getStatusMessage = () => {
    if (!scheduleResult) return '';

    if (scheduleResult.isScheduledForNextDay) {
      return '📅 Tu pedido será procesado mañana durante el horario comercial';
    }
    if (scheduleResult.isMorningPriority) {
      return '⭐ ¡Pedido prioritario! Procesamiento más rápido disponible';
    }
    if (scheduleResult.isQueuedOrder) {
      return '⏰ Tu pedido se agregará a la cola de procesamiento';
    }
    return '✅ Horario normal de procesamiento';
  };

  const getStatusColor = () => {
    if (!scheduleResult) return 'bg-gray-50 text-gray-700';

    if (scheduleResult.isScheduledForNextDay) {
      return 'bg-blue-50 text-blue-700';
    }
    if (scheduleResult.isMorningPriority) {
      return 'bg-green-50 text-green-700';
    }
    if (scheduleResult.isQueuedOrder) {
      return 'bg-orange-50 text-orange-700';
    }
    return 'bg-blue-50 text-blue-700';
  };

  const visibleSlots = showAllSlots ? timeSlots : timeSlots.slice(0, 6);

  if (!scheduleResult) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Status Message */}
      <div className={`p-3 rounded-lg mb-4 ${getStatusColor()}`}>
        <p className="text-sm font-medium">{getStatusMessage()}</p>
        <p className="text-xs mt-1">{scheduleResult.message}</p>
      </div>

      {/* Suggested Time */}
      {scheduleResult.suggestedCompletionTime && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline-block w-4 h-4 mr-1" />
            Tiempo Sugerido
          </label>
          <button
            onClick={() => handleTimeSelect({
              time: scheduleResult.suggestedCompletionTime,
              available: true,
              label: format(scheduleResult.suggestedCompletionTime, 'HH:mm', { locale: es })
            })}
            className={`w-full p-3 text-left rounded-lg border transition-colors ${
              selectedTime?.getTime() === scheduleResult.suggestedCompletionTime.getTime()
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {format(scheduleResult.suggestedCompletionTime, 'EEEE, d MMMM \'a las\' HH:mm', { locale: es })}
              </span>
              {scheduleResult.isMorningPriority && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Prioritario
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Available Time Slots */}
      {timeSlots.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Otros Horarios Disponibles
          </label>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {visibleSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.available}
                className={`p-2 text-sm rounded-lg border transition-colors relative ${
                  selectedTime?.getTime() === slot.time.getTime()
                    ? 'bg-blue-500 text-white border-blue-500'
                    : slot.available
                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                {slot.label}
                {slot.isPriority && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {timeSlots.length > 6 && (
            <button
              onClick={() => setShowAllSlots(!showAllSlots)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showAllSlots 
                ? 'Ver menos horarios' 
                : `Ver ${timeSlots.length - 6} horarios más`
              }
            </button>
          )}
        </div>
      )}

      {/* No slots available */}
      {timeSlots.length === 0 && (
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            No hay horarios disponibles para hoy.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tu pedido será programado para el siguiente día hábil.
          </p>
        </div>
      )}

      {/* Selected time confirmation */}
      {selectedTime && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Horario seleccionado
              </p>
              <p className="text-sm text-green-700">
                {format(selectedTime, 'EEEE, d MMMM \'a las\' HH:mm', { locale: es })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Information note */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          * Los horarios son estimados. Te notificaremos si hay cambios.
        </p>
        {scheduleResult.isMorningPriority && (
          <p className="text-green-600 font-medium">
            * Tu pedido tiene prioridad matutina y será procesado más rápido.
          </p>
        )}
      </div>
    </div>
  );
};

export default PickupTimeSelector;