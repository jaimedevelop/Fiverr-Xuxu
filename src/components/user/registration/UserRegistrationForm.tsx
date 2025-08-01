// src/components/user/registration/UserRegistrationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import FormInput from '../../common/FormInput';
import FormError from '../../common/FormError';
import PasswordStrength from '../../common/PasswordStrength';
import { useAuth } from '../../../contexts/AuthContext';

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/usuario/menu');
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message === 'auth/email-already-in-use' 
          ? 'Este correo electrónico ya está en uso' 
          : 'Error al crear la cuenta'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errors.general}
              </h3>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Nombre"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <FormError message={errors.name} />}
      </div>
      
      <div>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <FormError message={errors.email} />}
      </div>
      
      <div>
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <PasswordStrength password={formData.password} />
        {errors.password && <FormError message={errors.password} />}
      </div>
      
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </div>
    </form>
  );
};

export default UserRegistrationForm;