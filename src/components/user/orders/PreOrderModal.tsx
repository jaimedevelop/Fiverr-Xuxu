import React, { useState } from 'react';
import { X, Calendar, Clock, Info } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import BaseCard from '../../../components/common/BaseCard';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastryId: string;
  pastryName: string;
  pastryPrice: number;
  onPreOrderComplete: () => void;
}

const PreOrderModal: React.FC<PreOrderModalProps> = ({
  isOpen,
  onClose,
  pastryId,
  pastryName,
  pastryPrice,
  onPreOrderComplete
}) => {
  const { addItem } = useCart();
  const { authState } = useAuth();
  const { user } = authState;
  
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [preOrderDate, setPreOrderDate] = useState('');
  const [preOrderTime, setPreOrderTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!preOrderDate.trim()) {
      newErrors.preOrderDate = 'La fecha es requerida';
    }
    
    if (!preOrderTime.trim()) {
      newErrors.preOrderTime = 'La hora es requerida';
    }
    
    const selectedDateTime = new Date(`${preOrderDate}T${preOrderTime}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      newErrors.preOrderDateTime = 'La fecha y hora deben ser en el futuro';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      setErrors({ form: 'Debes iniciar sesión para realizar un pre-pedido' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add item to cart with pre-order information
      addItem({
        pastryId,
        name: pastryName,
        price: pastryPrice,
        quantity,
        notes: `PRE-ORDER: Fecha: ${preOrderDate}, Hora: ${preOrderTime}. Instrucciones: ${specialInstructions}`
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and notify completion
      onClose();
      onPreOrderComplete();
    } catch (error) {
      console.error('Error creating pre-order:', error);
      setErrors({ form: 'Error al crear el pre-pedido. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Pre-order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Pastry Information */}
            <BaseCard title="Información del Producto">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{pastryName}</h3>
                  <p className="text-gray-600">Pre-order</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(pastryPrice)}</p>
                  <p className="text-sm text-gray-500">por unidad</p>
                </div>
              </div>
            </BaseCard>
            
            {/* Quantity */}
            <BaseCard title="Cantidad">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <div className="mt-2 text-right">
                <p className="text-lg font-medium text-gray-900">
                  Total: {formatCurrency(pastryPrice * quantity)}
                </p>
              </div>
            </BaseCard>
            
            {/* Pre-order Date and Time */}
            <BaseCard title="Fecha y Hora de Recogida" actions={<Calendar className="h-5 w-5 text-gray-500" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <Input
                    type="date"
                    value={preOrderDate}
                    onChange={(e) => setPreOrderDate(e.target.value)}
                    error={errors.preOrderDate}
                    min={minDate}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora *
                  </label>
                  <Input
                    type="time"
                    value={preOrderTime}
                    onChange={(e) => setPreOrderTime(e.target.value)}
                    error={errors.preOrderTime}
                  />
                </div>
                
                {errors.preOrderDateTime && (
                  <div className="text-red-600 text-sm">{errors.preOrderDateTime}</div>
                )}
              </div>
            </BaseCard>
            
            {/* Special Instructions */}
            <BaseCard title="Instrucciones Especiales" actions={<Info className="h-5 w-5 text-gray-500" />}>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Instrucciones especiales para tu pre-order..."
                rows={3}
              />
            </BaseCard>
            
            {/* Pre-order Information */}
            <BaseCard title="Información de Pre-order" actions={<Clock className="h-5 w-5 text-gray-500" />}>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Los pre-pedidos deben realizarse con al menos 24 horas de anticipación.</p>
                <p>• Debes recoger tu pedido en la fecha y hora seleccionadas.</p>
                <p>• Si no puedes recoger tu pedido, por favor avísanos con anticipación.</p>
              </div>
            </BaseCard>
            
            {/* Error Message */}
            {errors.form && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-700">{errors.form}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? 'Procesando...' : 'Realizar Pre-order'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreOrderModal;