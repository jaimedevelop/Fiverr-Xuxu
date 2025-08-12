import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import UserAuthForm from '../../components/auth/UserAuthForm';

const UserAuth = () => {
  return (
    <AuthLayout showBackButton={true} backButtonPath="/iniciar-sesion">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acceso de Usuario
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro-usuario" className="font-medium text-blue-600 hover:text-blue-500">
            Crear cuenta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <UserAuthForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserAuth;