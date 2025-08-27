import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Edit, Save, X } from 'lucide-react';
import { Business } from '../../../types/business';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import FormError from '../../../components/common/FormError';
import BaseCard from '../../../components/common/BaseCard';
import { getButtonClass } from '../../../utils/themeHelper';

interface BusinessInfoProps {
  business: Business;
  onUpdate: (business: Partial<Business>) => void;
  loading?: boolean;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ 
  business, 
  onUpdate, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Business>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (business) {
      setFormData({
        storeName: business.storeName,
        address: business.address,
        phone: business.phone,
        email: business.email,
        operatingHours: business.operatingHours,
        logoUrl: business.logoUrl,
      });
    }
  }, [business]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.storeName?.trim()) {
      newErrors.storeName = 'El nombre del negocio es requerido';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    if (business) {
      setFormData({
        storeName: business.storeName,
        address: business.address,
        phone: business.phone,
        email: business.email,
        operatingHours: business.operatingHours,
        logoUrl: business.logoUrl,
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="card-base shadow-brand-lg">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Información del Negocio</h2>
            <p className="text-sm text-gray-600 mt-1">Administra los detalles de tu negocio</p>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="storeName" className="block text-sm font-bold text-gray-700 mb-3">
                  Nombre del Negocio
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName || ''}
                  onChange={handleInputChange}
                  className={`input-base ${errors.storeName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.storeName && (
                  <p className="mt-2 text-sm text-red-600">{errors.storeName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`input-base ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className={`input-base ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Dirección
                </label>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                      Calle
                    </label>
                    <input
                      id="street"
                      name="street"
                      value={formData.address?.street || ''}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="colonia" className="block text-sm font-semibold text-gray-700 mb-2">
                      Colonia
                    </label>
                    <input
                      id="colonia"
                      name="colonia"
                      value={formData.address?.colonia || ''}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="municipality" className="block text-sm font-semibold text-gray-700 mb-2">
                      Municipio
                    </label>
                    <input
                      id="municipality"
                      name="municipality"
                      value={formData.address?.municipality || ''}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        value={formData.address?.postalCode || ''}
                        onChange={handleInputChange}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        id="state"
                        name="state"
                        value={formData.address?.state || ''}
                        onChange={handleInputChange}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Horario de Apertura
                </label>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-700">
                  Los horarios de operación se configuran en la sección de horarios.
                </div>
              </div>
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
          <div className="space-y-8">
            <div className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-saffron-50 rounded-2xl">
              <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-saffron-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-2xl font-bold">
                  {business.storeName ? business.storeName.charAt(0).toUpperCase() : 'B'}
                </span>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-900">{business.storeName}</h3>
                <p className="text-sm text-purple-600 font-medium mt-1">{business.accountManager}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-gray-900 mb-1">Dirección</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {business.address.street}, {business.address.colonia}<br />
                    {business.address.municipality}, {business.address.state} {business.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-gray-900 mb-1">Teléfono</p>
                  <p className="text-sm text-gray-700">{business.phone}</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-sky-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-gray-900 mb-1">Email</p>
                  <p className="text-sm text-gray-700">{business.email}</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-gray-900 mb-1">Horario</p>
                  <p className="text-sm text-gray-700">
                    Configurado en la sección de horarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;