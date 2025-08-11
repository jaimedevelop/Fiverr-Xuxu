// src/components/admin/settings/AccountSettings.tsx
import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { Save, User as UserIcon, Mail, Phone, Camera } from 'lucide-react'; // Changed User to UserIcon
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import FormError from '../../../components/common/FormError';
import User from '../../../types/user';

interface AccountSettingsProps {
  user: User;
  loading?: boolean;
  error?: string | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  user, 
  loading = false, 
  error = null 
}) => {
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      alert('Información de cuenta actualizada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la información de cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseCard title="Información de la Cuenta">
      {error && <div className="mb-6"><FormError message={error} /></div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name} 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-500" /> // Changed to UserIcon
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-500">ID: {user.uid}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.name && <FormError message={errors.name} />}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.email && <FormError message={errors.email} />}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-900">
              {user.role === 'admin' ? 'Administrador' : 
               user.role === 'manager' ? 'Gerente' : 'Empleado'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default AccountSettings;