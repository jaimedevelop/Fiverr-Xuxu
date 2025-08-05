import React, { useState, useEffect } from 'react';
import { Clock, Edit, Save, X } from 'lucide-react';
import { Business, type OperatingHours, type DayHours } from '../../../types/business';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import BaseCard from '../../../components/common/BaseCard';

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
    <BaseCard title="Horarios de Operación">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Configura los horarios de tu negocio
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${day.id}-isOpen`}
                    checked={formData[day.id as keyof OperatingHours].isOpen}
                    onChange={() => handleDayToggle(day.id as keyof OperatingHours)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`${day.id}-isOpen`} className="ml-3 block text-sm font-medium text-gray-700">
                    {day.name}
                  </label>
                </div>

                {formData[day.id as keyof OperatingHours].isOpen && (
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Apertura</label>
                      <Select
                        value={formData[day.id as keyof OperatingHours].openTime}
                        onChange={(e) => handleTimeChange(day.id as keyof OperatingHours, 'openTime', e.target.value)}
                        options={timeOptions}
                        className="w-32"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cierre</label>
                      <Select
                        value={formData[day.id as keyof OperatingHours].closeTime}
                        onChange={(e) => handleTimeChange(day.id as keyof OperatingHours, 'closeTime', e.target.value)}
                        options={timeOptions}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const dayHours = formData[day.id as keyof OperatingHours];
            return (
              <div key={day.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${dayHours.isOpen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium text-gray-700">{day.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {dayHours.isOpen ? (
                    <span>
                      {formatTime(dayHours.openTime)} - {formatTime(dayHours.closeTime)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Cerrado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BaseCard>
  );
};

export default OperatingHours;