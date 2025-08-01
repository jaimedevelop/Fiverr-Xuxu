import React from 'react';
import BusinessRegistrationData from '../../../types/business';
import FormErrors from '../../../types/form';
import FormInput from '../../common/FormInput';
import FormError from '../../common/FormError';

interface BusinessInfoSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
  errors: FormErrors;
}

const BusinessInfoSection = ({ 
  formData, 
  setFormData, 
  errors 
}: BusinessInfoSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Información del Negocio
      </h2>
      
      <div className="space-y-4">
        <div>
          <FormInput
            id="storeName"
            name="storeName"
            type="text"
            label="Nombre del Negocio"
            placeholder="Ingrese el nombre de su pastelería"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
          {errors.storeName && <FormError message={errors.storeName} />}
        </div>
        
        <div>
          <FormInput
            id="accountManager"
            name="accountManager"
            type="text"
            label="Nombre del Responsable"
            placeholder="Ingrese el nombre del responsable"
            value={formData.accountManager}
            onChange={handleChange}
            required
          />
          {errors.accountManager && <FormError message={errors.accountManager} />}
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSection;