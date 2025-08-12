import React, { useState } from 'react';
import { Tag, List, Plus, TrendingUp, Calendar, Users, AlertCircle } from 'lucide-react';
import PromotionsList from './PromotionsList';
import PromotionForm from './PromotionForm';
import BaseCard from '../../../components/common/BaseCard';

interface Promotion {
  id?: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping';
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  applicableItems: string[];
  code?: string;
}

interface PromotionsProps {
  loading?: boolean;
  error?: string | null;
}

const Promotions: React.FC<PromotionsProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  // Mock promotions data for statistics
  const mockPromotions = [
    {
      id: '1',
      title: 'Descuento de Verano',
      description: '20% de descuento en todos los pasteles',
      type: 'percentage' as const,
      value: 20,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      isActive: true,
      usageLimit: 100,
      usedCount: 45,
      applicableItems: ['pastry1', 'pastry2'],
      code: 'VERANO20'
    },
    {
      id: '2',
      title: 'Compra 2 y lleva 3',
      description: 'Lleva un croissant gratis al comprar 2',
      type: 'buy_one_get_one' as const,
      value: 1,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
      isActive: true,
      usageLimit: 50,
      usedCount: 12,
      applicableItems: ['pastry3'],
      code: 'CROISSANT3'
    },
    {
      id: '3',
      title: 'Descuento Fijo',
      description: '$50 de descuento en compras mayores a $300',
      type: 'fixed_amount' as const,
      value: 50,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-15'),
      isActive: false,
      usageLimit: 25,
      usedCount: 8,
      applicableItems: [],
      code: 'FIJO50'
    }
  ];

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setActiveTab('form');
  };

  const handleDelete = (promotionId: string) => {
    // In a real app, this would delete the promotion from the API
    console.log('Deleting promotion:', promotionId);
  };

  const handleView = (promotion: Promotion) => {
    // In a real app, this would show a modal or navigate to a details page
    alert(`Ver detalles de la promoción: ${promotion.title}`);
  };

  const handleSave = (promotion: Promotion) => {
    // In a real app, this would save the promotion to the API
    console.log('Saving promotion:', promotion);
    setActiveTab('list');
    setEditingPromotion(null);
  };

  const handleCancel = () => {
    setActiveTab('list');
    setEditingPromotion(null);
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setActiveTab('form');
  };

  // Calculate statistics
  const activePromotions = mockPromotions.filter(p => p.isActive).length;
  const totalUsage = mockPromotions.reduce((sum, p) => sum + p.usedCount, 0);
  const totalRevenueSaved = mockPromotions.reduce((sum, p) => {
    if (p.type === 'percentage') {
      return sum + (p.usedCount * 25 * p.value / 100); // Assuming $25 average order
    } else if (p.type === 'fixed_amount') {
      return sum + (p.usedCount * p.value);
    }
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-2 sm:p-2 lg:p-2">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Promociones y Descuentos
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Gestiona promociones para atraer más clientes y aumentar ventas
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={handleAddNew}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
                >
                  <Plus size={18} />
                  Nueva Promoción
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Promociones Activas</p>
                  <p className="text-3xl font-bold text-purple-600">{activePromotions}</p>
                  <p className="text-xs text-purple-600 mt-1">de {mockPromotions.length} totales</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Usos Totales</p>
                  <p className="text-3xl font-bold text-blue-600">{totalUsage}</p>
                  <p className="text-xs text-blue-600 mt-1">códigos utilizados</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Descuentos Otorgados</p>
                  <p className="text-3xl font-bold text-green-600">${totalRevenueSaved.toFixed(0)}</p>
                  <p className="text-xs text-green-600 mt-1">valor en descuentos</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tasa de Uso Promedio</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {mockPromotions.length > 0 ? Math.round((totalUsage / mockPromotions.reduce((sum, p) => sum + p.usageLimit, 0)) * 100) : 0}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1">códigos vs límite</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'list'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <div className="text-left">
                      <div>Lista de Promociones</div>
                      <div className="text-xs text-gray-400 font-normal">
                        Ver y gestionar promociones existentes
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => activeTab === 'form' ? setActiveTab('list') : handleAddNew()}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'form'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <div className="text-left">
                      <div>{editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}</div>
                      <div className="text-xs text-gray-400 font-normal">
                        {editingPromotion ? 'Modificar promoción existente' : 'Crear nueva promoción'}
                      </div>
                    </div>
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'list' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Gestión de Promociones
                    </h2>
                    <p className="text-gray-600">
                      Administra todas tus promociones y códigos de descuento activos
                    </p>
                  </div>
                  
                  <PromotionsList 
                    loading={loading} 
                    error={error}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </div>
              )}

              {activeTab === 'form' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {editingPromotion ? 'Editar Promoción' : 'Crear Nueva Promoción'}
                    </h2>
                    <p className="text-gray-600">
                      {editingPromotion 
                        ? 'Modifica los detalles de la promoción existente'
                        : 'Configura una nueva promoción para atraer más clientes'
                      }
                    </p>
                  </div>
                  
                  <PromotionForm 
                    promotion={editingPromotion}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Promotion Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Consejos para Promociones Efectivas
              </h2>
              <p className="text-gray-600">
                Mejores prácticas para maximizar el impacto de tus promociones
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-blue-800">Timing Estratégico</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Programa promociones durante temporadas altas, días festivos o cuando necesites impulsar las ventas.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-green-800">Segmentación</h3>
                </div>
                <p className="text-sm text-green-700">
                  Crea promociones específicas para diferentes tipos de clientes o productos para mejorar la conversión.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-purple-800">Medición de Resultados</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Monitorea el rendimiento de tus promociones para identificar qué funciona mejor y optimizar futuras campañas.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Tag className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="text-sm font-medium text-purple-800 mb-1">Promoción Flash</h4>
                <p className="text-xs text-purple-600">Crear descuento por tiempo limitado</p>
              </button>
              
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="text-sm font-medium text-blue-800 mb-1">Clientes Leales</h4>
                <p className="text-xs text-blue-600">Descuento para clientes frecuentes</p>
              </button>
              
              <button className="bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="text-sm font-medium text-green-800 mb-1">Análisis de Rendimiento</h4>
                <p className="text-xs text-green-600">Ver estadísticas detalladas</p>
              </button>
              
              <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                <h4 className="text-sm font-medium text-orange-800 mb-1">Programar Promoción</h4>
                <p className="text-xs text-orange-600">Configurar fechas automáticas</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Promotions;