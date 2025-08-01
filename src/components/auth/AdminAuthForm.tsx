// src/components/auth/AdminAuthForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import FormInput from '../common/FormInput';
import FormError from '../common/FormError';
import { useAuth } from '../../contexts/AuthContext';

const AdminAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
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
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
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
      await login(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message === 'auth/user-not-found' 
          ? 'Usuario no encontrado' 
          : error.message === 'auth/wrong-password'
            ? 'Contraseña incorrecta'
            : 'Error al iniciar sesión'
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
        {errors.password && <FormError message={errors.password} />}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="/recuperar-contrasena" className="font-medium text-blue-600 hover:text-blue-500">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </div>
    </form>
  );
};

export default AdminAuthForm;