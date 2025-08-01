import React from 'react';
import BusinessRegistrationData from '../../../types/business';
import FormErrors from '../../../types/form';
import FormError from '../../common/FormError';

interface TermsAndConditionsProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
  errors: FormErrors;
}

const TermsAndConditions = ({ 
  formData, 
  setFormData, 
  errors 
}: TermsAndConditionsProps) => {
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: e.target.checked
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Términos y Condiciones
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-60 overflow-y-auto">
        <h3 className="font-medium mb-2">Términos de Servicio</h3>
        <p className="text-sm text-gray-600 mb-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
          nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies 
          nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
        
        <h3 className="font-medium mb-2">Política de Privacidad</h3>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
          nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies 
          nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleTermsChange}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acceptTerms" className="font-medium text-gray-700">
            Acepto los términos y condiciones
          </label>
          {errors.acceptTerms && <FormError message={errors.acceptTerms} />}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;