import React from 'react';
import { FulfillmentType } from '../../../types/order';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'scheduled';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  fulfillmentType?: FulfillmentType;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  fulfillmentType = 'delivery',
  size = 'md' 
}) => {
  const getStatusConfig = (status: OrderStatus, fulfillmentType: FulfillmentType) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendiente',
          bgColor: 'bg-gradient-to-r from-saffron-100 to-yellow-100',
          textColor: 'text-saffron-800',
          borderColor: 'border-saffron-300',
          shadowColor: 'shadow-saffron'
        };
      case 'confirmed':
        return {
          label: 'Confirmado',
          bgColor: 'bg-gradient-to-r from-purple-100 to-purple-200',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-300',
          shadowColor: 'shadow-purple'
        };
      case 'preparing':
        return {
          label: 'Preparando',
          bgColor: 'bg-gradient-to-r from-persian-pink-100 to-pink-200',
          textColor: 'text-persian-pink-800',
          borderColor: 'border-persian-pink-300',
          shadowColor: 'shadow-pink'
        };
      case 'ready':
        return {
          label: fulfillmentType === 'pickup' ? 'Listo para Recoger' : 'Listo para Entregar',
          bgColor: 'bg-gradient-to-r from-emerald-100 to-mint-100',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-300',
          shadowColor: 'shadow-mint'
        };
      case 'out-for-delivery':
        return {
          label: 'En Camino',
          bgColor: 'bg-gradient-to-r from-blue-100 to-cyan-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-300',
          shadowColor: 'shadow-lg'
        };
      case 'delivered':
        return {
          label: fulfillmentType === 'pickup' ? 'Recogido' : 'Entregado',
          bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-300',
          shadowColor: 'shadow-mint'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          bgColor: 'bg-gradient-to-r from-red-100 to-pink-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          shadowColor: 'shadow-lg'
        };
      case 'scheduled':
        return {
          label: 'Programado',
          bgColor: 'bg-gradient-to-r from-cyan-100 to-blue-100',
          textColor: 'text-cyan-800',
          borderColor: 'border-cyan-300',
          shadowColor: 'shadow-lg'
        };
      default:
        return {
          label: 'Desconocido',
          bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          shadowColor: 'shadow-sm'
        };
    }
  };

  const config = getStatusConfig(status, fulfillmentType);
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold transition-all duration-300 hover:scale-105 ${config.bgColor} ${config.textColor} ${sizeClasses[size]} border ${config.borderColor} ${config.shadowColor}`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'delivered' ? 'bg-emerald-600' :
        status === 'cancelled' ? 'bg-red-600' :
        status === 'preparing' ? 'bg-persian-pink-600' :
        status === 'ready' ? 'bg-emerald-600' :
        status === 'confirmed' ? 'bg-purple-600' :
        status === 'pending' ? 'bg-saffron-600' :
        'bg-gray-600'
      }`}></div>
      {config.label}
    </span>
  );
};