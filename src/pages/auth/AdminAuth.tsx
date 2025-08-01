import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AdminAuthForm from '../../components/auth/AdminAuthForm';

const AdminAuth = () => {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acceso de Administrador
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro-negocio" className="font-medium text-blue-600 hover:text-blue-500">
            Registra tu negocio
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AdminAuthForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminAuth;