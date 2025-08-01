// src/components/user/registration/UserRegistration.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../auth/AuthLayout';
import UserRegistrationForm from './UserRegistrationForm';

const UserRegistration = () => {
  console.log("UserRegistration component is being rendered");
  
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta de Usuario
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/acceso-usuario" className="font-medium text-blue-600 hover:text-blue-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <UserRegistrationForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserRegistration;