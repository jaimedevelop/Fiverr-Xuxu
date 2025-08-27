// src/components/admin/settings/UserSettings.tsx - Theme Converted
import React, { useState, useEffect } from 'react';
import { Save, Users, Shield, UserPlus, UserMinus, Trash2, User as UserIcon, Mail, Phone } from 'lucide-react';
import AuthUser from '../../../types/auth';
import { Business } from '../../../types/business';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';
import DataTable from '../../../components/common/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'cashier';
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

interface UserSettingsProps {
  user?: AuthUser | null;
  business?: Business | null;
  loading?: boolean;
  error?: string | null;
}

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'cashier';
  status: 'active' | 'inactive';
}

const UserSettings: React.FC<UserSettingsProps> = ({
  user,
  business,
  loading = false,
  error = null
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'employee',
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const usersList: User[] = [];
    
    // Add the current user to the list
    if (user) {
      usersList.push({
        id: user.uid,
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'employee' | 'cashier',
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date()
      });
    }

    setUsers([...usersList]);
  }, [user]);

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'employee', label: 'Empleado' },
    { value: 'cashier', label: 'Cajero' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre del usuario es requerido';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'El email del usuario es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingUser) {
        // Update existing user
        setUsers(prev => 
          prev.map(user => 
            user.id === editingUser.id 
              ? { 
                  ...user, 
                  name: formData.name, 
                  email: formData.email, 
                  role: formData.role, 
                  status: formData.status 
                } 
              : user
          )
        );
      } else {
        // Add new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          lastLogin: new Date(),
          createdAt: new Date()
        };
        setUsers(prev => [...prev, newUser]);
      }
      
      setIsFormVisible(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        status: 'active'
      });
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
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
    
    setFormData(prev => ({
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

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormVisible(true);
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      status: 'active'
    });
    setErrors({});
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormVisible(true);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setErrors({});
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      )
    );
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      status: 'active'
    });
    setErrors({});
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'employee':
        return 'Empleado';
      case 'cashier':
        return 'Cajero';
      default:
        return role;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="badge-success">Activo</span>
      : <span className="badge-closed">Inactivo</span>;
  };

  if (isFormVisible) {
    return (
      <BaseCard title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-saffron rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-orange-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Modificar Usuario Existente' : 'Crear Nuevo Usuario'}
              </h3>
              <p className="text-sm text-gray-600">
                {editingUser ? 'Actualiza la información del usuario' : 'Completa la información para el nuevo usuario'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Usuario
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                  placeholder="Nombre completo del usuario"
                />
              </div>
              {errors.name && <FormError message={errors.name} />}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email del Usuario
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
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.email && <FormError message={errors.email} />}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Rol del Usuario
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                options={roleOptions}
                className="input-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Define los permisos y accesos del usuario
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Estado del Usuario
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                options={statusOptions}
                className="input-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Los usuarios inactivos no pueden acceder al sistema
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className={getButtonClass('outline')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={getButtonClass('admin')}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : (editingUser ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </BaseCard>
    );
  }

  const columns = [
    {
      key: 'name' as keyof User,
      title: 'Usuario',
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-orange-900" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role' as keyof User,
      title: 'Rol',
      render: (row: User) => (
        <span className={`badge-base ${row.role === 'admin' ? 'bg-purple-100 text-purple-800' : row.role === 'employee' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {getRoleLabel(row.role)}
        </span>
      )
    },
    {
      key: 'status' as keyof User,
      title: 'Estado',
      render: (row: User) => getStatusBadge(row.status)
    },
    {
      key: 'lastLogin' as keyof User,
      title: 'Último Acceso',
      render: (row: User) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(row.lastLogin)}</div>
          <div className="text-gray-500 text-xs">
            {row.status === 'active' ? 'Acceso reciente' : 'Sin actividad'}
          </div>
        </div>
      )
    },
    {
      key: 'id' as keyof User,
      title: 'Acciones',
      render: (row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditUser(row)}
            className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            title="Editar usuario"
          >
            <Shield className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id, row.status)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              row.status === 'active' 
                ? 'bg-amber-100 hover:bg-amber-200' 
                : 'bg-emerald-100 hover:bg-emerald-200'
            }`}
            title={row.status === 'active' ? 'Desactivar usuario' : 'Activar usuario'}
          >
            {row.status === 'active' 
              ? <UserMinus className="h-4 w-4 text-amber-600" />
              : <UserPlus className="h-4 w-4 text-emerald-600" />
            }
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  return (
    <BaseCard title="Gestión de Usuarios">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <FormError message={error} />
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Usuarios del Sistema
              </h3>
              <p className="text-sm text-gray-600">
                Administra los usuarios que tienen acceso a tu negocio
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAddUser}
            className={getButtonClass('admin')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={users}
            emptyMessage="No se encontraron usuarios en el sistema"
          />
        </div>
      )}
      
      {/* Quick Stats */}
      {users.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Usuarios</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800">Usuarios Activos</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Administradores</p>
                <p className="text-2xl font-bold text-purple-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Empleados</p>
                <p className="text-2xl font-bold text-amber-900">
                  {users.filter(u => u.role === 'employee' || u.role === 'cashier').length}
                </p>
              </div>
              <UserIcon className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default UserSettings;