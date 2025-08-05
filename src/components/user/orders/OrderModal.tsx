import React, { useState } from 'react';
import { X, MapPin, CreditCard, Clock, Info } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import BaseCard from '../../../components/common/BaseCard';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: () => void;
}

interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { items, total, clearCart } = useCart();
  const { authState } = useAuth();
  const { user } = authState;
  
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    reference: ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Efectivo',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'card',
      name: 'Tarjeta',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'transfer',
      name: 'Transferencia',
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!deliveryAddress.street.trim()) {
      newErrors.street = 'La calle es requerida';
    }
    
    if (!deliveryAddress.number.trim()) {
      newErrors.number = 'El número es requerido';
    }
    
    if (!deliveryAddress.neighborhood.trim()) {
      newErrors.neighborhood = 'La colonia es requerida';
    }
    
    if (!deliveryAddress.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    
    if (!deliveryAddress.state.trim()) {
      newErrors.state = 'El estado es requerido';
    }
    
    if (!deliveryAddress.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      setErrors({ form: 'Debes iniciar sesión para realizar un pedido' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would create an order in Firebase
      console.log('Creating order:', {
        userId: user.uid,
        items,
        deliveryAddress,
        paymentMethod: selectedPaymentMethod,
        specialInstructions,
        total
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and close modal
      clearCart();
      onClose();
      onOrderComplete();
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ form: 'Error al crear el pedido. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Summary */}
            <BaseCard title="Resumen del Pedido">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span>{formatCurrency(30)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Impuestos</span>
                    <span>{formatCurrency(total * 0.16)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total + 30 + (total * 0.16))}</span>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            {/* Delivery Address */}
            <BaseCard
              title="Dirección de Entrega"
              actions={<MapPin className="h-5 w-5 text-gray-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calle *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    error={errors.street}
                    placeholder="Calle"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    error={errors.number}
                    placeholder="Número"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colonia *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    error={errors.neighborhood}
                    placeholder="Colonia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="Ciudad"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    error={errors.state}
                    placeholder="Estado"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal *
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    error={errors.zipCode}
                    placeholder="Código Postal"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referencia (opcional)
                  </label>
                  <Input
                    type="text"
                    value={deliveryAddress.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="Referencia para encontrar la dirección"
                  />
                </div>
              </div>
            </BaseCard>
            
            {/* Payment Method */}
            <BaseCard
              title="Método de Pago"
              actions={<CreditCard className="h-5 w-5 text-gray-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 ${selectedPaymentMethod === method.id ? 'text-blue-500' : 'text-gray-500'}`}>
                        {method.icon}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </BaseCard>
            
            {/* Special Instructions */}
            <BaseCard
              title="Instrucciones Especiales"
              actions={<Info className="h-5 w-5 text-gray-500" />}
            >
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Instrucciones especiales para tu pedido..."
                rows={3}
              />
            </BaseCard>
            
            {/* Estimated Delivery */}
            <BaseCard
              title="Tiempo de Entrega"
              actions={<Clock className="h-5 w-5 text-gray-500" />}
            >
              <div className="flex items-center text-sm text-gray-600">
                <Info className="h-4 w-4 mr-2" />
                <span>Tiempo estimado de entrega: 45-60 minutos</span>
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
                {isSubmitting ? 'Procesando...' : 'Realizar Pedido'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;