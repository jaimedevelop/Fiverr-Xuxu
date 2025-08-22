// src/components/user/checkout/GuestUserForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../common/Input';
import BaseCard from '../../common/BaseCard';
import { FulfillmentType } from '../../../types/order';

interface GuestUserInfo {
  name: string;
  phone: string;
  email?: string;
  // Delivery fields
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  reference?: string;
}

interface GuestUserFormProps {
  fulfillmentType: FulfillmentType;
  onSubmit: (guestInfo: GuestUserInfo) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const GuestUserForm: React.FC<GuestUserFormProps> = ({
  fulfillmentType,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [guestInfo, setGuestInfo] = useState<GuestUserInfo>({
    name: '',
    phone: '',
    email: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    reference: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for error scrolling
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const streetRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const zipCodeRef = useRef<HTMLDivElement>(null);

  const scrollToError = (errorField: string) => {
    const fieldRefMap: Record<string, React.RefObject<HTMLDivElement>> = {
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      street: streetRef,
      number: numberRef,
      neighborhood: neighborhoodRef,
      city: cityRef,
      state: stateRef,
      zipCode: zipCodeRef
    };

    const targetRef = fieldRefMap[errorField];
    if (targetRef?.current && formRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleInputChange = (field: keyof GuestUserInfo, value: string) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields for all orders
    if (!guestInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(guestInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Ingrese un teléfono válido (10 dígitos)';
    }

    // Delivery-specific validation
    if (fulfillmentType === 'delivery') {
      if (!guestInfo.street?.trim()) {
        newErrors.street = 'La calle es requerida';
      }
      if (!guestInfo.number?.trim()) {
        newErrors.number = 'El número es requerido';
      }
      if (!guestInfo.neighborhood?.trim()) {
        newErrors.neighborhood = 'La colonia es requerida';
      }
      if (!guestInfo.city?.trim()) {
        newErrors.city = 'La ciudad es requerida';
      }
      if (!guestInfo.state?.trim()) {
        newErrors.state = 'El estado es requerido';
      }
      if (!guestInfo.zipCode?.trim()) {
        newErrors.zipCode = 'El código postal es requerido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(guestInfo);
  };

  // Auto-scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      setTimeout(() => {
        scrollToError(firstErrorField);
      }, 100);
    }
  }, [errors]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <BaseCard
        title="Información Personal"
        actions={<User className="h-5 w-5 text-gray-500" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div ref={nameRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <Input
              type="text"
              value={guestInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Tu nombre completo"
            />
          </div>
          
          <div ref={phoneRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <Input
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="Ej: 5551234567"
            />
          </div>
          
          <div ref={emailRef} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico (opcional)
            </label>
            <Input
              type="email"
              value={guestInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="tu@correo.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Te enviaremos actualizaciones sobre tu pedido
            </p>
          </div>
        </div>
      </BaseCard>

      {/* Delivery Address - Only show for delivery */}
      {fulfillmentType === 'delivery' && (
        <BaseCard
          title="Dirección de Entrega"
          actions={<MapPin className="h-5 w-5 text-gray-500" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={streetRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calle *
              </label>
              <Input
                type="text"
                value={guestInfo.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                error={errors.street}
                placeholder="Nombre de la calle"
              />
            </div>
            
            <div ref={numberRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <Input
                type="text"
                value={guestInfo.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                error={errors.number}
                placeholder="Número exterior"
              />
            </div>
            
            <div ref={neighborhoodRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colonia *
              </label>
              <Input
                type="text"
                value={guestInfo.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                error={errors.neighborhood}
                placeholder="Nombre de la colonia"
              />
            </div>
            
            <div ref={cityRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <Input
                type="text"
                value={guestInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
                placeholder="Ciudad o municipio"
              />
            </div>
            
            <div ref={stateRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <Input
                type="text"
                value={guestInfo.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                error={errors.state}
                placeholder="Estado"
              />
            </div>
            
            <div ref={zipCodeRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal *
              </label>
              <Input
                type="text"
                value={guestInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                error={errors.zipCode}
                placeholder="CP"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia (opcional)
              </label>
              <Input
                type="text"
                value={guestInfo.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                placeholder="Referencias para encontrar la dirección"
              />
            </div>
          </div>
        </BaseCard>
      )}

      {/* Pickup Information */}
      {fulfillmentType === 'pickup' && (
        <BaseCard
          title="Información de Contacto"
          actions={<Phone className="h-5 w-5 text-gray-500" />}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-700 text-sm">
              <strong>Recogida en tienda:</strong> Solo necesitamos tu nombre y teléfono para contactarte cuando tu pedido esté listo.
            </p>
          </div>
        </BaseCard>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[150px]"
        >
          {isSubmitting ? 'Guardando...' : 'Continuar con el pedido'}
        </Button>
      </div>
    </form>
  );
};

export default GuestUserForm;