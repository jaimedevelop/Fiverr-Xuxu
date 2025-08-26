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
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'confirmed':
        return {
          label: 'Confirmado',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'preparing':
        return {
          label: 'Preparando',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200'
        };
      case 'ready':
        return {
          label: fulfillmentType === 'pickup' ? 'Listo para Recoger' : 'Listo para Entregar',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'out-for-delivery':
        return {
          label: 'En Camino',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          borderColor: 'border-indigo-200'
        };
      case 'delivered':
        return {
          label: fulfillmentType === 'pickup' ? 'Recogido' : 'Entregado',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'scheduled':
        return {
          label: 'Programado',
          bgColor: 'bg-cyan-100',
          textColor: 'text-cyan-800',
          borderColor: 'border-cyan-200'
        };
      default:
        return {
          label: 'Desconocido',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status, fulfillmentType);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]} border ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
};