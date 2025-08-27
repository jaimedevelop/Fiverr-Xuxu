import React from 'react';
import { ThemeHelper } from '../../../utils/themeHelper';
import BusinessRegistrationData from '../../../types/business';
import FormErrors from '../../../types/form';
import FormInput from '../../common/FormInput';
import FormError from '../../common/FormError';
import PasswordStrength from '../../common/PasswordStrength';

interface PasswordSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
  errors: FormErrors;
}

const PasswordSection = ({ 
  formData, 
  setFormData, 
  errors 
}: PasswordSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2 className={`text-lg font-medium text-${ThemeHelper.colors.roles.business} mb-4`}>
        Crear Contraseña
      </h2>
      
      <div className="space-y-4">
        <div>
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            placeholder="Cree una contraseña segura"
            value={formData.password}
            onChange={handleChange}
            className={`input-base focus:border-${ThemeHelper.colors.roles.business} focus:ring-${ThemeHelper.colors.roles.business}/20`}
            required
          />
          {errors.password && <FormError message={errors.password} />}
          <PasswordStrength password={formData.password} />
          <p className={`mt-1 text-sm text-${ThemeHelper.colors.neutral.muted}`}>
            La contraseña debe tener al menos 8 caracteres y un carácter especial.
          </p>
        </div>
        
        <div>
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repita su contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-base focus:border-${ThemeHelper.colors.roles.business} focus:ring-${ThemeHelper.colors.roles.business}/20`}
            required
          />
          {errors.confirmPassword && <FormError message={errors.confirmPassword} />}
        </div>
      </div>
    </div>
  );
};

export default PasswordSection;