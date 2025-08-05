import React, { useState, useEffect } from 'react';
import { Save, Users, Shield, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
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
    // Mock data for development
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@pasteleriadelicias.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date(2023, 5, 15),
        createdAt: new Date(2023, 0, 10)
      },
      {
        id: '2',
        name: 'María García',
        email: 'maria@pasteleriadelicias.com',
        role: 'employee',
        status: 'active',
        lastLogin: new Date(2023, 5, 14),
        createdAt: new Date(2023, 1, 15)
      },
      {
        id: '3',
        name: 'Carlos López',
        email: 'carlos@pasteleriadelicias.com',
        role: 'cashier',
        status: 'active',
        lastLogin: new Date(2023, 5, 10),
        createdAt: new Date(2023, 2, 20)
      },
      {
        id: '4',
        name: 'Ana Martínez',
        email: 'ana@pasteleriadelicias.com',
        role: 'employee',
        status: 'inactive',
        lastLogin: new Date(2023, 4, 5),
        createdAt: new Date(2023, 3, 5)
      }
    ];
    setUsers(mockUsers);
  }, []);

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
      ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
      : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>;
  };

  if (isFormVisible) {
    return (
      <BaseCard title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Usuario
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
                Email del Usuario
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                options={roleOptions}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                options={statusOptions}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Usuario'}
            </Button>
          </div>
        </form>
      </BaseCard>
    );
  }

  const columns = [
    {
      key: 'name' as keyof User,
      title: 'Nombre',
      render: (row: User) => <span className="text-sm font-medium text-gray-900">{row.name}</span>
    },
    {
      key: 'email' as keyof User,
      title: 'Email',
      render: (row: User) => <span className="text-sm text-gray-900">{row.email}</span>
    },
    {
      key: 'role' as keyof User,
      title: 'Rol',
      render: (row: User) => <span className="text-sm text-gray-900">{getRoleLabel(row.role)}</span>
    },
    {
      key: 'status' as keyof User,
      title: 'Estado',
      render: (row: User) => getStatusBadge(row.status)
    },
    {
      key: 'lastLogin' as keyof User,
      title: 'Último Acceso',
      render: (row: User) => <span className="text-sm text-gray-500">{formatDate(row.lastLogin)}</span>
    },
    {
      key: 'id' as keyof User,
      title: 'Acciones',
      render: (row: User) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleEditUser(row)}
            className="h-8 w-8 p-0"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleToggleStatus(row.id, row.status)}
            className="h-8 w-8 p-0"
          >
            {row.status === 'active' ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDeleteUser(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <BaseCard title="Gestión de Usuarios">
      {error && <div className="mb-6"><FormError message={error} /></div>}
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="No se encontraron usuarios"
        />
      )}
    </BaseCard>
  );
};

export default UserSettings;