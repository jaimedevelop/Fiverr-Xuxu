import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, User } from 'lucide-react';
import { Order, OrderStatus } from '../../../types/order';
import { useOrders } from '../../../contexts/OrderContext';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import { getButtonClass, getBusinessStatusStyle, colors } from '../../../utils/themeHelper';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onBack, onUpdateStatus }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getOrderById } = useOrders();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const orderData = await getOrderById(orderId);
        
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('No se pudo encontrar el pedido');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'confirmed':
      case 'preparing':
        return <Clock className="h-5 w-5 text-sky-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'delivered':
        return <Truck className="h-5 w-5 text-emerald-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return order?.fulfillmentType === 'pickup' ? 'Listo para recoger' : 'Listo para entrega';
      case 'delivered':
        return order?.fulfillmentType === 'pickup' ? 'Recogido' : 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
      case 'preparing':
        return 'badge-info';
      case 'ready':
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-base bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (date: Date | any) => {
    // Handle Firestore Timestamp objects
    let actualDate: Date;
    
    if (date && typeof date === 'object' && 'seconds' in date) {
      // Firestore Timestamp - convert to Date
      actualDate = new Date(date.seconds * 1000);
    } else if (date instanceof Date) {
      actualDate = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      actualDate = new Date(date);
    } else {
      return 'Fecha inválida';
    }
    
    // Check if the date is valid
    if (isNaN(actualDate.getTime())) {
      return 'Fecha inválida';
    }
    
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(actualDate);
  };

  const formatPickupDate = (datetime: Date | any) => {
    // Handle Firestore Timestamp objects
    let actualDate: Date;
    
    if (datetime && typeof datetime === 'object' && 'seconds' in datetime) {
      actualDate = new Date(datetime.seconds * 1000);
    } else if (datetime instanceof Date) {
      actualDate = datetime;
    } else {
      actualDate = new Date(datetime);
    }
    
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(actualDate);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;
    
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      // Update the status
      await onUpdateStatus(orderId, nextStatus);
      
      // Refresh the order data to show updated information
      try {
        const updatedOrderData = await getOrderById(orderId);
        if (updatedOrderData) {
          setOrder(updatedOrderData);
        }
      } catch (err) {
        console.error('Error refreshing order after status update:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-500 mb-4">
          <XCircle className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el pedido</h3>
        <p className="text-gray-500 mb-4">
          {error || 'No se pudo encontrar el pedido solicitado.'}
        </p>
        <button className={getButtonClass('outline')} onClick={onBack}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          className={`${getButtonClass('outline')} flex items-center`}
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>
        
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span className={`ml-2 ${getStatusBadgeClass(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <div className="card-base">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Pedido #{order.id.slice(-6)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Información del pedido</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Fecha de creación:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Última actualización:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(order.updatedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Tipo de entrega:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.fulfillmentType === 'delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Método de pago:</dt>
                  <dd className="text-sm font-medium text-gray-900 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                    {order.paymentMethod === 'card' ? 'Tarjeta' : 
                     order.paymentMethod === 'cash' ? 'Efectivo' : 'Digital'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">
                    {order.fulfillmentType === 'pickup' ? 'Hora de recogida:' : 'Tiempo estimado de entrega:'}
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(order.estimatedDeliveryTime)}</dd>
                </div>
                {/* Show delivered/picked up time if order is completed */}
                {order.status === 'delivered' && order.deliveredAt && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">
                      {order.fulfillmentType === 'pickup' ? 'Recogido el:' : 'Entregado el:'}
                    </dt>
                    <dd className="text-sm font-medium text-emerald-600">{formatDate(order.deliveredAt)}</dd>
                  </div>
                )}
              </dl>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Resumen del pago</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Subtotal:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Impuestos:</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(order.tax)}</dd>
                </div>
                {order.fulfillmentType === 'delivery' && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Envío:</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatCurrency(order.deliveryFee)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <dt className="text-base font-semibold text-gray-900">Total:</dt>
                  <dd className="text-base font-bold text-saffron-600">{formatCurrency(order.total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card-base">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Items del pedido</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-main">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Precio unitario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/90 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">Notas: {item.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Address or Pickup Info */}
      {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
        <div className="card-base">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dirección de entrega</h2>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-saffron-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.deliveryAddress.street}, {order.deliveryAddress.colonia}
                </p>
                <p className="text-sm text-gray-600">
                  {order.deliveryAddress.municipality}, {order.deliveryAddress.state} C.P. {order.deliveryAddress.postalCode}
                </p>
                {order.deliveryAddress.reference && (
                  <p className="text-sm text-gray-600 mt-1">
                    Referencia: {order.deliveryAddress.reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Pickup Information Section */}
      {order.fulfillmentType === 'pickup' && order.pickupTime && (
        <div className="card-base">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {order.status === 'delivered' ? 'Información de recogida completada' : 'Información de recogida'}
            </h2>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-saffron-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Fecha: {formatPickupDate(order.pickupTime.datetime)}
                </p>
                <p className="text-sm text-gray-600">
                  Hora: {order.pickupTime.displayTime}
                </p>
                {/* Show actual pickup time if order is completed */}
                {order.status === 'delivered' && order.deliveredAt && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    ✓ Recogido el: {formatDate(order.deliveredAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="card-base">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instrucciones especiales</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{order.specialInstructions}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="flex justify-end">
          <button className={getButtonClass('admin')} onClick={handleStatusUpdate}>
            {order.status === 'ready' ? 
              (order.fulfillmentType === 'pickup' ? 'Marcar como recogido' : 'Marcar como entregado') : 
             order.status === 'pending' ? 'Confirmar pedido' :
             order.status === 'confirmed' ? 'Comenzar preparación' :
             'Marcar como listo'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;