import React from 'react';
import FormInput from '../../common/FormInput';
import Button from '../../ui/Button';

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
          Instrucciones de entrega (opcional)
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows={3}
          placeholder="Ej: Timbre 201, dejar en portería, etc."
          value={formData.instructions}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar Dirección'}
      </Button>
    </form>
  );
};