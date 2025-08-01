import { BusinessRegistrationData } from '../types/business';
import { FormErrors } from '../types/form';

export const validateStep = (step: number, formData: BusinessRegistrationData): FormErrors => {
  const errors: FormErrors = {};
  
  switch (step) {
    case 1: // Business Information
      if (!formData.storeName.trim()) {
        errors.storeName = 'El nombre del negocio es obligatorio';
      }
      if (!formData.accountManager.trim()) {
        errors.accountManager = 'El nombre del responsable es obligatorio';
      }
      break;
      
    case 2: // Contact Information
      if (!formData.email.trim()) {
        errors.email = 'El correo electrónico es obligatorio';
      } else if (!isValidEmail(formData.email)) {
        errors.email = 'Ingrese un correo electrónico válido';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'El número de teléfono es obligatorio';
      } else if (!isValidPhone(formData.phone)) {
        errors.phone = 'Ingrese un número de teléfono válido';
      }
      break;
      
    case 3: // Address
      if (!formData.street.trim()) {
        errors.street = 'La calle es obligatoria';
      }
      if (!formData.colonia.trim()) {
        errors.colonia = 'La colonia es obligatoria';
      }
      if (!formData.municipality.trim()) {
        errors.municipality = 'El municipio es obligatorio';
      }
      if (!formData.postalCode.trim()) {
        errors.postalCode = 'El código postal es obligatorio';
      } else if (!isValidPostalCode(formData.postalCode)) {
        errors.postalCode = 'Ingrese un código postal válido';
      }
      if (!formData.state.trim()) {
        errors.state = 'El estado es obligatorio';
      }
      break;
      
    case 4: // Password
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!hasSpecialChar(formData.password)) {
        errors.password = 'La contraseña debe contener al menos un carácter especial';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirme su contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
      break;
      
    case 6: // Terms and Conditions
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'Debe aceptar los términos y condiciones';
      }
      break;
  }
  
  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's a valid Mexican phone number (10 digits)
  return cleaned.length === 10;
};

const isValidPostalCode = (postalCode: string): boolean => {
  // Mexican postal codes are 5 digits
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
};

const hasSpecialChar = (password: string): boolean => {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  return specialCharRegex.test(password);
};