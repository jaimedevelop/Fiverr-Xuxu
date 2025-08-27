// src/components/admin/settings/AccountSettings.tsx
import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { Save, User as UserIcon, Mail, Phone, Camera } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <FormError message={error} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center border-4 border-white shadow-brand-lg">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name} 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-saffron-600" />
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-brand-lg border-2 border-saffron-200 hover:border-saffron-300 transition-colors duration-200"
              >
                <Camera className="h-4 w-4 text-saffron-600" />
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-saffron-50 to-orange-50 rounded-xl p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-admin text-xs">
                {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'manager' ? 'Gerente' : 'Empleado'}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-mono bg-white/70 px-2 py-1 rounded">
              ID: {user.uid}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 input-base"
              />
            </div>
            {errors.name && <FormError message={errors.name} />}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 input-base"
              />
            </div>
            {errors.email && <FormError message={errors.email} />}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 input-base"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rol de Usuario
            </label>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-800 font-medium">
                  {user.role === 'admin' ? 'Administrador' : 
                   user.role === 'manager' ? 'Gerente' : 'Empleado'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={getButtonClass('admin')}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </BaseCard>
  );
};

export default AccountSettings;