import React, { useState } from 'react';
import { Tag, List, Plus, TrendingUp, Calendar, Users, AlertCircle, Percent, DollarSign, Gift, Sparkles } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
  const averageUsageRate = mockPromotions.length > 0 
    ? Math.round((totalUsage / mockPromotions.reduce((sum, p) => sum + p.usageLimit, 0)) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="card-base p-8 max-w-sm mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-pink rounded-full flex items-center justify-center animate-pulse">
              <Tag className="w-8 h-8 text-pink-700" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-medium">Cargando promociones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="card-base p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-pink rounded-2xl flex items-center justify-center shadow-brand-lg">
                  <Tag className="w-8 h-8 text-pink-700" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    Promociones y Descuentos
                  </h1>
                  <p className="text-lg text-gray-600">
                    Atrae más clientes con promociones irresistibles para tu repostería
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-700 font-medium">{activePromotions} activas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">{totalUsage} usos totales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">{averageUsageRate}% tasa promedio</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={handleAddNew}
                  className={getButtonClass('primary')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nueva Promoción
                </button>
              </div>
            </div>

            {/* Mobile Add Button */}
            <div className="sm:hidden mt-6">
              <button
                onClick={handleAddNew}
                className={`${getButtonClass('primary')} w-full`}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nueva Promoción
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card-base p-6 bg-red-50 border-red-200 border">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Error en Promociones</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-800 mb-1">Promociones Activas</p>
                  <p className="text-3xl font-bold text-purple-900">{activePromotions}</p>
                  <p className="text-xs text-purple-700 mt-1">de {mockPromotions.length} totales</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Usos Totales</p>
                  <p className="text-3xl font-bold text-blue-900">{totalUsage}</p>
                  <p className="text-xs text-blue-700 mt-1">códigos utilizados</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800 mb-1">Descuentos Otorgados</p>
                  <p className="text-3xl font-bold text-emerald-900">${totalRevenueSaved.toFixed(0)}</p>
                  <p className="text-xs text-emerald-700 mt-1">valor en descuentos</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-800 mb-1">Tasa de Uso Promedio</p>
                  <p className="text-3xl font-bold text-orange-900">{averageUsageRate}%</p>
                  <p className="text-xs text-orange-700 mt-1">códigos vs límite</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Types Info */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tipos de Promociones Disponibles</h2>
                <p className="text-gray-600 text-sm">Diferentes opciones para atraer y retener clientes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900">Porcentaje</h3>
                </div>
                <p className="text-sm text-purple-800">Descuento porcentual sobre el precio original</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-900">Monto Fijo</h3>
                </div>
                <p className="text-sm text-emerald-800">Descuento de cantidad fija en pesos mexicanos</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-pink-900">2x1 Especial</h3>
                </div>
                <p className="text-sm text-pink-800">Compra uno y llévate otro gratis en productos seleccionados</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Envío Gratis</h3>
                </div>
                <p className="text-sm text-blue-800">Elimina costo de envío con compra mínima</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="card-base p-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-4 px-6 border-b-3 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-xl ${
                    activeTab === 'list'
                      ? 'border-pink-500 text-pink-700 bg-pink-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'list' 
                        ? 'bg-pink-100' 
                        : 'bg-gray-100'
                    }`}>
                      <List className={`h-4 w-4 ${
                        activeTab === 'list' 
                          ? 'text-pink-600' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Lista de Promociones</div>
                      <div className="text-xs text-gray-500 font-normal hidden md:block">
                        Ver y gestionar promociones existentes
                      </div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => activeTab === 'form' ? setActiveTab('list') : handleAddNew()}
                  className={`py-4 px-6 border-b-3 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-xl ${
                    activeTab === 'form'
                      ? 'border-pink-500 text-pink-700 bg-pink-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === 'form' 
                        ? 'bg-pink-100' 
                        : 'bg-gray-100'
                    }`}>
                      <Tag className={`h-4 w-4 ${
                        activeTab === 'form' 
                          ? 'text-pink-600' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}</div>
                      <div className="text-xs text-gray-500 font-normal hidden md:block">
                        {editingPromotion ? 'Modificar promoción existente' : 'Crear nueva promoción'}
                      </div>
                    </div>
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'list' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <List className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Gestión de Promociones
                      </h2>
                      <p className="text-gray-600">
                        Administra todas tus promociones y códigos de descuento
                      </p>
                    </div>
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
                <div className="animate-fadeIn">
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
        </div>
      </div>
    </div>
  );
};

export default Promotions;