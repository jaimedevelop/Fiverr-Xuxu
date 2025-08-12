import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, MapPin, Lock, Bell, Heart, LogOut } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface UserProfileProps {
  loading?: boolean;
  error?: string | null;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const { logout } = useAuth();
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'MX',
    language: 'es',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'account'>('profile');

  useEffect(() => {
    // Mock data for development
    setProfileData({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+52 55 1234 5678',
      address: 'Av. Principal 123',
      city: 'Ciudad de México',
      state: 'CDMX',
      zipCode: '06000',
      country: 'MX',
      language: 'es',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    });
  }, []);

  const countryOptions = [
    { value: 'MX', label: 'México' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'CA', label: 'Canadá' },
  ];

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
  ];

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!profileData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    if (!profileData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!profileData.phone?.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!profileData.address?.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    
    if (!profileData.city?.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    
    if (!profileData.state?.trim()) {
      newErrors.state = 'El estado es requerido';
    }
    
    if (!profileData.zipCode?.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword?.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordData.newPassword?.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!passwordData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      // In a real app, this would save the profile data to the API
      console.log('Saving profile data:', profileData);
      alert('Perfil guardado correctamente');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // In a real app, this would update the password via the API
      console.log('Updating password');
      alert('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNotificationChange = (type: 'email' | 'sms' | 'push') => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
      </div>

      {/* Quick Links */}
      <BaseCard title="Enlaces Rápidos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/usuario/pedidos"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Mis Pedidos</h3>
              <p className="text-xs text-gray-500">Ver el historial de pedidos</p>
            </div>
          </Link>
          
          <Link
            to="/usuario/explorar"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Explorar</h3>
              <p className="text-xs text-gray-500">Descubrir pastelerías</p>
            </div>
          </Link>
        </div>
      </BaseCard>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Información Personal
            </div>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Contraseña
            </div>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Cuenta
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <>
          <BaseCard title="Información Personal">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.firstName && <FormError message={errors.firstName} />}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.lastName && <FormError message={errors.lastName} />}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileInputChange}
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
                    value={profileData.phone}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.phone && <FormError message={errors.phone} />}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.address && <FormError message={errors.address} />}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.city && <FormError message={errors.city} />}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.state && <FormError message={errors.state} />}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleProfileInputChange}
                    className="w-full"
                  />
                  {errors.zipCode && <FormError message={errors.zipCode} />}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <Select
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleSelectChange}
                    options={countryOptions}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <Select
                    id="language"
                    name="language"
                    value={profileData.language}
                    onChange={handleSelectChange}
                    options={languageOptions}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </BaseCard>

          <BaseCard title="Notificaciones">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Notificaciones por Email</h3>
                    <p className="text-xs text-gray-500">Recibe actualizaciones y promociones por correo electrónico</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={profileData.notifications.email}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.email ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Notificaciones por SMS</h3>
                    <p className="text-xs text-gray-500">Recibe actualizaciones por mensaje de texto</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('sms')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={profileData.notifications.sms}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Notificaciones Push</h3>
                    <p className="text-xs text-gray-500">Recibe notificaciones en tu dispositivo móvil</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={profileData.notifications.push}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.push ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </BaseCard>
        </>
      )}

      {activeTab === 'password' && (
        <BaseCard title="Cambiar Contraseña">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full"
                />
                {passwordErrors.currentPassword && <FormError message={passwordErrors.currentPassword} />}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full"
                />
                {passwordErrors.newPassword && <FormError message={passwordErrors.newPassword} />}
                <p className="mt-1 text-xs text-gray-500">
                  La contraseña debe tener al menos 8 caracteres.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full"
                />
                {passwordErrors.confirmPassword && <FormError message={passwordErrors.confirmPassword} />}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </div>
          </form>
        </BaseCard>
      )}

      {activeTab === 'account' && (
        <BaseCard title="Gestión de Cuenta">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Zona de Peligro</h3>
              <p className="text-sm text-yellow-700 mb-4">
                Estas acciones son permanentes e irreversibles. Procede con precaución.
              </p>
              
              <Button
                variant="danger"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Cuenta</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Fecha de registro:</span>
                    <p className="text-gray-600">15 de enero, 2024</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Último inicio de sesión:</span>
                    <p className="text-gray-600">Hoy a las 10:30 AM</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado de la cuenta:</span>
                    <p className="text-green-600">Activa</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo de usuario:</span>
                    <p className="text-gray-600">Usuario Regular</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      )}
    </div>
  );
};

export default UserProfile;