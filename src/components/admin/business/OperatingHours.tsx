import React, { useState, useEffect } from 'react';
import { Clock, Edit, Save, X } from 'lucide-react';
import { Business, type OperatingHours, type DayHours } from '../../../types/business';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import BaseCard from '../../../components/common/BaseCard';
import { getButtonClass } from '../../../utils/themeHelper';

interface OperatingHoursProps {
  business: Business;
  onUpdate: (operatingHours: OperatingHours) => void;
  loading?: boolean;
}

const daysOfWeek = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
];

const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  return Array.from({ length: 2 }, (_, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${(minute * 30).toString().padStart(2, '0')}`;
    return {
      value: timeString,
      label: timeString,
    };
  });
}).flat();

const OperatingHours: React.FC<OperatingHoursProps> = ({ 
  business, 
  onUpdate, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OperatingHours>(business.operatingHours);

  useEffect(() => {
    if (business) {
      setFormData(business.operatingHours);
    }
  }, [business]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleDayToggle = (dayId: keyof OperatingHours) => {
    setFormData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        isOpen: !prev[dayId].isOpen,
      }
    }));
  };

  const handleTimeChange = (dayId: keyof OperatingHours, timeType: 'openTime' | 'closeTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [timeType]: value,
      }
    }));
  };

  const handleCancel = () => {
    if (business) {
      setFormData(business.operatingHours);
    }
    setIsEditing(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="card-base shadow-brand-lg">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Horarios de Operación</h2>
            <p className="text-sm text-gray-600 mt-1">Configura cuándo está abierto tu negocio</p>
          </div>
          {!isEditing && (
            <button
              className={`${getButtonClass('outline')} flex items-center gap-2 hover:border-purple-300 hover:text-purple-600`}
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="card-base p-6 border-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${day.id}-isOpen`}
                        checked={formData[day.id as keyof OperatingHours].isOpen}
                        onChange={() => handleDayToggle(day.id as keyof OperatingHours)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`${day.id}-isOpen`} className="ml-4 block text-base font-bold text-gray-700">
                        {day.name}
                      </label>
                    </div>

                    {formData[day.id as keyof OperatingHours].isOpen && (
                      <div className="flex items-center space-x-6">
                        <div>
                          <label className="block text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Apertura</label>
                          <select
                            value={formData[day.id as keyof OperatingHours].openTime}
                            onChange={(e) => handleTimeChange(day.id as keyof OperatingHours, 'openTime', e.target.value)}
                            className="input-base w-36"
                          >
                            {timeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Cierre</label>
                          <select
                            value={formData[day.id as keyof OperatingHours].closeTime}
                            onChange={(e) => handleTimeChange(day.id as keyof OperatingHours, 'closeTime', e.target.value)}
                            className="input-base w-36"
                          >
                            {timeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className={`${getButtonClass('outline')} flex items-center gap-2`}
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${getButtonClass('admin')} flex items-center gap-2 disabled:opacity-50`}
              >
                <Save className="h-4 w-4" />
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const dayHours = formData[day.id as keyof OperatingHours];
              return (
                <div key={day.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-4 shadow-sm ${dayHours.isOpen ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    <span className="text-base font-bold text-gray-700">{day.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {dayHours.isOpen ? (
                      <span className="text-gray-700">
                        {formatTime(dayHours.openTime)} - {formatTime(dayHours.closeTime)}
                      </span>
                    ) : (
                      <span className="text-gray-500 px-3 py-1 bg-gray-200 rounded-full">Cerrado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatingHours;