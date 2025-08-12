import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, CreditCard, Clock, Info, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { createOrder } from '../../../firebase/database';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import BaseCard from '../../../components/common/BaseCard';
import PickupTimeSelector from './PickupTimeSelector';
import { FulfillmentType, PickupTimeSlot } from '../../../types/order';

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
  const { items, total, clearCart, getBusinessIds, getItemsByBusiness } = useCart();
  const { authState } = useAuth();
  const { user } = authState;
  const { business } = useBusiness();
  
  // Form state
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [selectedPickupTime, setSelectedPickupTime] = useState<PickupTimeSlot | null>(null);
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

  // Refs for error scrolling
  const modalContentRef = useRef<HTMLDivElement>(null);
  const fulfillmentTypeRef = useRef<HTMLDivElement>(null);
  const streetRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const zipCodeRef = useRef<HTMLDivElement>(null);
  const pickupTimeRef = useRef<HTMLDivElement>(null);
  const formErrorRef = useRef<HTMLDivElement>(null);

  // Payment methods
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

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const scrollToError = (errorField: string) => {
    const fieldRefMap: Record<string, React.RefObject<HTMLDivElement>> = {
      fulfillmentType: fulfillmentTypeRef,
      street: streetRef,
      number: numberRef,
      neighborhood: neighborhoodRef,
      city: cityRef,
      state: stateRef,
      zipCode: zipCodeRef,
      pickupTime: pickupTimeRef,
      form: formErrorRef
    };

    const targetRef = fieldRefMap[errorField];
    if (targetRef?.current && modalContentRef.current) {
      const modalRect = modalContentRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();
      
      const scrollTop = modalContentRef.current.scrollTop;
      const targetPosition = targetRect.top - modalRect.top + scrollTop - 20;
      
      modalContentRef.current.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate based on fulfillment type
    if (fulfillmentType === 'delivery') {
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
    } else if (fulfillmentType === 'pickup') {
      if (!selectedPickupTime) {
        newErrors.pickupTime = 'Debes seleccionar una hora de recogida';
      }
    }
    
    if (items.length === 0) {
      newErrors.form = 'No hay productos en el carrito';
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

  const handleFulfillmentTypeChange = (type: FulfillmentType) => {
    setFulfillmentType(type);
    // Clear relevant errors when switching types
    setErrors(prev => {
      const newErrors = { ...prev };
      if (type === 'pickup') {
        // Clear delivery address errors
        delete newErrors.street;
        delete newErrors.number;
        delete newErrors.neighborhood;
        delete newErrors.city;
        delete newErrors.state;
        delete newErrors.zipCode;
      } else {
        // Clear pickup time errors
        delete newErrors.pickupTime;
      }
      return newErrors;
    });
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
      const businessIds = getBusinessIds();
      
      const orderPromises = businessIds.map(async (businessId) => {
        const businessItems = getItemsByBusiness(businessId);
        const businessSubtotal = businessItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const businessTax = businessSubtotal * 0.16;
        const businessDeliveryFee = fulfillmentType === 'delivery' ? 30 : 0;
        const businessTotal = businessSubtotal + businessTax + businessDeliveryFee;
        
        const orderData = {
          userId: user.uid,
          businessId: businessId,
          items: businessItems.map(item => ({
            pastryId: item.pastryId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes || ''
          })),
          status: 'pending',
          subtotal: businessSubtotal,
          tax: businessTax,
          deliveryFee: businessDeliveryFee,
          total: businessTotal,
          paymentMethod: selectedPaymentMethod,
          fulfillmentType: fulfillmentType,
          specialInstructions: specialInstructions,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add conditional fields based on fulfillment type
        if (fulfillmentType === 'delivery') {
          orderData.deliveryAddress = {
            street: deliveryAddress.street,
            colonia: deliveryAddress.neighborhood,
            municipality: deliveryAddress.city,
            postalCode: deliveryAddress.zipCode,
            state: deliveryAddress.state,
            reference: deliveryAddress.reference || ''
          };
          orderData.estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);
        } else if (fulfillmentType === 'pickup' && selectedPickupTime) {
          orderData.pickupTime = selectedPickupTime;
          orderData.estimatedDeliveryTime = selectedPickupTime.datetime;
        }
        
        const result = await createOrder(orderData);
        if (result.error) {
          throw new Error(result.error);
        }
        return result.id;
      });
      
      const orderIds = await Promise.all(orderPromises);
      console.log('Orders created successfully:', orderIds);
      
      clearCart();
      onClose();
      onOrderComplete();
      
      alert(`¡Pedido realizado exitosamente!`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ form: 'Error al crear el pedido. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      setTimeout(() => {
        scrollToError(firstErrorField);
      }, 100);
    }
  }, [errors]);

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Calculate totals
  const subtotal = total;
  const tax = subtotal * 0.16;
  const deliveryFee = fulfillmentType === 'delivery' ? getBusinessIds().length * 30 : 0;
  const finalTotal = subtotal + tax + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={modalContentRef}
          className="overflow-y-auto max-h-[calc(95vh-200px)]"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Order Summary */}
            <BaseCard title="Resumen del Pedido">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      {item.notes && (
                        <div className="text-sm text-gray-500 mt-1">Nota: {item.notes}</div>
                      )}
                    </div>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {fulfillmentType === 'delivery' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Envío</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Impuestos</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                  
                  {getBusinessIds().length > 1 && (
                    <div className="text-sm text-blue-600 mt-2">
                      * Se crearán {getBusinessIds().length} pedidos separados (uno por negocio)
                    </div>
                  )}
                  
                  {fulfillmentType === 'pickup' && (
                    <div className="text-sm text-green-600 mt-2 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Sin costo de envío por recogida en tienda
                    </div>
                  )}
                </div>
              </div>
            </BaseCard>

            {/* Fulfillment Type Selection */}
            <BaseCard
              title="Tipo de Entrega"
              actions={<Truck className="h-5 w-5 text-gray-500" />}
            >
              <div ref={fulfillmentTypeRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => handleFulfillmentTypeChange('delivery')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mr-3 mt-1 ${fulfillmentType === 'delivery' ? 'text-blue-500' : 'text-gray-500'}`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium block">Envío a domicilio</span>
                      <span className="text-sm text-gray-500">Entrega en tu dirección</span>
                      <span className="text-sm text-gray-600 block mt-1">+$30 por negocio</span>
                    </div>
                  </div>
                </div>
                
                <div
                  onClick={() => handleFulfillmentTypeChange('pickup')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    fulfillmentType === 'pickup'
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mr-3 mt-1 ${fulfillmentType === 'pickup' ? 'text-green-500' : 'text-gray-500'}`}>
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium block">Recoger en tienda</span>
                      <span className="text-sm text-gray-500">Recoge tu pedido directamente</span>
                      <span className="text-sm text-green-600 block mt-1">Sin costo de envío</span>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>

            {/* Delivery Address - Only show for delivery */}
            {fulfillmentType === 'delivery' && (
              <BaseCard
                title="Dirección de Entrega"
                actions={<MapPin className="h-5 w-5 text-gray-500" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={streetRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calle *
                    </label>
                    <Input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      error={errors.street}
                      placeholder="Nombre de la calle"
                    />
                  </div>
                  
                  <div ref={numberRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <Input
                      type="text"
                      value={deliveryAddress.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      error={errors.number}
                      placeholder="Número exterior"
                    />
                  </div>
                  
                  <div ref={neighborhoodRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colonia *
                    </label>
                    <Input
                      type="text"
                      value={deliveryAddress.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      error={errors.neighborhood}
                      placeholder="Nombre de la colonia"
                    />
                  </div>
                  
                  <div ref={cityRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <Input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      error={errors.city}
                      placeholder="Ciudad o municipio"
                    />
                  </div>
                  
                  <div ref={stateRef}>
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
                  
                  <div ref={zipCodeRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal *
                    </label>
                    <Input
                      type="text"
                      value={deliveryAddress.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      error={errors.zipCode}
                      placeholder="CP"
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
                      placeholder="Referencias para encontrar la dirección"
                    />
                  </div>
                </div>
              </BaseCard>
            )}

            {/* Pickup Time Selection - Only show for pickup */}
            {fulfillmentType === 'pickup' && business?.operatingHours && (
              <BaseCard
                title="Hora de Recogida"
                actions={<Clock className="h-5 w-5 text-gray-500" />}
              >
                <div ref={pickupTimeRef}>
                  <PickupTimeSelector
                    operatingHours={business.operatingHours}
                    selectedPickupTime={selectedPickupTime}
                    onPickupTimeSelect={setSelectedPickupTime}
                    error={errors.pickupTime}
                  />
                </div>
              </BaseCard>
            )}

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
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Instrucciones especiales para tu pedido..."
                rows={3}
              />
            </BaseCard>

            {/* Estimated Time Information */}
            <BaseCard
              title={fulfillmentType === 'delivery' ? "Tiempo de Entrega" : "Información de Recogida"}
              actions={<Clock className="h-5 w-5 text-gray-500" />}
            >
              <div className="flex items-start text-sm text-gray-600">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {fulfillmentType === 'delivery' ? (
                    <span>Tiempo estimado de entrega: 45-60 minutos</span>
                  ) : selectedPickupTime ? (
                    <div>
                      <span className="font-medium text-gray-800">
                        Tu pedido estará listo para recoger:
                      </span>
                      <br />
                      <span>
                        {selectedPickupTime.datetime.toLocaleDateString('es-MX', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })} a las {selectedPickupTime.datetime.toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  ) : (
                    <span>Selecciona una hora de recogida arriba</span>
                  )}
                </div>
              </div>
            </BaseCard>

            {/* Error Message */}
            {errors.form && (
              <div ref={formErrorRef} className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{errors.form}</p>
              </div>
            )}

          </form>
        </div>

        {/* Footer with buttons */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || items.length === 0}
              className="min-w-[150px] px-6"
            >
              {isSubmitting ? 'Procesando...' : 'Realizar Pedido'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;