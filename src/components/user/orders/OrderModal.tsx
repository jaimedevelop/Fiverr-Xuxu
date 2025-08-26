import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, CreditCard, Clock, Info, Truck, ShoppingBag, ChevronLeft, ChevronRight, User, Mail, Phone, Calendar } from 'lucide-react';
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

interface GuestInfo {
  email: string;
  phone: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

type OrderStep = 'review' | 'fulfillment' | 'pickup-payment' | 'delivery-info' | 'payment-processing' | 'guest-info' | 'confirmation';

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { items, total, clearCart, getBusinessIds, getItemsByBusiness } = useCart();
  const { authState } = useAuth();
  const { user } = authState;
  const { business } = useBusiness();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<OrderStep>('review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [paymentLocation, setPaymentLocation] = useState<'store' | 'online'>('online');
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
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    email: '',
    phone: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for scrolling
  const modalContentRef = useRef<HTMLDivElement>(null);

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

  // Step configuration
  const stepConfig = {
    review: { title: 'Revisar Pedido', progress: 20 },
    fulfillment: { title: 'Tipo de Entrega', progress: 40 },
    'pickup-payment': { title: 'Forma de Pago', progress: 60 },
    'delivery-info': { title: 'Información de Entrega', progress: 60 },
    'payment-processing': { title: 'Procesar Pago', progress: 80 },
    'guest-info': { title: 'Información de Contacto', progress: 85 },
    confirmation: { title: 'Confirmación', progress: 100 }
  };

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const resetModal = () => {
    setCurrentStep('review');
    setErrors({});
    setSpecialInstructions('');
    // Don't reset other form data in case user reopens modal
  };

  // Validation functions
  const validateCurrentStep = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  switch (currentStep) {
    case 'review':
      if (items.length === 0) {
        newErrors.items = 'No hay productos en el carrito';
      }
      break;
      
    case 'fulfillment':
      if (!fulfillmentType) {
        newErrors.fulfillment = 'Selecciona un tipo de entrega';
      }
      break;
      
    case 'pickup-payment':
      if (fulfillmentType === 'pickup') {
        if (!selectedPickupTime) {
          newErrors.pickupTime = 'Selecciona una hora de recogida';
        }
        if (!paymentLocation) {
          newErrors.paymentLocation = 'Selecciona cómo prefieres pagar';
        }
      }
      break;
      
    case 'delivery-info':
      if (fulfillmentType === 'delivery') {
        if (!deliveryAddress.street.trim()) newErrors.street = 'La calle es requerida';
        if (!deliveryAddress.number.trim()) newErrors.number = 'El número es requerido';
        if (!deliveryAddress.neighborhood.trim()) newErrors.neighborhood = 'La colonia es requerida';
        if (!deliveryAddress.city.trim()) newErrors.city = 'La ciudad es requerida';
        if (!deliveryAddress.state.trim()) newErrors.state = 'El estado es requerido';
        if (!deliveryAddress.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';
      }
      break;
      
    case 'guest-info':
      if (!user) {
        if (!guestInfo.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!guestInfo.email.trim()) newErrors.email = 'El email es requerido';
        if (!guestInfo.phone.trim()) newErrors.phone = 'El teléfono es requerido';
        
        if (guestInfo.email && !/\S+@\S+\.\S+/.test(guestInfo.email)) {
          newErrors.email = 'Email inválido';
        }
        if (guestInfo.phone && !/^\d{10}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Teléfono debe tener 10 dígitos';
        }
      }
      break;
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Navigation functions
  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    switch (currentStep) {
      case 'review':
        setCurrentStep('fulfillment');
        break;
      case 'fulfillment':
        if (fulfillmentType === 'pickup') {
          setCurrentStep('pickup-payment');
        } else {
          setCurrentStep('delivery-info');
        }
        break;
      case 'pickup-payment':
        if (paymentLocation === 'online') {
          setCurrentStep('payment-processing');
        } else {
          // For in-store payment, skip to guest info or order creation
          if (!user) {
            setCurrentStep('guest-info');
          } else {
            handleOrderSubmit();
          }
        }
        break;
      case 'delivery-info':
        setCurrentStep('payment-processing');
        break;
      case 'payment-processing':
        if (!user) {
          setCurrentStep('guest-info');
        } else {
          handleOrderSubmit();
        }
        break;
      case 'guest-info':
        handleOrderSubmit();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'fulfillment':
        setCurrentStep('review');
        break;
      case 'pickup-payment':
        setCurrentStep('fulfillment');
        break;
      case 'delivery-info':
        setCurrentStep('fulfillment');
        break;
      case 'payment-processing':
        if (fulfillmentType === 'pickup') {
          setCurrentStep('pickup-payment');
        } else {
          setCurrentStep('delivery-info');
        }
        break;
      case 'guest-info':
        setCurrentStep('payment-processing');
        break;
    }
  };

  const canGoNext = () => {
  const result = (() => {
    switch (currentStep) {
      case 'review':
        return items.length > 0;
      case 'fulfillment':
        return !!fulfillmentType;
      case 'pickup-payment':
        // For pickup orders, we need both a pickup time AND a payment location
        const hasPickupTime = !!selectedPickupTime;
        const hasPaymentLocation = !!paymentLocation;
        const isPickupOrder = fulfillmentType === 'pickup';
        
        // Debug logging
        console.log('Pickup validation:', {
          fulfillmentType,
          isPickupOrder,
          hasPickupTime,
          hasPaymentLocation,
          selectedPickupTime,
          paymentLocation
        });
        
        return !isPickupOrder || (hasPickupTime && hasPaymentLocation);
      case 'delivery-info':
        return fulfillmentType !== 'delivery' || (
          deliveryAddress.street && deliveryAddress.number && 
          deliveryAddress.neighborhood && deliveryAddress.city && 
          deliveryAddress.state && deliveryAddress.zipCode
        );
      case 'payment-processing':
        return true;
      case 'guest-info':
        return user || (guestInfo.name && guestInfo.email && guestInfo.phone);
      default:
        return true;
    }
  })();
  
  console.log(`canGoNext for step ${currentStep}:`, result);
  return result;
};

  const canGoPrev = () => {
    return currentStep !== 'review' && currentStep !== 'confirmation';
  };

  // Order submission
  const handleOrderSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setCurrentStep('confirmation');
    
    try {
      const businessIds = getBusinessIds();
      const subtotal = total;
      const tax = subtotal * 0.16;
      const deliveryFee = fulfillmentType === 'delivery' ? businessIds.length * 30 : 0;
      
      const orderPromises = businessIds.map(async (businessId) => {
        const businessItems = getItemsByBusiness(businessId);
        const businessSubtotal = businessItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const businessTax = businessSubtotal * 0.16;
        const businessDeliveryFee = fulfillmentType === 'delivery' ? 30 : 0;
        const businessTotal = businessSubtotal + businessTax + businessDeliveryFee;
        
        const orderData: any = {
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

        // Add user info (authenticated or guest)
        if (user) {
          orderData.userId = user.uid;
        } else {
          orderData.guestInfo = {
            name: guestInfo.name,
            email: guestInfo.email,
            phone: guestInfo.phone
          };
        }

        // Add conditional fields
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
          orderData.paymentLocation = paymentLocation;
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
      
      // Show success message
      setTimeout(() => {
        onClose();
        onOrderComplete();
        resetModal();
        alert(`¡Pedido realizado exitosamente!`);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ form: 'Error al crear el pedido. Inténtalo de nuevo.' });
      setCurrentStep('payment-processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGuestInfoChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Calculate totals
  const subtotal = total;
  const tax = subtotal * 0.16;
  const deliveryFee = fulfillmentType === 'delivery' ? getBusinessIds().length * 30 : 0;
  const finalTotal = subtotal + tax + deliveryFee;

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'review':
        return (
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
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Impuestos</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal + tax)}</span>
                </div>
                
                {getBusinessIds().length > 1 && (
                  <div className="text-sm text-blue-600 mt-2">
                    * Se crearán {getBusinessIds().length} pedidos separados (uno por negocio)
                  </div>
                )}
              </div>
              
              {errors.items && (
                <div className="text-red-500 text-sm mt-2">{errors.items}</div>
              )}
            </div>
          </BaseCard>
        );

      case 'fulfillment':
        return (
          <BaseCard title="Selecciona Tipo de Entrega" actions={<Truck className="h-5 w-5 text-gray-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setFulfillmentType('pickup')}
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
              
              <div
                onClick={() => setFulfillmentType('delivery')}
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
            </div>
            
            {errors.fulfillment && (
              <div className="text-red-500 text-sm mt-2">{errors.fulfillment}</div>
            )}
          </BaseCard>
        );

      case 'pickup-payment':
  return (
    <div className="space-y-6">
      {/* Add debug info */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <div><strong>Debug Info:</strong></div>
        <div>Business available: {business ? 'YES' : 'NO'}</div>
        <div>Operating hours: {business?.operatingHours ? 'YES' : 'NO'}</div>
        <div>Selected pickup time: {selectedPickupTime ? 'YES' : 'NO'}</div>
        <div>Payment location: {paymentLocation}</div>
      </div>

      <BaseCard title="Hora de Recogida" actions={<Clock className="h-5 w-5 text-gray-500" />}>
        {business?.operatingHours ? (
          <PickupTimeSelector
            operatingHours={business.operatingHours}
            selectedPickupTime={selectedPickupTime}
            onPickupTimeSelect={(time) => {
              console.log('PickupTimeSelector called onPickupTimeSelect with:', time);
              setSelectedPickupTime(time);
            }}
            error={errors.pickupTime}
          />
        ) : (
          // Fallback when business context is not available
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Selecciona tu horario de recogida</p>
                  <p className="text-blue-700 mt-1">
                    Preparamos tu pedido con 30 minutos de anticipación mínimo
                  </p>
                </div>
              </div>
            </div>

            {/* Simple time slots when business hours not available */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { time: '10:00', label: '10:00 AM', value: new Date() },
                { time: '11:00', label: '11:00 AM', value: new Date() },
                { time: '12:00', label: '12:00 PM', value: new Date() },
                { time: '13:00', label: '1:00 PM', value: new Date() },
                { time: '14:00', label: '2:00 PM', value: new Date() },
                { time: '15:00', label: '3:00 PM', value: new Date() },
                { time: '16:00', label: '4:00 PM', value: new Date() },
                { time: '17:00', label: '5:00 PM', value: new Date() }
              ].map((slot, index) => {
                // Create proper datetime
                const datetime = new Date();
                datetime.setHours(parseInt(slot.time.split(':')[0]), 0, 0, 0);
                
                const isSelected = selectedPickupTime?.datetime.getTime() === datetime.getTime();
                
                const pickupTimeSlot = {
                  datetime: datetime,
                  displayTime: `Hoy a las ${slot.label}`,
                  isToday: true,
                  estimatedPreparationTime: 30
                };

                return (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Manual time slot selected:', pickupTimeSlot);
                      setSelectedPickupTime(pickupTimeSlot);
                    }}
                    className={`p-3 text-sm rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{slot.label}</div>
                      <div className={`text-xs mt-1 ${
                        isSelected ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        Hoy
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedPickupTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Horario seleccionado
                    </p>
                    <p className="text-sm text-green-700">
                      {selectedPickupTime.displayTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.pickupTime && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{errors.pickupTime}</p>
              </div>
            )}
          </div>
        )}
      </BaseCard>
      
      <BaseCard title="¿Cómo prefieres pagar?" actions={<CreditCard className="h-5 w-5 text-gray-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              console.log('Payment location set to: store');
              setPaymentLocation('store');
            }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              paymentLocation === 'store'
                ? 'border-green-500 bg-green-50 shadow-sm'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <span className="font-medium block">Pagar en tienda</span>
              <span className="text-sm text-gray-500">Al recoger tu pedido</span>
            </div>
          </div>
          
          <div
            onClick={() => {
              console.log('Payment location set to: online');
              setPaymentLocation('online');
            }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              paymentLocation === 'online'
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <span className="font-medium block">Pagar en línea</span>
              <span className="text-sm text-gray-500">Procesar pago ahora</span>
            </div>
          </div>
        </div>

        {/* Error display */}
        {(errors.pickupTime || errors.paymentLocation) && (
          <div className="mt-4 space-y-2">
            {errors.pickupTime && (
              <div className="text-red-500 text-sm">{errors.pickupTime}</div>
            )}
            {errors.paymentLocation && (
              <div className="text-red-500 text-sm">{errors.paymentLocation}</div>
            )}
          </div>
        )}
      </BaseCard>
    </div>
  );

      case 'delivery-info':
        return (
          <BaseCard title="Dirección de Entrega" actions={<MapPin className="h-5 w-5 text-gray-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                <Input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  error={errors.street}
                  placeholder="Nombre de la calle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <Input
                  type="text"
                  value={deliveryAddress.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  error={errors.number}
                  placeholder="Número exterior"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                <Input
                  type="text"
                  value={deliveryAddress.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  error={errors.neighborhood}
                  placeholder="Nombre de la colonia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                <Input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={errors.city}
                  placeholder="Ciudad o municipio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <Input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={errors.state}
                  placeholder="Estado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                <Input
                  type="text"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  error={errors.zipCode}
                  placeholder="CP"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia (opcional)</label>
                <Input
                  type="text"
                  value={deliveryAddress.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  placeholder="Referencias para encontrar la dirección"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-sm text-blue-700">
                <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Tiempo estimado de entrega: 45-60 minutos</span>
              </div>
              <div className="mt-2 text-sm text-blue-600">
                <strong>Costo de envío: {formatCurrency(deliveryFee)}</strong>
                {getBusinessIds().length > 1 && <span> ({getBusinessIds().length} negocios × $30)</span>}
              </div>
            </div>
          </BaseCard>
        );

      case 'payment-processing':
        return (
          <div className="space-y-6">
            <BaseCard title="Método de Pago" actions={<CreditCard className="h-5 w-5 text-gray-500" />}>
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

            <BaseCard title="Resumen Final">
              <div className="space-y-2">
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
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones Especiales (opcional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Instrucciones especiales para tu pedido..."
                  rows={3}
                />
              </div>
            </BaseCard>
          </div>
        );

      case 'guest-info':
        return (
          <BaseCard title="Información de Contacto" actions={<User className="h-5 w-5 text-gray-500" />}>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Para procesar tu pedido, necesitamos tu información de contacto:
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <Input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => handleGuestInfoChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <Input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="55 1234 5678"
                />
              </div>
              
              <div className="text-xs text-gray-500">
                * Usaremos esta información únicamente para contactarte sobre tu pedido
              </div>
            </div>
          </BaseCard>
        );

      case 'confirmation':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Procesando tu pedido...</h3>
            <p className="text-gray-600">Por favor espera mientras confirmamos tu orden...</p>
            
            {errors.form && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{errors.form}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {stepConfig[currentStep].title}
            </h2>
            {/* Progress bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stepConfig[currentStep].progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Paso {Object.keys(stepConfig).indexOf(currentStep) + 1} de {Object.keys(stepConfig).length}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={modalContentRef}
          className="overflow-y-auto max-h-[calc(95vh-200px)]"
        >
          <div className="p-6">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer with navigation buttons */}
        {currentStep !== 'confirmation' && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between">
              <div>
                {canGoPrev() && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {currentStep === 'review' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Continuar Comprando
                  </Button>
                )}
                
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canGoNext() || isSubmitting}
                  className="flex items-center min-w-[120px]"
                >
                  {currentStep === 'guest-info' || 
                   (currentStep === 'pickup-payment' && paymentLocation === 'store') ? (
                    isSubmitting ? 'Procesando...' : 'Realizar Pedido'
                  ) : (
                    <>
                      Continuar
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Show user login option for guest users */}
            {!user && ['payment-processing', 'guest-info'].includes(currentStep) && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-center text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <button 
                    onClick={() => {
                      // Here you would typically open a login modal
                      // For now, just show an alert
                      alert('Funcionalidad de inicio de sesión aquí');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Inicia sesión
                  </button>
                  {' '}para una experiencia más rápida
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;