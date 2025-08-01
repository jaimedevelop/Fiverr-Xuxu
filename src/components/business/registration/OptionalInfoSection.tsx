import React from 'react';
import BusinessRegistrationData from '../../../types/business';
import ImageUpload from '../../common/ImageUpload';
import OperatingHoursInput from '../../operatingHours/OperatingHoursInput';

interface OptionalInfoSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
}

const OptionalInfoSection = ({ 
  formData, 
  setFormData 
}: OptionalInfoSectionProps) => {
  const handleLogoChange = (file: File | null, url: string) => {
    setFormData(prev => ({
      ...prev,
      logo: file,
      logoUrl: url
    }));
  };

  const handleOperatingHoursChange = (operatingHours: typeof formData.operatingHours) => {
    setFormData(prev => ({
      ...prev,
      operatingHours
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Información Opcional
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Logo del Negocio
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Añade un logo para tu pastelería (opcional)
          </p>
          <ImageUpload 
            onImageChange={handleLogoChange}
            currentImageUrl={formData.logoUrl}
          />
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Horario de Operación
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Configura tus horarios de atención (opcional)
          </p>
          <OperatingHoursInput 
            operatingHours={formData.operatingHours}
            onChange={handleOperatingHoursChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionalInfoSection;