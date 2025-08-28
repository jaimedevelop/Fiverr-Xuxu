import React from 'react';

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  minDate?: Date;
  maxDate?: Date;
  availableTimes?: string[];
  businessHours?: {
    open: string;
    close: string;
  };
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  minDate = new Date(),
  maxDate,
  availableTimes = [],
  businessHours
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  // Generate available time slots based on business hours
  const generateTimeSlots = (): string[] => {
    if (businessHours) {
      const slots: string[] = [];
      const [openHour, openMin] = businessHours.open.split(':').map(Number);
      const [closeHour, closeMin] = businessHours.close.split(':').map(Number);
      
      for (let hour = openHour; hour < closeHour; hour++) {
        for (let min = 0; min < 60; min += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
          slots.push(time);
        }
      }
      
      return slots;
    }
    
    return availableTimes.length > 0 ? availableTimes : [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00'
    ];
  };

  const timeSlots = generateTimeSlots();

  // Get days in month for calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < minDate || (maxDate && date > maxDate);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      days.push({
        day,
        date,
        isDisabled,
        isSelected
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Selecciona una fecha</h4>
        
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-saffron-100 rounded-lg transition-all duration-200 text-saffron-600 hover:text-saffron-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h5 className="text-lg font-semibold text-gray-700">
              {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
            </h5>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-saffron-100 rounded-lg transition-all duration-200 text-saffron-600 hover:text-saffron-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-3 bg-gradient-to-r from-saffron-50 to-persian-pink-50 rounded-lg">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    type="button"
                    onClick={() => !day.isDisabled && onDateChange(day.date)}
                    disabled={day.isDisabled}
                    className={`w-full h-full text-sm rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      day.isSelected 
                        ? 'bg-gradient-saffron text-orange-900 shadow-saffron font-semibold' 
                        : day.isDisabled 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-saffron-100 hover:to-persian-pink-100 hover:text-saffron-700'
                    }`}
                  >
                    {day.day}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selecciona una hora</h4>
          
          <div className="card-base p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => onTimeChange(time)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    selectedTime === time
                      ? 'border-saffron-400 bg-gradient-saffron text-orange-900 shadow-saffron'
                      : 'border-gray-300 hover:border-saffron-300 text-gray-700 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-persian-pink-50 hover:text-saffron-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};