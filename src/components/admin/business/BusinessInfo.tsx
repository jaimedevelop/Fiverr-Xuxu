import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Edit, Save, X } from 'lucide-react';
import { Business } from '../../../types/business';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import FormError from '../../../components/common/FormError';
import BaseCard from '../../../components/common/BaseCard';

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
    <BaseCard title="Información del Negocio">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Detalles de tu negocio
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName || ''}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.storeName && <FormError message={errors.storeName} />}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.email && <FormError message={errors.email} />}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.phone && <FormError message={errors.phone} />}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Calle
                  </label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.address?.street || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-1">
                    Colonia
                  </label>
                  <Input
                    id="colonia"
                    name="colonia"
                    value={formData.address?.colonia || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
                    Municipio
                  </label>
                  <Input
                    id="municipality"
                    name="municipality"
                    value={formData.address?.municipality || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.address?.postalCode || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.address?.state || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="md:col-span-2">
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Horario de Apertura
              </label>
              <div className="text-sm text-gray-500">
                Los horarios de operación se configuran en la sección de horarios.
              </div>
            </div>
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
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="text-xl font-bold">
                {business.storeName ? business.storeName.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{business.storeName}</h3>
              <p className="text-sm text-gray-500">{business.accountManager}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Dirección</p>
                <p className="text-sm text-gray-500">
                  {business.address.street}, {business.address.colonia}<br />
                  {business.address.municipality}, {business.address.state} {business.address.postalCode}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Teléfono</p>
                <p className="text-sm text-gray-500">{business.phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{business.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Horario</p>
                <p className="text-sm text-gray-500">
                  Configurado en la sección de horarios
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default BusinessInfo;