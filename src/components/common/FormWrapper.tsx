// src/components/common/FormWrapper.tsx
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

interface FormWrapperProps {
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  initialValues?: Record<string, any>;
  resetOnSuccess?: boolean;
  successMessage?: string;
  showSuccessAlert?: boolean;
  scrollToError?: boolean;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  onSubmit,
  children,
  className = '',
  initialValues = {},
  resetOnSuccess = false,
  successMessage = 'Operación completada con éxito',
  showSuccessAlert = true,
  scrollToError = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(formValues);
      setSuccess(true);
      if (resetOnSuccess) {
        setFormValues(initialValues);
      }
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error');
      if (scrollToError) {
        setTimeout(() => {
          const errorElement = document.getElementById('form-error');
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormValues(initialValues);
    setError(null);
    setSuccess(false);
  };

  // Create a context for form values and handlers
  const formContext = {
    values: formValues,
    handleChange: handleFieldChange,
    loading,
    error,
    success,
    resetForm,
  };

  // Clone children and pass form context
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        formContext,
      });
    }
    return child;
  });

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Error Alert */}
      {error && (
        <div id="form-error" className="mb-6">
          <div className="card-base bg-red-50/90 border-red-200 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && showSuccessAlert && (
        <div className="mb-6">
          <FormSuccess message={successMessage} />
        </div>
      )}

      {/* Form Content */}
      <div className={`transition-opacity duration-300 ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
        {childrenWithProps}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-base p-8 flex flex-col items-center shadow-brand-xl">
            <Loader2 className="h-10 w-10 animate-spin text-saffron-500 mb-4" />
            <p className="text-gray-700 font-medium">Procesando...</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormWrapper;