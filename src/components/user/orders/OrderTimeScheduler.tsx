// src/components/user/orders/OrderTimeScheduler.tsx - Complete Implementation
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle, Info, MapPin, Phone, Star, ArrowLeft } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../../ui/Button';
import BaseCard from '../../common/BaseCard';
import { 
  calculateOrderSchedule, 
  OrderSettings, 
  BusinessHours,
  OrderScheduleResult,
  generateTimeSlots 
} from '../../../utils/orderScheduler';
import { Business } from '../../../types/business';
import { getButtonClass, colors } from '../../../utils/themeHelper';

interface OrderTimeSchedulerProps {
  business: Business;
  onTimeSelected: (selectedTime: Date, scheduleInfo: OrderScheduleResult) => void;
  onCancel?: () => void;
  orderTime?: Date;
  className?: string;
  fulfillmentType?: 'pickup' | 'delivery';
  orderItems?: Array<{ name: string; quantity: number; price: number }>;
  orderTotal?: number;
}

interface TimeSlot {
  time: Date;
  available: boolean;
  label: string;
  isPriority?: boolean;
  isRecommended?: boolean;
}

const OrderTimeScheduler: React.FC<OrderTimeSchedulerProps> = ({
  business,
  onTimeSelected,
  onCancel,
  orderTime = new Date(),
  className = '',
  fulfillmentType = 'pickup',
  orderItems = [],
  orderTotal = 0
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [scheduleResult, setScheduleResult] = useState<OrderScheduleResult | null>(null);
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate schedule and generate time slots
  useEffect(() => {
    const calculateScheduling = () => {
      setLoading(true);
      
      try {
        // Calculate schedule for the current order time
        const result = calculateOrderSchedule(orderTime, business.operatingHours, business.orderSettings);
        setScheduleResult(result);
        
        // Generate time slots for the selected date
        const slots = generateTimeSlots(selectedDate, business.operatingHours, business.orderSettings);
        
        // Convert to TimeSlot objects with additional metadata
        const processedSlots: TimeSlot[] = slots.map((time, index) => ({
          time,
          available: true,
          label: format(time, 'HH:mm', { locale: es }),
          isPriority: result.isMorningPriority && time <= result.suggestedCompletionTime,
          isRecommended: index === 0 // First slot is recommended
        }));
        
        setTimeSlots(processedSlots);
        
        // Auto-select suggested completion time if available and on same day
        if (result.suggestedCompletionTime && isSameDay(result.suggestedCompletionTime, selectedDate)) {
          setSelectedTime(result.suggestedCompletionTime);
        } else if (processedSlots.length > 0) {
          setSelectedTime(processedSlots[0].time);
        }
        
      } catch (error) {
        console.error('Error calculating schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    
    calculateScheduling();
  }, [orderTime, selectedDate, business.operatingHours, business.orderSettings]);

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      setSelectedTime(timeSlot.time);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };

  // Confirm time selection
  const handleConfirmTime = () => {
    if (selectedTime && scheduleResult) {
      onTimeSelected(selectedTime, scheduleResult);
    }
  };

  // Get available dates for selection
  const getAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    // Add today if there are available slots or queue is enabled
    if (scheduleResult && (scheduleResult.availableTimeSlots.length > 0 || scheduleResult.enableOrderQueue)) {
      dates.push(today);
    }
    
    // Add next 7 days
    for (let i = 1; i <= 7; i++) {
      dates.push(addDays(today, i));
    }
    
    return dates;
  };

  // Get status styling based on schedule result
  const getStatusStyling = () => {
    if (!scheduleResult) return { bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700' };
    
    if (scheduleResult.isScheduledForNextDay) {
      return { bgColor: 'bg-gradient-to-r from-purple-50 to-blue-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' };
    }
    if (scheduleResult.isMorningPriority) {
      return { bgColor: 'bg-gradient-to-r from-emerald-50 to-mint-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700' };
    }
    if (scheduleResult.isQueuedOrder) {
      return { bgColor: 'bg-gradient-to-r from-saffron-50 to-yellow-50', borderColor: 'border-saffron-200', textColor: 'text-saffron-700' };
    }
    return { bgColor: 'bg-gradient-to-r from-saffron-50 to-persian-pink-50', borderColor: 'border-saffron-200', textColor: 'text-saffron-700' };
  };

  // Get schedule status icon
  const getScheduleStatusIcon = () => {
    if (!scheduleResult) return <Clock className="h-5 w-5 text-gray-400" />;
    
    if (scheduleResult.isScheduledForNextDay) {
      return <Calendar className="h-5 w-5 text-purple-600" />;
    }
    if (scheduleResult.isMorningPriority) {
      return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    }
    if (scheduleResult.isQueuedOrder) {
      return <Clock className="h-5 w-5 text-saffron-600" />;
    }
    return <Clock className="h-5 w-5 text-saffron-600" />;
  };

  // Get status message
  const getStatusMessage = () => {
    if (!scheduleResult) return 'Calculando horarios disponibles...';
    
    if (scheduleResult.isScheduledForNextDay) {
      return 'Programado para el siguiente día hábil';
    }
    if (scheduleResult.isMorningPriority) {
      return '¡Pedido prioritario! Procesamiento más rápido';
    }
    if (scheduleResult.isQueuedOrder) {
      return 'Pedido agregado a la cola de procesamiento';
    }
    return 'Procesamiento en horario normal';
  };

  const statusStyling = getStatusStyling();
  const visibleTimeSlots = showAllTimeSlots ? timeSlots : timeSlots.slice(0, 8);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="card-base p-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-6 shadow-saffron animate-pulse">
                <Clock className="h-8 w-8 text-orange-800 animate-spin" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Calculando horarios disponibles...</p>
              <p className="text-sm text-gray-600">Esto tomará solo un momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="card-base p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center mr-3 shadow-saffron">
            <Calendar className="w-5 h-5 text-orange-800" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Programar {fulfillmentType === 'pickup' ? 'Recolección' : 'Entrega'}
          </h2>
        </div>
        
        {/* Business Header */}
        <div className="card-base p-6 mb-8 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {business.logoUrl ? (
                <img 
                  src={business.logoUrl} 
                  alt={business.storeName}
                  className="w-16 h-16 rounded-xl object-cover shadow-brand-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-saffron flex items-center justify-center text-orange-900 font-bold text-lg shadow-saffron">
                  {business.storeName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-700 mb-2">{business.storeName}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4 mr-2 text-persian-pink-500" />
                <span className="truncate">{business.address.street}, {business.address.colonia}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Phone className="h-4 w-4 mr-2 text-emerald-500" />
                <span>{business.phone}</span>
              </div>

              {business.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-saffron-500 fill-current mr-1" />
                  <span className="text-sm font-medium text-gray-700">{business.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({business.totalOrders || 0} pedidos)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Card */}
        <div className={`card-base p-6 mb-8 ${statusStyling.bgColor} border ${statusStyling.borderColor}`}>
          <div className="flex items-start space-x-3">
            {getScheduleStatusIcon()}
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${statusStyling.textColor} mb-2`}>
                {getStatusMessage()}
              </h4>
              <p className={`text-sm ${statusStyling.textColor.replace('700', '600')} mb-3`}>
                {scheduleResult?.message}
              </p>
              
              {scheduleResult?.isMorningPriority && (
                <div className="flex items-center bg-gradient-mint text-emerald-800 px-4 py-2 rounded-full text-sm font-medium w-fit shadow-mint">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Prioridad matutina activa
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Seleccionar Fecha</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getAvailableDates().slice(0, 6).map((date, index) => {
              const isSelected = isSameDay(selectedDate, date);
              const isToday = isSameDay(date, new Date());
              const isTomorrow = isSameDay(date, addDays(new Date(), 1));
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`card-interactive p-4 transition-all duration-300 ${
                    isSelected
                      ? 'border-saffron-400 bg-gradient-saffron text-orange-900 shadow-saffron transform scale-105'
                      : 'hover:border-saffron-300 hover:shadow-brand-lg'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-1 ${isSelected ? 'text-orange-700' : 'text-gray-600'}`}>
                      {isToday ? 'Hoy' : isTomorrow ? 'Mañana' : format(date, 'EEE', { locale: es })}
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-orange-900' : 'text-gray-700'}`}>
                      {format(date, 'd', { locale: es })}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-orange-700' : 'text-gray-500'}`}>
                      {format(date, 'MMM', { locale: es })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Selection */}
        {timeSlots.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Horarios Disponibles</h3>
              {timeSlots.length > 8 && (
                <button
                  onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
                  className={getButtonClass('ghost', 'sm')}
                >
                  {showAllTimeSlots ? 'Ver menos' : `Ver ${timeSlots.length - 8} más`}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {visibleTimeSlots.map((timeSlot, index) => {
                const isSelected = selectedTime?.getTime() === timeSlot.time.getTime();
                
                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                    disabled={!timeSlot.available}
                    className={`relative card-interactive p-4 transition-all duration-300 ${
                      isSelected
                        ? 'border-saffron-400 bg-gradient-saffron text-orange-900 shadow-saffron transform scale-105'
                        : timeSlot.available
                        ? 'hover:border-saffron-300 hover:shadow-brand-lg'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isSelected ? 'text-orange-900' : 'text-gray-700'}`}>
                        {timeSlot.label}
                      </div>
                      
                      {timeSlot.isPriority && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full shadow-mint"></div>
                      )}
                      
                      {timeSlot.isRecommended && !isSelected && (
                        <div className="text-xs text-saffron-600 font-medium mt-1 bg-saffron-100 px-2 py-0.5 rounded-full">
                          Recomendado
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8 card-base p-8 border border-red-200 bg-red-50 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-red-800 mb-3">Sin Horarios Disponibles</h4>
            <p className="text-red-700">
              No hay horarios disponibles para la fecha seleccionada. 
              Por favor, elige otra fecha o contacta al negocio.
            </p>
          </div>
        )}

        {/* Selected Time Summary */}
        {selectedTime && (
          <div className="mb-8 card-base p-6 bg-gradient-to-r from-emerald-50 to-mint-50 border border-emerald-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-emerald-800 mb-3">
                  {fulfillmentType === 'pickup' ? 'Recolección Programada' : 'Entrega Programada'}
                </h4>
                
                <div className="space-y-2 text-sm text-emerald-700">
                  <div className="flex justify-between">
                    <span>Fecha y hora:</span>
                    <span className="font-medium">
                      {format(selectedTime, 'EEEE, d MMMM \'a las\' HH:mm', { locale: es })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tipo de servicio:</span>
                    <span className="font-medium">
                      {fulfillmentType === 'pickup' ? 'Recolección en tienda' : 'Entrega a domicilio'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Prioridad:</span>
                    <span className={`font-medium ${scheduleResult?.isMorningPriority ? 'text-emerald-800' : 'text-emerald-600'}`}>
                      {scheduleResult?.isMorningPriority ? 'Prioritario' : 'Estándar'}
                    </span>
                  </div>

                  {fulfillmentType === 'pickup' && (
                    <div className="pt-2 border-t border-emerald-200">
                      <p className="text-xs text-emerald-600">
                        Recoger en: {business.address.street}, {business.address.colonia}, {business.address.municipality}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="mb-8 card-base p-6 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Resumen del Pedido</h4>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-gray-700">${item.price.toFixed(2)}</span>
                </div>
              ))}
              {orderTotal > 0 && (
                <div className="pt-2 border-t border-saffron-300 flex justify-between font-semibold text-gray-700">
                  <span>Total:</span>
                  <span className="text-gradient-saffron">${orderTotal.toFixed(2)} MXN</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="mb-8 card-base p-6 bg-gradient-to-r from-saffron-50 to-yellow-50 border border-saffron-200">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-saffron-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-saffron-800 mb-3">Información Importante</h4>
              <ul className="text-sm text-saffron-700 space-y-1">
                <li>• Los horarios son estimados y pueden variar según la demanda del día</li>
                <li>• Te notificaremos por WhatsApp cualquier cambio en el tiempo de {fulfillmentType === 'pickup' ? 'recolección' : 'entrega'}</li>
                <li>• Puedes modificar tu pedido hasta 30 minutos antes de la hora programada</li>
                {scheduleResult?.isScheduledForNextDay && (
                  <li>• Tu pedido será procesado el siguiente día hábil</li>
                )}
                {scheduleResult?.isMorningPriority && (
                  <li>• ¡Tu pedido tiene prioridad matutina y será procesado más rápido!</li>
                )}
                {fulfillmentType === 'pickup' && (
                  <li>• No olvides traer tu comprobante de pedido al momento de recoger</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className={`${getButtonClass('outline')} flex items-center justify-center`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </button>
          )}
          
          <button
            onClick={handleConfirmTime}
            disabled={!selectedTime}
            className={`${getButtonClass('primary')} flex-1 text-lg py-4 ${
              !selectedTime ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {selectedTime 
              ? `Confirmar ${fulfillmentType === 'pickup' ? 'Recolección' : 'Entrega'}` 
              : 'Selecciona un horario'
            }
          </button>
        </div>

        {/* Contact Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes dudas sobre los horarios? 
            <button className="text-saffron-600 hover:text-saffron-800 ml-1 underline font-medium transition-colors duration-200">
              Contacta a {business.storeName}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeScheduler;