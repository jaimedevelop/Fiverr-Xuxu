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
import { getButtonClass, colors } from '../../../utils/themeHelper';

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

type OrderStep = 'review' | 'fulfillment' | 'pickup-payment' | 'delivery-info' | 'guest-info' | 'confirmation';

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

  // Payment methods (cash only)
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Efectivo',
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  // Step configuration
  const stepConfig = {
    review: { title: 'Revisar Pedido', progress: 20 },
    fulfillment: { title: 'Tipo de Entrega', progress: 40 },
    'pickup-payment': { title: 'Hora de Recogida', progress: 60 },
    'delivery-info': { title: 'Información de Entrega', progress: 60 },
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
        // For cash payments, go to guest info or order creation
        if (!user) {
          setCurrentStep('guest-info');
        } else {
          handleOrderSubmit();
        }
        break;
      case 'delivery-info':
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
      case 'guest-info':
        if (fulfillmentType === 'pickup') {
          setCurrentStep('pickup-payment');
        } else {
          setCurrentStep('delivery-info');
        }
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
        const hasPickupTime = !!selectedPickupTime;
        const isPickupOrder = fulfillmentType === 'pickup';
        
        return !isPickupOrder || hasPickupTime;
      case 'delivery-info':
        return fulfillmentType !== 'delivery' || (
          deliveryAddress.street && deliveryAddress.number && 
          deliveryAddress.neighborhood && deliveryAddress.city && 
          deliveryAddress.state && deliveryAddress.zipCode
        );
      case 'guest-info':
        return user || (guestInfo.name && guestInfo.email && guestInfo.phone);
      default:
        return true;
    }
  })();
  
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
        alert(`¡Pedido realizado exitosamente! Pagarás en efectivo al recibir.`);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ form: 'Error al crear el pedido. Inténtalo de nuevo.' });
      setCurrentStep('guest-info'); // Go back to previous step
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
          <div className="card-base p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center mr-3 shadow-saffron">
                <ShoppingBag className="w-5 h-5 text-orange-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Resumen del Pedido</h3>
            </div>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start p-4 bg-gradient-to-r from-saffron-50 to-persian-pink-50 rounded-xl">
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-saffron-600 ml-2 bg-saffron-100 px-2 py-0.5 rounded-full text-sm">x{item.quantity}</span>
                    {item.notes && (
                      <div className="text-sm text-persian-pink-600 mt-2 bg-persian-pink-50 px-3 py-1 rounded-lg">
                        Nota: {item.notes}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-gray-700">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="card-base p-6 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Impuestos</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-xl pt-3 border-t border-saffron-200 text-gray-700">
                  <span>Total</span>
                  <span className="text-gradient-saffron">{formatCurrency(subtotal + tax)}</span>
                </div>
                
                {getBusinessIds().length > 1 && (
                  <div className="text-sm text-purple-700 bg-purple-100 px-3 py-2 rounded-lg mt-4">
                    Se crearán {getBusinessIds().length} pedidos separados (uno por negocio)
                  </div>
                )}
                
                <div className="text-sm text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg mt-4">
                  💵 Pago en efectivo al recibir tu pedido
                </div>
              </div>
            </div>
              
            {errors.items && (
              <div className="text-red-600 text-sm mt-4 bg-red-50 px-3 py-2 rounded-lg">{errors.items}</div>
            )}
          </div>
        );

      case 'fulfillment':
        return (
          <div className="card-base p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center mr-3 shadow-purple">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Selecciona Tipo de Entrega</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setFulfillmentType('pickup')}
                className={`card-interactive p-6 cursor-pointer transition-all duration-300 ${
                  fulfillmentType === 'pickup'
                    ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-mint-50 shadow-mint transform scale-105'
                    : 'hover:border-emerald-300 hover:shadow-brand-lg'
                }`}
              >
                <div className="flex items-start">
                  <div className={`mr-4 mt-1 ${fulfillmentType === 'pickup' ? 'text-emerald-600' : 'text-gray-500'}`}>
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-700 mb-1">Recoger en tienda</span>
                    <span className="text-sm text-gray-600 block mb-2">Recoge tu pedido directamente</span>
                    <span className="text-sm text-emerald-600 block font-medium">Sin costo de envío • Pago en efectivo</span>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => setFulfillmentType('delivery')}
                className={`card-interactive p-6 cursor-pointer transition-all duration-300 ${
                  fulfillmentType === 'delivery'
                    ? 'border-saffron-400 bg-gradient-to-r from-saffron-50 to-persian-pink-50 shadow-saffron transform scale-105'
                    : 'hover:border-saffron-300 hover:shadow-brand-lg'
                }`}
              >
                <div className="flex items-start">
                  <div className={`mr-4 mt-1 ${fulfillmentType === 'delivery' ? 'text-saffron-600' : 'text-gray-500'}`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-700 mb-1">Envío a domicilio</span>
                    <span className="text-sm text-gray-600 block mb-2">Entrega en tu dirección</span>
                    <span className="text-sm text-gray-600 block">+$30 por negocio • Pago en efectivo al recibir</span>
                  </div>
                </div>
              </div>
            </div>
            
            {errors.fulfillment && (
              <div className="text-red-600 text-sm mt-4 bg-red-50 px-3 py-2 rounded-lg">{errors.fulfillment}</div>
            )}
          </div>
        );

      case 'pickup-payment':
        return (
          <div className="space-y-6">
            <div className="card-base p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center mr-3 shadow-mint">
                  <Clock className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Hora de Recogida</h3>
              </div>

              {business?.operatingHours ? (
                <PickupTimeSelector
                  operatingHours={business.operatingHours}
                  selectedPickupTime={selectedPickupTime}
                  onPickupTimeSelect={(time) => {
                    setSelectedPickupTime(time);
                  }}
                  error={errors.pickupTime}
                />
              ) : (
                <div className="space-y-6">
                  <div className="card-base p-4 bg-gradient-to-r from-saffron-50 to-mint-50 border border-saffron-200">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-saffron-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-saffron-800">
                        <p className="font-medium mb-1">Selecciona tu horario de recogida</p>
                        <p className="text-saffron-700">
                          Preparamos tu pedido con 30 minutos de anticipación mínimo
                        </p>
                        <p className="text-emerald-700 font-medium mt-2">
                          💵 Pagarás en efectivo al recoger
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { time: '10:00', label: '10:00 AM' },
                      { time: '11:00', label: '11:00 AM' },
                      { time: '12:00', label: '12:00 PM' },
                      { time: '13:00', label: '1:00 PM' },
                      { time: '14:00', label: '2:00 PM' },
                      { time: '15:00', label: '3:00 PM' },
                      { time: '16:00', label: '4:00 PM' },
                      { time: '17:00', label: '5:00 PM' }
                    ].map((slot, index) => {
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
                          onClick={() => setSelectedPickupTime(pickupTimeSlot)}
                          className={`p-4 text-sm rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-saffron text-orange-900 border-saffron-400 shadow-saffron'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-persian-pink-50 hover:border-saffron-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{slot.label}</div>
                            <div className={`text-xs mt-1 ${
                              isSelected ? 'text-orange-700' : 'text-gray-500'
                            }`}>
                              Hoy
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedPickupTime && (
                    <div className="card-base p-4 bg-gradient-to-r from-emerald-50 to-mint-50 border border-emerald-200">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-emerald-800">Horario seleccionado</p>
                          <p className="text-sm text-emerald-700">{selectedPickupTime.displayTime}</p>
                          <p className="text-xs text-emerald-600 mt-1">Pago en efectivo al recoger</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.pickupTime && (
                    <div className="card-base p-3 bg-red-50 border border-red-200">
                      <p className="text-sm text-red-700">{errors.pickupTime}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'delivery-info':
        return (
          <div className="card-base p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-persian-pink rounded-lg flex items-center justify-center mr-3 shadow-pink">
                <MapPin className="w-5 h-5 text-pink-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Dirección de Entrega</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
                <input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="input-base"
                  placeholder="Nombre de la calle"
                />
                {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                <input
                  type="text"
                  value={deliveryAddress.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className="input-base"
                  placeholder="Número exterior"
                />
                {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colonia *</label>
                <input
                  type="text"
                  value={deliveryAddress.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className="input-base"
                  placeholder="Nombre de la colonia"
                />
                {errors.neighborhood && <p className="text-red-600 text-sm mt-1">{errors.neighborhood}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="input-base"
                  placeholder="Ciudad o municipio"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="input-base"
                  placeholder="Estado"
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                <input
                  type="text"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="input-base"
                  placeholder="CP"
                />
                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Referencia (opcional)</label>
                <input
                  type="text"
                  value={deliveryAddress.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className="input-base"
                  placeholder="Referencias para encontrar la dirección"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Especiales (opcional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="input-base resize-none"
                  placeholder="Instrucciones especiales para tu pedido..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="card-base p-4 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
              <div className="flex items-center text-sm text-saffron-700 mb-2">
                <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Tiempo estimado de entrega: 45-60 minutos</span>
              </div>
              <div className="text-sm text-saffron-600 mb-2">
                <strong>Costo de envío: {formatCurrency(deliveryFee)}</strong>
                {getBusinessIds().length > 1 && <span> ({getBusinessIds().length} negocios × $30)</span>}
              </div>
              <div className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                💵 Pago en efectivo al recibir
              </div>
            </div>
          </div>
        );

      case 'guest-info':
        return (
          <div className="space-y-6">
            <div className="card-base p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center mr-3 shadow-mint">
                  <User className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Información de Contacto</h3>
              </div>

              <div className="text-sm text-gray-600 mb-6 bg-gradient-to-r from-saffron-50 to-persian-pink-50 p-4 rounded-xl border border-saffron-200">
                Para procesar tu pedido, necesitamos tu información de contacto:
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    value={guestInfo.name}
                    onChange={(e) => handleGuestInfoChange('name', e.target.value)}
                    className="input-base"
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                    className="input-base"
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                    className="input-base"
                    placeholder="55 1234 5678"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  * Usaremos esta información únicamente para contactarte sobre tu pedido
                </div>
              </div>
            </div>
            
            <div className="card-base p-6 bg-gradient-to-r from-emerald-50 to-mint-50 border border-emerald-200">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Resumen Final</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {fulfillmentType === 'delivery' && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Impuestos</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-xl pt-3 border-t border-emerald-200 text-gray-700">
                  <span>Total</span>
                  <span className="text-gradient-saffron">{formatCurrency(finalTotal)}</span>
                </div>
                
                <div className="text-sm text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg mt-4">
                  💵 Método de pago: Efectivo {fulfillmentType === 'pickup' ? 'al recoger' : 'al recibir'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-6 shadow-saffron animate-pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-700">Procesando tu pedido...</h3>
            <p className="text-gray-600 mb-2">Por favor espera mientras confirmamos tu orden...</p>
            <p className="text-emerald-600 font-medium">💵 Recuerda tener efectivo listo para el pago</p>
            
            {errors.form && (
              <div className="mt-6 card-base p-4 border border-red-200 bg-red-50">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-brand-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-saffron-200 bg-gradient-saffron">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-orange-900">
              {stepConfig[currentStep].title}
            </h2>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-orange-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-600 to-orange-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${stepConfig[currentStep].progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-orange-800 mt-2 font-medium">
                Paso {Object.keys(stepConfig).indexOf(currentStep) + 1} de {Object.keys(stepConfig).length}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-orange-700 hover:text-orange-900 transition-colors ml-4 p-2 rounded-xl hover:bg-orange-200"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={modalContentRef}
          className="overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-main"
        >
          <div className="p-6">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer with navigation buttons */}
        {currentStep !== 'confirmation' && (
          <div className="p-6 border-t border-saffron-200 bg-gradient-to-r from-saffron-50 to-persian-pink-50">
            <div className="flex justify-between">
              <div>
                {canGoPrev() && (
                  <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className={`${getButtonClass('outline')} flex items-center`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {currentStep === 'review' && (
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className={getButtonClass('ghost')}
                  >
                    Continuar Comprando
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  disabled={!canGoNext() || isSubmitting}
                  className={`${getButtonClass('primary')} flex items-center min-w-[150px]`}
                >
                  {currentStep === 'guest-info' || currentStep === 'pickup-payment' || currentStep === 'delivery-info' ? (
                    isSubmitting ? 'Procesando...' : 'Realizar Pedido'
                  ) : (
                    <>
                      Continuar
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;