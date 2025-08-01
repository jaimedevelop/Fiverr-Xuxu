import React from 'react';
import BusinessRegistrationData from '../../../types/business';
import FormErrors from '../../../types/form';
import FormInput from '../../common/FormInput';
import FormError from '../../common/FormError';

interface AddressSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
  errors: FormErrors;
}

const AddressSection = ({ 
  formData, 
  setFormData, 
  errors 
}: AddressSectionProps) => {
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
        Dirección del Negocio
      </h2>
      
      <div className="space-y-4">
        <div>
          <FormInput
            id="street"
            name="street"
            type="text"
            label="Calle"
            placeholder="Nombre de la calle y número"
            value={formData.street}
            onChange={handleChange}
            required
          />
          {errors.street && <FormError message={errors.street} />}
        </div>
        
        <div>
          <FormInput
            id="colonia"
            name="colonia"
            type="text"
            label="Colonia"
            placeholder="Nombre de la colonia"
            value={formData.colonia}
            onChange={handleChange}
            required
          />
          {errors.colonia && <FormError message={errors.colonia} />}
        </div>
        
        <div>
          <FormInput
            id="municipality"
            name="municipality"
            type="text"
            label="Municipio o Alcaldía"
            placeholder="Nombre del municipio o alcaldía"
            value={formData.municipality}
            onChange={handleChange}
            required
          />
          {errors.municipality && <FormError message={errors.municipality} />}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormInput
              id="postalCode"
              name="postalCode"
              type="text"
              label="Código Postal"
              placeholder="12345"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
            {errors.postalCode && <FormError message={errors.postalCode} />}
          </div>
          
          <div>
            <FormInput
              id="state"
              name="state"
              type="text"
              label="Estado"
              placeholder="Ciudad de México"
              value={formData.state}
              onChange={handleChange}
              required
            />
            {errors.state && <FormError message={errors.state} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;