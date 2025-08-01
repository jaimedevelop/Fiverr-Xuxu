import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/common/FormInput';
import { FormError } from '../../components/common/FormError';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if email is already verified
    const checkEmailVerification = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          // Redirect to menu management after a short delay
          setTimeout(() => {
            navigate('/admin/menu-management');
          }, 2000);
        }
      }
    };

    checkEmailVerification();

    // Set up interval to check email verification status
    const interval = setInterval(checkEmailVerification, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    // Countdown for resend button
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (user) {
      setIsResending(true);
      try {
        await user.sendEmailVerification();
        setCountdown(60); // 60 seconds countdown
      } catch (error) {
        console.error('Error resending verification email:', error);
        setError('Error al reenviar el correo de verificación');
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      // In a real app, you might have a custom verification system
      // For Firebase, the verification is done by clicking the link in the email
      // This is a placeholder for a custom verification system
      
      // For now, we'll just check if the email is verified
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          setTimeout(() => {
            navigate('/admin/menu-management');
          }, 2000);
        } else {
          setError('El correo electrónico aún no ha sido verificado. Por favor revise su correo y haga clic en el enlace de verificación.');
        }
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setError('Error al verificar el correo electrónico');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Xuxu</h1>
          <p className="mt-2 text-sm text-gray-600">
            Verificación de Correo Electrónico
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isVerified ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">¡Verificado!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Tu correo electrónico ha sido verificado correctamente. Serás redirigido al panel de administración.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Verifica tu correo electrónico</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, haz clic en el enlace para verificar tu cuenta.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">
                    ¿No recibiste el correo?
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending || countdown > 0}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                  >
                    {isResending 
                      ? 'Enviando...' 
                      : countdown > 0 
                        ? `Reenviar en ${countdown}s` 
                        : 'Reenviar correo'
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;