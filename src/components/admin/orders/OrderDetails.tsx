import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, User } from 'lucide-react';
import { Order, OrderStatus } from '../../../types/order';
import { useOrders } from '../../../contexts/OrderContext';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';

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
        
        // Use real order data instead of mock data
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
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'delivered':
        return <Truck className="h-5 w-5 text-green-600" />;
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  const handleStatusUpdate = () => {
    if (!order) return;
    
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      onUpdateStatus(orderId, nextStatus);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
        <Button onClick={onBack}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <BaseCard title={`Pedido #${order.id.slice(-6)}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Información del pedido</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Fecha de creación:</dt>
                <dd className="text-sm font-medium">{formatDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Última actualización:</dt>
                <dd className="text-sm font-medium">{formatDate(order.updatedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tipo de entrega:</dt>
                <dd className="text-sm font-medium">
                  {order.fulfillmentType === 'delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Método de pago:</dt>
                <dd className="text-sm font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  {order.paymentMethod === 'card' ? 'Tarjeta' : 
                   order.paymentMethod === 'cash' ? 'Efectivo' : 'Digital'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">
                  {order.fulfillmentType === 'pickup' ? 'Hora de recogida:' : 'Tiempo estimado de entrega:'}
                </dt>
                <dd className="text-sm font-medium">{formatDate(order.estimatedDeliveryTime)}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Resumen del pago</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal:</dt>
                <dd className="text-sm font-medium">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Impuestos:</dt>
                <dd className="text-sm font-medium">{formatCurrency(order.tax)}</dd>
              </div>
              {order.fulfillmentType === 'delivery' && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Envío:</dt>
                  <dd className="text-sm font-medium">{formatCurrency(order.deliveryFee)}</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-900">Total:</dt>
                <dd className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </BaseCard>

      {/* Items */}
      <BaseCard title="Items del pedido">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio unitario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1">Notas: {item.notes}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
      </BaseCard>

      {/* Address or Pickup Info */}
      {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
        <BaseCard title="Dirección de entrega">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {order.deliveryAddress.street}, {order.deliveryAddress.colonia}
              </p>
              <p className="text-sm text-gray-500">
                {order.deliveryAddress.municipality}, {order.deliveryAddress.state} C.P. {order.deliveryAddress.postalCode}
              </p>
              {order.deliveryAddress.reference && (
                <p className="text-sm text-gray-500 mt-1">
                  Referencia: {order.deliveryAddress.reference}
                </p>
              )}
            </div>
          </div>
        </BaseCard>
      )}

      {order.fulfillmentType === 'pickup' && order.pickupTime && (
        <BaseCard title="Información de recogida">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Fecha: {order.pickupTime.date}
              </p>
              <p className="text-sm text-gray-500">
                Hora: {order.pickupTime.time}
              </p>
            </div>
          </div>
        </BaseCard>
      )}

      {/* Special Instructions */}
      {order.specialInstructions && (
        <BaseCard title="Instrucciones especiales">
          <p className="text-sm text-gray-700">{order.specialInstructions}</p>
        </BaseCard>
      )}

      {/* Actions */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="flex justify-end">
          <Button onClick={handleStatusUpdate}>
            {order.status === 'ready' ? 
              (order.fulfillmentType === 'pickup' ? 'Marcar como recogido' : 'Marcar como entregado') : 
             order.status === 'pending' ? 'Confirmar pedido' :
             order.status === 'confirmed' ? 'Comenzar preparación' :
             'Marcar como listo'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;