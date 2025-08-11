 import React, { useState, useEffect } from 'react';
import { Save, Settings, Bell, Mail, Globe, Smartphone } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';
interface GeneralSettingsProps {
loading?: boolean;
error?: string | null;
}
interface SettingsConfig {
storeName: string;
storeEmail: string;
storePhone: string;
currency: string;
timezone: string;
language: string;
enableNotifications: boolean;
enableEmailNotifications: boolean;
enableSmsNotifications: boolean;
orderConfirmationMessage: string;
orderReadyMessage: string;
}
const GeneralSettings: React.FC<GeneralSettingsProps> = ({
loading = false,
error = null
}) => {
const [config, setConfig] = useState<SettingsConfig>({
storeName: '',
storeEmail: '',
storePhone: '',
currency: 'MXN',
timezone: 'America/Mexico_City',
language: 'es',
enableNotifications: true,
enableEmailNotifications: true,
enableSmsNotifications: false,
orderConfirmationMessage: 'Gracias por tu orden. Hemos recibido tu pedido y lo estamos procesando.',
orderReadyMessage: 'Tu orden está lista para recoger. ¡Gracias por tu compra!'
});

const [errors, setErrors] = useState<Record<string, string>>({});
useEffect(() => {
// Mock data for development
setConfig({
storeName: 'Pastelería Delicias',
storeEmail: 'contacto@pasteleriadelicias.com',
storePhone: '+52 55 1234 5678',
currency: 'MXN',
timezone: 'America/Mexico_City',
language: 'es',
enableNotifications: true,
enableEmailNotifications: true,
enableSmsNotifications: false,
orderConfirmationMessage: 'Gracias por tu orden. Hemos recibido tu pedido y lo estamos procesando.',
orderReadyMessage: 'Tu orden está lista para recoger. ¡Gracias por tu compra!'
});
}, []);
const currencyOptions = [
{ value: 'MXN', label: 'Peso Mexicano (MXN)' },
{ value: 'USD', label: 'Dólar Americano (USD)' },
{ value: 'EUR', label: 'Euro (EUR)' },
];
const timezoneOptions = [
{ value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
{ value: 'America/Monterrey', label: 'Monterrey (GMT-6)' },
{ value: 'America/Guadalajara', label: 'Guadalajara (GMT-6)' },
{ value: 'America/Cancun', label: 'Cancún (GMT-5)' },
];
const languageOptions = [
{ value: 'es', label: 'Español' },
{ value: 'en', label: 'English' },
];
const validateForm = () => {
const newErrors: Record<string, string> = {};

if (!config.storeName?.trim()) {
newErrors.storeName = 'El nombre de la tienda es requerido';
}

if (!config.storeEmail?.trim()) {
newErrors.storeEmail = 'El email de la tienda es requerido';
} else if (!/\S+@\S+\.\S+/.test(config.storeEmail)) {
newErrors.storeEmail = 'El email no es válido';
}

if (!config.storePhone?.trim()) {
newErrors.storePhone = 'El teléfono de la tienda es requerido';
}

if (!config.orderConfirmationMessage?.trim()) {
newErrors.orderConfirmationMessage = 'El mensaje de confirmación es requerido';
}

if (!config.orderReadyMessage?.trim()) {
newErrors.orderReadyMessage = 'El mensaje de orden lista es requerido';
}

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();

if (validateForm()) {
// In a real app, this would save the settings to the API
console.log('Saving general settings:', config);
alert('Configuración guardada correctamente');
}
};
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value, type, checked } = e.target;

if (type === 'checkbox') {
setConfig(prev => ({
...prev,
[name]: checked
}));
} else {
setConfig(prev => ({
...prev,
[name]: value
}));
}

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

setConfig(prev => ({
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
const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
const { name, value } = e.target;

setConfig(prev => ({
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
return (
<BaseCard title="Configuración General">
{error && <div className="mb-6"><FormError message={error} /></div>}

<form onSubmit={handleSubmit} className="space-y-6">
<div className="space-y-4">
<h3 className="text-lg font-medium text-gray-900 flex items-center">
<Settings className="h-5 w-5 mr-2 text-blue-500" />
Información de la Tienda
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
Nombre de la Tienda
</label>
<Input
id="storeName"
name="storeName"
value={config.storeName}
onChange={handleInputChange}
className="w-full"
/>
{errors.storeName && <FormError message={errors.storeName} />}
</div>
<div>
<label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
Email de la Tienda
</label>
<Input
id="storeEmail"
name="storeEmail"
type="email"
value={config.storeEmail}
onChange={handleInputChange}
className="w-full"
/>
{errors.storeEmail && <FormError message={errors.storeEmail} />}
</div>
<div>
<label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
Teléfono de la Tienda
</label>
<Input
id="storePhone"
name="storePhone"
value={config.storePhone}
onChange={handleInputChange}
className="w-full"
/>
{errors.storePhone && <FormError message={errors.storePhone} />}
</div>
<div>
<label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
Moneda
</label>
<Select
id="currency"
name="currency"
value={config.currency}
onChange={handleSelectChange}
options={currencyOptions}
className="w-full"
/>
</div>
<div>
<label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
Zona Horaria
</label>
<Select
id="timezone"
name="timezone"
value={config.timezone}
onChange={handleSelectChange}
options={timezoneOptions}
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
value={config.language}
onChange={handleSelectChange}
options={languageOptions}
className="w-full"
/>
</div>
</div>
</div>
<div className="space-y-4 pt-4 border-t border-gray-200">
<h3 className="text-lg font-medium text-gray-900 flex items-center">
<Bell className="h-5 w-5 mr-2 text-green-500" />
Notificaciones
</h3>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div>
<div className="flex items-center">
<input
id="enableNotifications"
name="enableNotifications"
type="checkbox"
checked={config.enableNotifications}
onChange={handleInputChange}
className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
/>
<label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
Habilitar Notificaciones
</label>
</div>
<p className="mt-1 text-xs text-gray-500">
Activa las notificaciones del sistema.
</p>
</div>
<div>
<div className="flex items-center">
<input
id="enableEmailNotifications"
name="enableEmailNotifications"
type="checkbox"
checked={config.enableEmailNotifications}
onChange={handleInputChange}
className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
/>
<label htmlFor="enableEmailNotifications" className="ml-2 block text-sm text-gray-900">
Notificaciones por Email
</label>
</div>
<p className="mt-1 text-xs text-gray-500">
Envía notificaciones por correo electrónico.
</p>
</div>
<div>
<div className="flex items-center">
<input
id="enableSmsNotifications"
name="enableSmsNotifications"
type="checkbox"
checked={config.enableSmsNotifications}
onChange={handleInputChange}
className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
/>
<label htmlFor="enableSmsNotifications" className="ml-2 block text-sm text-gray-900">
Notificaciones por SMS
</label>
</div>
<p className="mt-1 text-xs text-gray-500">
Envía notificaciones por mensaje de texto.
</p>
</div>
</div>
</div>
<div className="space-y-4 pt-4 border-t border-gray-200">
<h3 className="text-lg font-medium text-gray-900 flex items-center">
<Mail className="h-5 w-5 mr-2 text-purple-500" />
Mensajes de Notificación
</h3>

<div className="grid grid-cols-1 gap-6">
<div>
<label htmlFor="orderConfirmationMessage" className="block text-sm font-medium text-gray-700 mb-1">
Mensaje de Confirmación de Orden
</label>
<textarea
id="orderConfirmationMessage"
name="orderConfirmationMessage"
rows={3}
value={config.orderConfirmationMessage}
onChange={handleTextareaChange}
className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
/>
{errors.orderConfirmationMessage && <FormError message={errors.orderConfirmationMessage} />}
<p className="mt-1 text-xs text-gray-500">
Este mensaje se envía a los clientes cuando confirman su orden.
</p>
</div>
<div>
<label htmlFor="orderReadyMessage" className="block text-sm font-medium text-gray-700 mb-1">
Mensaje de Orden Lista
</label>
<textarea
id="orderReadyMessage"
name="orderReadyMessage"
rows={3}
value={config.orderReadyMessage}
onChange={handleTextareaChange}
className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
/>
{errors.orderReadyMessage && <FormError message={errors.orderReadyMessage} />}
<p className="mt-1 text-xs text-gray-500">
Este mensaje se envía a los clientes cuando su orden está lista para recoger.
</p>
</div>
</div>
</div>
<div className="flex justify-end">
<Button
type="submit"
disabled={loading}
>
<Save className="h-4 w-4 mr-2" />
{loading ? 'Guardando...' : 'Guardar Configuración'}
</Button>
</div>
</form>
</BaseCard>
);
};
export default GeneralSettings;