import React from 'react';
import Button from '../../ui/Button';

interface OrderPreferences {
  defaultDeliveryTime: string;
  allowSubstitutions: boolean;
  contactlessDelivery: boolean;
  leaveAtDoor: boolean;
  specialInstructions: string;
  preferredPaymentMethod: string;
}

interface OrderPreferencesProps {
  preferences: OrderPreferences;
  onSave: (preferences: OrderPreferences) => void;
}

export const OrderPreferences: React.FC<OrderPreferencesProps> = ({
  preferences,
  onSave
}) => {
  const [localPreferences, setLocalPreferences] = React.useState(preferences);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange = (key: keyof OrderPreferences, value: string | boolean) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localPreferences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalPreferences(preferences);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Preferencias de pedido</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="text-sm">
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de entrega preferido
            </label>
            <select
              value={localPreferences.defaultDeliveryTime}
              onChange={(e) => handleChange('defaultDeliveryTime', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asap">Lo antes posible</option>
              <option value="morning">Mañana (9:00 - 12:00)</option>
              <option value="afternoon">Tarde (12:00 - 17:00)</option>
              <option value="evening">Noche (17:00 - 20:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de pago preferido
            </label>
            <select
              value={localPreferences.preferredPaymentMethod}
              onChange={(e) => handleChange('preferredPaymentMethod', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="digital">Transferencia digital</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrucciones especiales
            </label>
            <textarea
              value={localPreferences.specialInstructions}
              onChange={(e) => handleChange('specialInstructions', e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Timbre 201, dejar en portería, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.allowSubstitutions}
                onChange={(e) => handleChange('allowSubstitutions', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Permitir sustituciones si un artículo no está disponible
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.contactlessDelivery}
                onChange={(e) => handleChange('contactlessDelivery', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Entrega sin contacto
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.leaveAtDoor}
                onChange={(e) => handleChange('leaveAtDoor', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Dejar pedido en la puerta
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="text-sm">
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline" className="text-sm">
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Tiempo de entrega preferido</p>
            <p className="text-sm text-gray-600">
              {preferences.defaultDeliveryTime === 'asap' && 'Lo antes posible'}
              {preferences.defaultDeliveryTime === 'morning' && 'Mañana (9:00 - 12:00)'}
              {preferences.defaultDeliveryTime === 'afternoon' && 'Tarde (12:00 - 17:00)'}
              {preferences.defaultDeliveryTime === 'evening' && 'Noche (17:00 - 20:00)'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Método de pago preferido</p>
            <p className="text-sm text-gray-600">
              {preferences.preferredPaymentMethod === 'cash' && 'Efectivo'}
              {preferences.preferredPaymentMethod === 'card' && 'Tarjeta'}
              {preferences.preferredPaymentMethod === 'digital' && 'Transferencia digital'}
            </p>
          </div>

          {preferences.specialInstructions && (
            <div>
              <p className="text-sm font-medium text-gray-700">Instrucciones especiales</p>
              <p className="text-sm text-gray-600">{preferences.specialInstructions}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700">Opciones adicionales</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {preferences.allowSubstitutions && <li>• Permitir sustituciones</li>}
              {preferences.contactlessDelivery && <li>• Entrega sin contacto</li>}
              {preferences.leaveAtDoor && <li>• Dejar en la puerta</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};