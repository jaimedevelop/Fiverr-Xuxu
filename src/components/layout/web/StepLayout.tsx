// src/components/layout/StepLayout.tsx
import React from 'react';
import ProgressBar from '../../ui/ProgressBar';

interface StepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  title?: string;
  description?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
}

const StepLayout: React.FC<StepLayoutProps> = ({ 
  children, 
  currentStep, 
  totalSteps, 
  stepTitles,
  title,
  description,
  onNext,
  onPrevious,
  isLastStep = false,
  isSubmitting = false,
  nextDisabled = false,
  previousDisabled = false
}) => {
  // Create steps array for ProgressBar
  const steps = stepTitles.map((title, index) => ({
    id: index + 1,
    name: title
  }));

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Center the ProgressBar with beautiful spacing */}
      <div className="mb-8 flex justify-center">
        <ProgressBar steps={steps} currentStep={currentStep} />
      </div>
      
      {/* Main Card Container */}
      <div className="card-base overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-saffron-50 to-orange-50">
          {title && (
            <h2 className="text-2xl font-bold text-gray-800 text-gradient-saffron">{title}</h2>
          )}
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>
        
        {/* Content Section */}
        <div className="px-8 py-6">
          {children}
        </div>
        
        {/* Footer Section */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-saffron-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={previousDisabled || currentStep === 1}
            className={`btn-outline ${
              previousDisabled || currentStep === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105'
            }`}
          >
            ← Anterior
          </button>
          
          {isLastStep ? (
            <button
              onClick={onNext}
              disabled={nextDisabled || isSubmitting}
              className={`btn-primary ${
                nextDisabled || isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-900 border-t-transparent mr-2"></div>
                  Registrando...
                </>
              ) : (
                '✨ Registrarse'
              )}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`btn-primary ${
                nextDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepLayout;