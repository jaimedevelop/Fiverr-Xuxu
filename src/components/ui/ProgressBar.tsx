// src/components/ui/ProgressBar.tsx
import React from 'react';
interface ProgressBarProps {
  steps: { id: number; name: string }[];
  currentStep: number;
}
const ProgressBar = (props: ProgressBarProps) => {
  const { steps, currentStep } = props;
  
  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`flex items-center ${step.id < steps.length ? 'flex-1' : ''}`}
          >
            {/* Ensure all number backgrounds are circular */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.id}
            </div>
            <span className={`ml-2 text-sm ${
              currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
            {step.id < steps.length && (
              <div className={`flex-1 h-1 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProgressBar;