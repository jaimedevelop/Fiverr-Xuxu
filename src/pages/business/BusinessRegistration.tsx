// src/pages/business/BusinessRegistration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepLayout from '../../components/layout/web/StepLayout';
import BusinessInfoSection from '../../components/business/registration/BusinessInfoSection';
import ContactInfoSection from '../../components/business/registration/ContactInfoSection';
import AddressSection from '../../components/business/registration/AddressSection';
import PasswordSection from '../../components/business/registration/PasswordSection';
import OptionalInfoSection from '../../components/business/registration/OptionalInfoSection';
import TermsAndConditions from '../../components/business/registration/TermsAndConditions';
import { BusinessRegistrationData } from '../../types/business';
import { FormErrors } from '../../types/form';
import { validateStep } from '../../utils/validation';
import { registerBusiness } from '../../services/businessService';
import { useAuth } from '../../contexts/AuthContext';

const initialFormData: BusinessRegistrationData = {
  // Business Information
  storeName: '',
  accountManager: '',
  
  // Contact Information
  email: '',
  phone: '',
  
  // Address
  street: '',
  colonia: '',
  municipality: '',
  postalCode: '',
  state: '',
  
  // Password
  password: '',
  confirmPassword: '',
  
  // Optional Information
  logo: null,
  logoUrl: '',
  operatingHours: {
    monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    saturday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
    sunday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
  },
  
  // Terms
  acceptTerms: false,
};

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessRegistrationData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const stepTitles = [
    'Información del Negocio',
    'Información de Contacto',
    'Dirección',
    'Contraseña',
    'Información Opcional',
    'Términos y Condiciones'
  ];
  
  const totalSteps = stepTitles.length;
  
  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Register the business
        const { user, businessId } = await registerBusiness(formData);
        
        // Log the user in
        await login(user.email, formData.password);
        
        // Redirect to email verification
        navigate(`/verificar-correo/${businessId}`);
      } catch (error) {
        console.error('Error during registration:', error);
        // Handle error (show notification, etc.)
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Get step title and description
  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Información del Negocio',
          description: 'Ingresa los detalles básicos de tu negocio'
        };
      case 2:
        return {
          title: 'Información de Contacto',
          description: 'Proporciona tus datos de contacto'
        };
      case 3:
        return {
          title: 'Dirección',
          description: 'Ingresa la dirección de tu negocio'
        };
      case 4:
        return {
          title: 'Contraseña',
          description: 'Crea una contraseña segura para tu cuenta'
        };
      case 5:
        return {
          title: 'Información Opcional',
          description: 'Agrega información adicional sobre tu negocio'
        };
      case 6:
        return {
          title: 'Términos y Condiciones',
          description: 'Revisa y acepta los términos y condiciones'
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };
  
  const stepInfo = getStepInfo();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dulces Momentos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Registro de Negocio de Pastelería
        </p>
      </div>
      
      <StepLayout 
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        title={stepInfo.title}
        description={stepInfo.description}
        onNext={currentStep === totalSteps ? handleSubmit : handleNext}
        onPrevious={handlePrevious}
        isLastStep={currentStep === totalSteps}
        isSubmitting={isSubmitting}
        nextDisabled={Object.keys(errors).length > 0}
        previousDisabled={currentStep === 1}
      >
        {currentStep === 1 && (
          <BusinessInfoSection 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
          />
        )}
        {currentStep === 2 && (
          <ContactInfoSection 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
          />
        )}
        {currentStep === 3 && (
          <AddressSection 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
          />
        )}
        {currentStep === 4 && (
          <PasswordSection 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
          />
        )}
        {currentStep === 5 && (
          <OptionalInfoSection 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}
        {currentStep === 6 && (
          <TermsAndConditions 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
          />
        )}
      </StepLayout>
    </div>
  );
};

export default BusinessRegistration;