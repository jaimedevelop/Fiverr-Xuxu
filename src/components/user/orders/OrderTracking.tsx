import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, CheckCircle, ChefHat, Truck, Phone } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

interface OrderStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  timestamp?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ isOpen, onClose, orderId }) => {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      // Simulate fetching order status
      const fetchOrderStatus = async () => {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const now = new Date();
        const statuses: OrderStatus[] = [
          {
            id: 'received',
            name: 'Pedido Recibido',
            description: 'Tu pedido ha sido recibido y está siendo procesado',
            icon: <CheckCircle className="h-6 w-6" />,
            completed: true,
            timestamp: new Date(now.getTime() - 30 * 60000).toLocaleTimeString()
          },
          {
            id: 'preparing',
            name: 'Preparando',
            description: 'Nuestros chefs están preparando tu pedido',
            icon: <ChefHat className="h-6 w-6" />,
            completed: true,
            timestamp: new Date(now.getTime() - 15 * 60000).toLocaleTimeString()
          },
          {
            id: 'ready',
            name: 'Listo para Recoger',
            description: 'Tu pedido está listo para ser recogido',
            icon: <CheckCircle className="h-6 w-6" />,
            completed: false
          },
          {
            id: 'delivering',
            name: 'En Camino',
            description: 'Tu pedido está en camino',
            icon: <Truck className="h-6 w-6" />,
            completed: false
          },
          {
            id: 'delivered',
            name: 'Entregado',
            description: 'Tu pedido ha sido entregado',
            icon: <CheckCircle className="h-6 w-6" />,
            completed: false
          }
        ];
        
        setOrderStatuses(statuses);
        setEstimatedDelivery(new Date(now.getTime() + 45 * 60000).toLocaleTimeString());
        setDeliveryAddress('Calle Principal 123, Colonia Centro, Ciudad de México');
        setIsLoading(false);
      };
      
      fetchOrderStatus();
    }
  }, [isOpen, orderId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Order ID */}
              <BaseCard title="Información del Pedido">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Pedido:</span>
                    <span className="font-medium">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{formatCurrency(350)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pago:</span>
                    <span className="font-medium">Efectivo</span>
                  </div>
                </div>
              </BaseCard>
              
              {/* Delivery Information */}
              <BaseCard title="Información de Entrega" actions={<MapPin className="h-5 w-5 text-gray-500" />}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium text-right">{deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora Estimada:</span>
                    <span className="font-medium">{estimatedDelivery}</span>
                  </div>
                </div>
              </BaseCard>
              
              {/* Order Status */}
              <BaseCard title="Estado del Pedido" actions={<Clock className="h-5 w-5 text-gray-500" />}>
                <div className="space-y-4">
                  {orderStatuses.map((status, index) => (
                    <div key={status.id} className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        status.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {status.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${
                            status.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {status.name}
                          </h3>
                          {status.timestamp && (
                            <span className="text-xs text-gray-500">{status.timestamp}</span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          status.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {status.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </BaseCard>
              
              {/* Contact Information */}
              <BaseCard title="Contacto" actions={<Phone className="h-5 w-5 text-gray-500" />}>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Si tienes alguna pregunta sobre tu pedido, contáctanos:
                  </p>
                  <p className="font-medium">555-123-4567</p>
                  <p className="text-sm text-gray-600">Lunes a Sábado: 9:00 AM - 9:00 PM</p>
                </div>
              </BaseCard>
              
              {/* Action Button */}
              <Button
                onClick={onClose}
                className="w-full"
              >
                Cerrar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;