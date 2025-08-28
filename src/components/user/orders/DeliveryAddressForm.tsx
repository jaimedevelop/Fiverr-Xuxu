import React from 'react';
import FormInput from '../../common/FormInput';
import Button from '../../ui/Button';
import { getButtonClass, colors } from '../../../utils/themeHelper';

interface AddressFormData {
  street: string;
  number: string;
  apartment?: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

interface DeliveryAddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  defaultValues?: Partial<AddressFormData>;
  isLoading?: boolean;
}

export const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  onSubmit,
  defaultValues = {},
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<AddressFormData>({
    street: defaultValues.street || '',
    number: defaultValues.number || '',
    apartment: defaultValues.apartment || '',
    neighborhood: defaultValues.neighborhood || '',
    city: defaultValues.city || '',
    postalCode: defaultValues.postalCode || '',
    instructions: defaultValues.instructions || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card-base p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Dirección de Entrega</h3>
        <p className="text-sm text-gray-600">Completa los datos de tu dirección para recibir tu pedido</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="street"
            name="street"
            type="text"
            label="Calle"
            placeholder="Nombre de la calle"
            value={formData.street}
            onChange={handleChange}
            required
            className="input-base"
          />
          
          <FormInput
            id="number"
            name="number"
            type="text"
            label="Número"
            placeholder="Número exterior"
            value={formData.number}
            onChange={handleChange}
            required
            className="input-base"
          />
        </div>

        <FormInput
          id="apartment"
          name="apartment"
          type="text"
          label="Departamento/Interior (opcional)"
          placeholder="Depto, piso, interior, etc."
          value={formData.apartment || ''}
          onChange={handleChange}
          className="input-base"
        />

        <FormInput
          id="neighborhood"
          name="neighborhood"
          type="text"
          label="Colonia"
          placeholder="Nombre de la colonia"
          value={formData.neighborhood}
          onChange={handleChange}
          required
          className="input-base"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="city"
            name="city"
            type="text"
            label="Ciudad"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleChange}
            required
            className="input-base"
          />
          
          <FormInput
            id="postalCode"
            name="postalCode"
            type="text"
            label="Código Postal"
            placeholder="00000"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Instrucciones de entrega (opcional)
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows={4}
            placeholder="Ej: Timbre 201, dejar en portería, referencias adicionales, etc."
            value={formData.instructions}
            onChange={handleChange}
            className="input-base resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ayúdanos a entregar tu pedido más fácilmente con referencias adicionales
          </p>
        </div>

        <div className="bg-gradient-to-r from-saffron-50 to-persian-pink-50 rounded-xl p-4 border border-saffron-200">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-saffron-600 flex-shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-saffron-800 mb-1">Información importante</h4>
              <p className="text-sm text-saffron-700">
                Verifica que todos los datos sean correctos. Esta información se utilizará para la entrega de tu pedido.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`${getButtonClass('primary')} flex-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-800 mr-2"></div>
                Guardando...
              </div>
            ) : (
              'Guardar Dirección'
            )}
          </button>
          
          <button
            type="button"
            className={`${getButtonClass('outline')} flex-1`}
            onClick={() => {
              setFormData({
                street: '',
                number: '',
                apartment: '',
                neighborhood: '',
                city: '',
                postalCode: '',
                instructions: ''
              });
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};