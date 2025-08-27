import React from 'react';
import { ThemeHelper } from '../../../utils/themeHelper';
import type { BusinessRegistrationData } from '../../../types/business';
import type { FormErrors } from '../../../types/form';
import FormInput from '../../common/FormInput';
import FormError from '../../common/FormError';

interface ContactInfoSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
  errors: FormErrors;
}

const ContactInfoSection = ({ 
  formData, 
  setFormData, 
  errors 
}: ContactInfoSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format phone number as user types (for Mexican phone numbers)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Apply formatting based on length
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  return (
    <div>
      <h2 className={`text-lg font-medium text-${ThemeHelper.colors.roles.business} mb-4`}>
        Información de Contacto
      </h2>
      
      <div className="space-y-4">
        <div>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            className={`input-base focus:border-${ThemeHelper.colors.roles.business} focus:ring-${ThemeHelper.colors.roles.business}/20`}
            required
          />
          {errors.email && <FormError message={errors.email} />}
        </div>
        
        <div>
          <FormInput
            id="phone"
            name="phone"
            type="tel"
            label="Número de Teléfono"
            placeholder="(55) 1234-5678"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`input-base focus:border-${ThemeHelper.colors.roles.business} focus:ring-${ThemeHelper.colors.roles.business}/20`}
            required
          />
          {errors.phone && <FormError message={errors.phone} />}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;