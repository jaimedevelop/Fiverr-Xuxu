import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, DollarSign, CreditCard, Users, Calendar, TrendingUp, FileText } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
      },
      {
        id: '6',
        orderId: 'ORD-006',
        customerName: 'Sofia Hernández',
        amount: 75,
        paymentMethod: 'Efectivo',
        status: 'completed',
        date: new Date(2023, 5, 20)
      },
      {
        id: '7',
        orderId: 'ORD-007',
        customerName: 'Luis Torres',
        amount: 420,
        paymentMethod: 'Transferencia Bancaria',
        status: 'completed',
        date: new Date(2023, 5, 21)
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
        transaction.paymentMethod.toLowerCase().includes(term) ||
        transaction.id.toLowerCase().includes(term)
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
      hour: '2-digit',
      minute: '2-digit',
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
        return <span className="badge-success">Completado</span>;
      case 'pending':
        return <span className="badge-base bg-amber-100 text-amber-800">Pendiente</span>;
      case 'failed':
        return <span className="badge-closed">Fallido</span>;
      case 'refunded':
        return <span className="badge-base bg-blue-100 text-blue-800">Reembolsado</span>;
      default:
        return <span className="badge-base bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.toLowerCase().includes('tarjeta')) {
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    } else if (method.toLowerCase().includes('efectivo')) {
      return <DollarSign className="h-4 w-4 text-green-500" />;
    } else if (method.toLowerCase().includes('transferencia')) {
      return <TrendingUp className="h-4 w-4 text-purple-500" />;
    }
    return <CreditCard className="h-4 w-4 text-gray-500" />;
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    // In a real app, this would open a modal or navigate to a details page
    alert(`Ver detalles de la transacción: ${transaction.id}`);
  };

  const handleExportData = () => {
    // In a real app, this would export the data to CSV or Excel
    alert('Exportando datos de transacciones...');
  };

  // Calculate statistics
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed');
  const successRate = filteredTransactions.length > 0 
    ? Math.round((completedTransactions.length / filteredTransactions.length) * 100)
    : 0;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const columns = [
    {
      key: 'id' as keyof PaymentTransaction,
      title: 'ID Transacción',
      render: (row: PaymentTransaction) => (
        <div>
          <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
            {row.id}
          </span>
          {row.transactionId && (
            <div className="text-xs text-blue-600 font-mono mt-1">
              {row.transactionId}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'orderId' as keyof PaymentTransaction,
      title: 'Orden',
      render: (row: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{row.orderId}</span>
        </div>
      )
    },
    {
      key: 'customerName' as keyof PaymentTransaction,
      title: 'Cliente',
      render: (row: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-saffron rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-900" />
          </div>
          <span className="text-sm font-medium text-gray-900">{row.customerName}</span>
        </div>
      )
    },
    {
      key: 'amount' as keyof PaymentTransaction,
      title: 'Monto',
      render: (row: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-gray-900">{formatCurrency(row.amount)}</span>
        </div>
      )
    },
    {
      key: 'paymentMethod' as keyof PaymentTransaction,
      title: 'Método de Pago',
      render: (row: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          {getPaymentMethodIcon(row.paymentMethod)}
          <span className="text-sm text-gray-900">{row.paymentMethod}</span>
        </div>
      )
    },
    {
      key: 'status' as keyof PaymentTransaction,
      title: 'Estado',
      render: (row: PaymentTransaction) => getStatusBadge(row.status)
    },
    {
      key: 'date' as keyof PaymentTransaction,
      title: 'Fecha',
      render: (row: PaymentTransaction) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{formatDate(row.date)}</span>
        </div>
      )
    },
    {
      key: 'id' as keyof PaymentTransaction,
      title: 'Acciones',
      render: (row: PaymentTransaction) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          title="Ver detalles"
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">Total Transacciones</p>
              <p className="text-2xl font-bold text-emerald-900">{filteredTransactions.length}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Monto Total</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Completadas</p>
              <p className="text-2xl font-bold text-purple-900">{completedTransactions.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-orange-900">{successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <BaseCard>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Historial de Transacciones</h2>
              <p className="text-gray-600 text-sm">
                {filteredTransactions.length} transacciones encontradas
              </p>
            </div>
          </div>
          
          <button
            onClick={handleExportData}
            className={getButtonClass('outline')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por cliente, orden, ID o método de pago..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-base"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="pl-10 input-base"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse">
              <DollarSign className="w-6 h-6 text-orange-900" />
            </div>
            <p className="text-gray-600 font-medium ml-4">Cargando transacciones...</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <DataTable
                columns={columns}
                data={currentItems}
                emptyMessage={
                  searchTerm || statusFilter !== 'all' 
                    ? "No se encontraron transacciones con los filtros aplicados"
                    : "No hay transacciones registradas"
                }
              />
            </div>
            
            {/* Pagination */}
            {filteredTransactions.length > itemsPerPage && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`${getButtonClass('outline')} text-sm`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`${getButtonClass('outline')} text-sm`}
                  >
                    Siguiente
                  </button>
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                            currentPage === number
                              ? 'z-10 bg-saffron-50 border-saffron-500 text-saffron-700'
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
    </div>
  );
};

export default PaymentTransactions;