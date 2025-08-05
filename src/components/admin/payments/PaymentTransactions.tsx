import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import DataTable from '../../../components/common/DataTable';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';

interface PaymentTransaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: Date;
  transactionId?: string;
}

interface PaymentTransactionsProps {
  loading?: boolean;
  error?: string | null;
}

const PaymentTransactions: React.FC<PaymentTransactionsProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Mock data for development
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        orderId: 'ORD-001',
        customerName: 'Juan Pérez',
        amount: 250,
        paymentMethod: 'Tarjeta de Crédito',
        status: 'completed',
        date: new Date(2023, 5, 15),
        transactionId: 'txn_123456'
      },
      {
        id: '2',
        orderId: 'ORD-002',
        customerName: 'María García',
        amount: 180,
        paymentMethod: 'Efectivo',
        status: 'completed',
        date: new Date(2023, 5, 16)
      },
      {
        id: '3',
        orderId: 'ORD-003',
        customerName: 'Carlos López',
        amount: 320,
        paymentMethod: 'Transferencia Bancaria',
        status: 'pending',
        date: new Date(2023, 5, 17)
      },
      {
        id: '4',
        orderId: 'ORD-004',
        customerName: 'Ana Martínez',
        amount: 150,
        paymentMethod: 'Tarjeta de Débito',
        status: 'failed',
        date: new Date(2023, 5, 18)
      },
      {
        id: '5',
        orderId: 'ORD-005',
        customerName: 'Roberto Sánchez',
        amount: 200,
        paymentMethod: 'Tarjeta de Crédito',
        status: 'refunded',
        date: new Date(2023, 5, 19),
        transactionId: 'txn_789012'
      }
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let result = transactions;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.customerName.toLowerCase().includes(term) ||
        transaction.orderId.toLowerCase().includes(term) ||
        transaction.paymentMethod.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(transaction => transaction.status === statusFilter);
    }
    
    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, statusFilter]);

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'refunded', label: 'Reembolsado' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'failed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Fallido</span>;
      case 'refunded':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Reembolsado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    // In a real app, this would open a modal or navigate to a details page
    alert(`Ver detalles de la transacción: ${transaction.id}`);
  };

  const handleExportData = () => {
    // In a real app, this would export the data to CSV or Excel
    alert('Exportando datos de transacciones...');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const columns = [
    {
      key: 'id' as keyof PaymentTransaction,
      title: 'ID de Transacción',
      render: (row: PaymentTransaction) => <span className="text-sm font-medium text-gray-900">{row.id}</span>
    },
    {
      key: 'orderId' as keyof PaymentTransaction,
      title: 'Orden',
      render: (row: PaymentTransaction) => <span className="text-sm text-gray-900">{row.orderId}</span>
    },
    {
      key: 'customerName' as keyof PaymentTransaction,
      title: 'Cliente',
      render: (row: PaymentTransaction) => <span className="text-sm text-gray-900">{row.customerName}</span>
    },
    {
      key: 'amount' as keyof PaymentTransaction,
      title: 'Monto',
      render: (row: PaymentTransaction) => <span className="text-sm font-medium text-gray-900">{formatCurrency(row.amount)}</span>
    },
    {
      key: 'paymentMethod' as keyof PaymentTransaction,
      title: 'Método de Pago',
      render: (row: PaymentTransaction) => <span className="text-sm text-gray-900">{row.paymentMethod}</span>
    },
    {
      key: 'status' as keyof PaymentTransaction,
      title: 'Estado',
      render: (row: PaymentTransaction) => getStatusBadge(row.status)
    },
    {
      key: 'date' as keyof PaymentTransaction,
      title: 'Fecha',
      render: (row: PaymentTransaction) => <span className="text-sm text-gray-500">{formatDate(row.date)}</span>
    },
    {
      key: 'id' as keyof PaymentTransaction,
      title: 'Acciones',
      render: (row: PaymentTransaction) => (
        <Button
          variant="outline"
          onClick={() => handleViewDetails(row)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <BaseCard title="Transacciones de Pago">
      {error && <div className="mb-6 text-red-600">{error}</div>}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="w-48"
          />
          
          <Button
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={currentItems}
            emptyMessage="No se encontraron transacciones"
          />
          
          {filteredTransactions.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="text-sm"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="text-sm"
                >
                  Siguiente
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredTransactions.length)}
                    </span>{' '}
                    de <span className="font-medium">{filteredTransactions.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </BaseCard>
  );
};

export default PaymentTransactions;