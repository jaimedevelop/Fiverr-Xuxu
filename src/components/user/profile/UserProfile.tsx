import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, MapPin, Lock, Bell, Heart, LogOut, Search, Settings } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';

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
  loading: propLoading = false, 
  error: propError = null 
}) => {
  const { logout } = useAuth();
  const { user: firestoreUser, loading: userLoading, updateUser, error: userError } = useUser();
  
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
  const [isSaving, setIsSaving] = useState(false);

  // Load Firebase user data into form
  useEffect(() => {
    if (firestoreUser) {
      console.log("📄 Loading Firebase user data into profile form:", firestoreUser);
      
      // Parse full name into first and last name if needed
      const nameParts = firestoreUser.name ? firestoreUser.name.split(' ') : ['', ''];
      const firstName = firestoreUser.firstName || nameParts[0] || '';
      const lastName = firestoreUser.lastName || nameParts.slice(1).join(' ') || '';
      
      setProfileData({
        firstName,
        lastName,
        email: firestoreUser.email || '',
        phone: firestoreUser.phone || '',
        address: firestoreUser.address || '',
        city: firestoreUser.city || '',
        state: firestoreUser.state || '',
        zipCode: firestoreUser.zipCode || '',
        country: firestoreUser.country || 'MX',
        language: firestoreUser.preferences?.language || 'es',
        notifications: {
          email: firestoreUser.preferences?.notifications?.email ?? true,
          sms: firestoreUser.preferences?.notifications?.sms ?? false,
          push: firestoreUser.preferences?.notifications?.push ?? true
        }
      });
    }
  }, [firestoreUser]);

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
    
    if (profileData.phone && profileData.phone.trim()) {
      // Basic phone validation - at least 10 digits
      const phoneDigits = profileData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'El teléfono debe tener al menos 10 dígitos';
      }
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare data for Firebase
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(), // Update full name
        email: profileData.email,
        phone: profileData.phone || undefined,
        address: profileData.address || undefined,
        city: profileData.city || undefined,
        state: profileData.state || undefined,
        zipCode: profileData.zipCode || undefined,
        country: profileData.country,
        preferences: {
          language: profileData.language,
          timezone: firestoreUser?.preferences?.timezone || 'America/Mexico_City',
          notifications: profileData.notifications
        }
      };

      console.log("💾 Saving profile data to Firebase:", updateData);
      await updateUser(updateData);
      
      alert('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // TODO: Implement password change with Firebase Auth
      console.log('Password change not yet implemented');
      alert('Funcionalidad de cambio de contraseña pendiente de implementar');
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

  // Show loading while user data is loading
  if (userLoading && !firestoreUser) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Cargando información del usuario...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show error if user couldn't be loaded
  if (userError && !firestoreUser) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Error al cargar la información del usuario</p>
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{userError}</p>
        </div>
      </div>
    );
  }

  const isLoading = propLoading || userLoading || isSaving;
  const error = propError || userError;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
      </div>

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  {errors.email && <FormError message={errors.email} />}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileInputChange}
                    className="w-full"
                    disabled={isLoading}
                    placeholder="+52 55 1234 5678"
                  />
                  {errors.phone && <FormError message={errors.phone} />}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección (opcional)
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileInputChange}
                    className="w-full"
                    disabled={isLoading}
                    placeholder="Av. Principal 123"
                  />
                  {errors.address && <FormError message={errors.address} />}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad (opcional)
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileInputChange}
                    className="w-full"
                    disabled={isLoading}
                    placeholder="Ciudad de México"
                  />
                  {errors.city && <FormError message={errors.city} />}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado (opcional)
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileInputChange}
                    className="w-full"
                    disabled={isLoading}
                    placeholder="CDMX"
                  />
                  {errors.state && <FormError message={errors.state} />}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal (opcional)
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleProfileInputChange}
                    className="w-full"
                    disabled={isLoading}
                    placeholder="06000"
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
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
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    profileData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> La funcionalidad de cambio de contraseña estará disponible próximamente. 
              Por ahora, puedes restablecer tu contraseña usando la opción "¿Olvidaste tu contraseña?" en la página de inicio de sesión.
            </p>
          </div>
          
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
                />
                {passwordErrors.confirmPassword && <FormError message={passwordErrors.confirmPassword} />}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={true}
                className="opacity-50 cursor-not-allowed"
              >
                <Lock className="h-4 w-4 mr-2" />
                Próximamente
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
                disabled={isLoading}
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
                    <p className="text-gray-600">
                      {firestoreUser?.createdAt 
                        ? new Date(firestoreUser.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No disponible'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Último inicio de sesión:</span>
                    <p className="text-gray-600">
                      {firestoreUser?.lastLogin 
                        ? new Date(firestoreUser.lastLogin).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'No disponible'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado de la cuenta:</span>
                    <p className="text-green-600">Activa</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo de usuario:</span>
                    <p className="text-gray-600">
                      {firestoreUser?.role === 'user' ? 'Usuario Regular' : 
                       firestoreUser?.role === 'admin' ? 'Administrador' : 
                       'Usuario'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{firestoreUser?.email || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">ID de usuario:</span>
                    <p className="text-gray-600 text-xs font-mono">{firestoreUser?.uid || 'No disponible'}</p>
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