// src/components/layout/StepLayout.tsx
import React from 'react';
import ProgressBar from '../../ui/ProgressBar';
// ... rest of the imports remain the same

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
    <div className="max-w-2xl mx-auto">
      {/* Center the ProgressBar */}
      <div className="mb-8 flex justify-center">
        <ProgressBar steps={steps} currentStep={currentStep} />
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        <div className="px-6 py-5">
          {children}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={onPrevious}
            disabled={previousDisabled || currentStep === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              previousDisabled || currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anterior
          </button>
          
          {isLastStep ? (
            <button
              onClick={onNext}
              disabled={nextDisabled || isSubmitting}
              className={`px-4 py-2 rounded-lg font-medium text-white ${
                nextDisabled || isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`px-4 py-2 rounded-lg font-medium text-white ${
                nextDisabled
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default StepLayout;