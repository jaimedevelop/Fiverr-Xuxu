import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, CheckCircle, ChefHat, Truck, Phone, Package } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import { useOrders } from '../../../contexts/OrderContext';
import { Order, FulfillmentType } from '../../../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';

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
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getOrderById } = useOrders();

  // Generate status timeline based on order data and fulfillment type
  const generateStatusTimeline = (order: Order): OrderStatus[] => {
    const now = new Date();
    const isDelivery = order.fulfillmentType === 'delivery';
    
    const baseStatuses: OrderStatus[] = [
      {
        id: 'pending',
        name: 'Pedido Recibido',
        description: 'Tu pedido ha sido recibido y está siendo procesado',
        icon: <CheckCircle className="h-6 w-6" />,
        completed: ['confirmed', 'preparing', 'ready', 'delivered'].includes(order.status),
        timestamp: order.createdAt ? new Date(order.createdAt).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit'
        }) : undefined
      },
      {
        id: 'confirmed',
        name: 'Confirmado',
        description: 'Tu pedido ha sido confirmado por el negocio',
        icon: <CheckCircle className="h-6 w-6" />,
        completed: ['preparing', 'ready', 'delivered'].includes(order.status),
        timestamp: order.status === 'confirmed' || ['preparing', 'ready', 'delivered'].includes(order.status) 
          ? new Date(now.getTime() - 20 * 60000).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            }) : undefined
      },
      {
        id: 'preparing',
        name: 'Preparando',
        description: 'Nuestros chefs están preparando tu pedido',
        icon: <ChefHat className="h-6 w-6" />,
        completed: ['ready', 'delivered'].includes(order.status),
        timestamp: order.status === 'preparing' || ['ready', 'delivered'].includes(order.status)
          ? new Date(now.getTime() - 10 * 60000).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            }) : undefined
      }
    ];

    // Add fulfillment-specific final statuses
    if (isDelivery) {
      baseStatuses.push(
        {
          id: 'ready-delivery',
          name: 'Listo para Entregar',
          description: 'Tu pedido está listo y será enviado pronto',
          icon: <Package className="h-6 w-6" />,
          completed: order.status === 'delivered',
          timestamp: order.status === 'ready' 
            ? new Date(now.getTime() - 5 * 60000).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined
        },
        {
          id: 'out-for-delivery',
          name: 'En Camino',
          description: 'Tu pedido está en camino a tu dirección',
          icon: <Truck className="h-6 w-6" />,
          completed: order.status === 'delivered',
          timestamp: order.status === 'out-for-delivery' 
            ? new Date(now.getTime() - 2 * 60000).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined
        },
        {
          id: 'delivered',
          name: 'Entregado',
          description: 'Tu pedido ha sido entregado exitosamente',
          icon: <CheckCircle className="h-6 w-6" />,
          completed: order.status === 'delivered',
          timestamp: order.status === 'delivered' 
            ? new Date().toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined
        }
      );
    } else {
      // Pickup orders
      baseStatuses.push(
        {
          id: 'ready-pickup',
          name: 'Listo para Recoger',
          description: 'Tu pedido está listo para ser recogido',
          icon: <Package className="h-6 w-6" />,
          completed: order.status === 'delivered', // In pickup context, "delivered" means "picked up"
          timestamp: order.status === 'ready' || order.status === 'delivered'
            ? new Date(now.getTime() - 2 * 60000).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined
        },
        {
          id: 'picked-up',
          name: 'Recogido',
          description: 'Tu pedido ha sido recogido exitosamente',
          icon: <CheckCircle className="h-6 w-6" />,
          completed: order.status === 'delivered',
          timestamp: order.status === 'delivered' 
            ? new Date().toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined
        }
      );
    }

    return baseStatuses;
  };

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchOrderData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const orderData = await getOrderById(orderId);
          if (orderData) {
            setOrder(orderData);
            setOrderStatuses(generateStatusTimeline(orderData));
          } else {
            setError('No se pudo encontrar el pedido');
          }
        } catch (err: any) {
          console.error('Error fetching order:', err);
          setError(err.message || 'Error al cargar la información del pedido');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrderData();
    }
  }, [isOpen, orderId, getOrderById]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No disponible';
    return `${address.street}, ${address.colonia}, ${address.municipality}`;
  };

  const formatEstimatedTime = (estimatedTime: Date | string) => {
    const date = typeof estimatedTime === 'string' ? new Date(estimatedTime) : estimatedTime;
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Pedido</h2>
            {order && (
              <div className="mt-1">
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
            )}
          </div>
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
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
              <Button onClick={onClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          ) : order ? (
            <>
              {/* Order Information */}
              <BaseCard title="Información del Pedido">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Pedido:</span>
                    <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pago:</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod === 'cash' ? 'Efectivo' : 
                       order.paymentMethod === 'card' ? 'Tarjeta' : 'Digital'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">
                      {order.fulfillmentType === 'delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}
                    </span>
                  </div>
                </div>
              </BaseCard>
              
              {/* Fulfillment Information */}
              <BaseCard 
                title={order.fulfillmentType === 'delivery' ? 'Información de Entrega' : 'Información de Recogida'} 
                actions={<MapPin className="h-5 w-5 text-gray-500" />}
              >
                <div className="space-y-2">
                  {order.fulfillmentType === 'delivery' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dirección:</span>
                        <span className="font-medium text-right">
                          {formatAddress(order.deliveryAddress)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hora Estimada:</span>
                        <span className="font-medium">{formatEstimatedTime(order.estimatedDeliveryTime)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Recogida:</span>
                        <span className="font-medium">
                          {order.pickupTime?.date || 'No especificada'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hora de Recogida:</span>
                        <span className="font-medium">
                          {order.pickupTime?.time || formatEstimatedTime(order.estimatedDeliveryTime)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Recoge tu pedido en la tienda a la hora indicada
                      </div>
                    </>
                  )}
                </div>
              </BaseCard>
              
              {/* Order Status Timeline */}
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
                      {/* Connection line between statuses */}
                      {index < orderStatuses.length - 1 && (
                        <div className={`absolute left-5 w-0.5 h-8 mt-10 ${
                          status.completed ? 'bg-green-200' : 'bg-gray-200'
                        }`} style={{ marginLeft: '20px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </BaseCard>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <BaseCard title="Artículos del Pedido">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          {item.notes && (
                            <div className="text-sm text-gray-500">{item.notes}</div>
                          )}
                        </div>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </BaseCard>
              )}

              {/* Special Instructions */}
              {order.specialInstructions && (
                <BaseCard title="Instrucciones Especiales">
                  <p className="text-gray-600">{order.specialInstructions}</p>
                </BaseCard>
              )}
              
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
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">No se encontró información del pedido</div>
              <Button onClick={onClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;