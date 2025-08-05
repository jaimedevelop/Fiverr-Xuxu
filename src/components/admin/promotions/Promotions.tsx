import React, { useState } from 'react';
import { Tag, List } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
        <p className="text-gray-600">Gestiona las promociones y descuentos de tu negocio</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              Lista de Promociones
            </div>
          </button>
          <button
            onClick={() => activeTab === 'form' ? setActiveTab('list') : handleAddNew()}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              {editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'list' && (
        <PromotionsList 
          loading={loading} 
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {activeTab === 'form' && (
        <PromotionForm 
          promotion={editingPromotion}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Promotions;