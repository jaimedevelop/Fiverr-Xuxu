import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Download } from 'lucide-react';

interface TableColumn<T> {
  key: keyof T | string; // Allow string keys for custom columns like 'actions'
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  exportable?: boolean;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  className?: string;
}

function DataTable<T>({
  data,
  columns,
  pagination = true,
  sorting = true,
  filtering = true,
  exportable = true,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  pageSize = 10,
  className = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [filterValue, setFilterValue] = useState('');

  // Safe data access with fallback
  const safeData = data || [];

  console.log('📊 DataTable Debug:', {
    dataLength: safeData.length,
    columns: columns.map(col => col.key),
    filterValue,
    currentPage,
    sortConfig
  });

  // Handle sorting
  const handleSort = (key: keyof T | string) => {
    if (!sorting) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data with null safety
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return safeData;

    return [...safeData].sort((a, b) => {
      // Skip sorting for custom columns like 'actions'
      if (typeof sortConfig.key === 'string' && !(sortConfig.key in a)) {
        return 0;
      }

      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [safeData, sortConfig]);

  // Filter data with null safety
  const filteredData = React.useMemo(() => {
    if (!filterValue) return sortedData;

    return sortedData.filter((item) => {
      return columns.some((column) => {
        // Skip custom columns like 'actions' for filtering
        if (typeof column.key === 'string' && !(column.key in item)) {
          return false;
        }
        
        const value = item[column.key as keyof T];
        if (value === null || value === undefined) return false;
        
        try {
          return value.toString().toLowerCase().includes(filterValue.toLowerCase());
        } catch (error) {
          console.warn('DataTable: Error converting value to string:', value, error);
          return false;
        }
      });
    });
  }, [sortedData, filterValue, columns]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = currentPage * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleExport = () => {
    try {
      // Create CSV content with null safety
      const headers = columns
        .filter(col => typeof col.key === 'string' ? col.key in (filteredData[0] || {}) : true)
        .map((col) => col.title)
        .join(',');
      
      const rows = filteredData.map((item) =>
        columns
          .filter(col => typeof col.key === 'string' ? col.key in item : true)
          .map((col) => {
            try {
              // Skip custom render functions for export
              if (col.render && typeof col.key === 'string' && !(col.key in item)) {
                return '""';
              }
              
              const value = item[col.key as keyof T] ?? '';
              const cleanValue = String(value).replace(/"/g, '""').replace(/\n/g, ' ');
              return `"${cleanValue}"`;
            } catch (error) {
              console.warn('DataTable: Error processing value for export:', error);
              return '""';
            }
          })
          .join(',')
      );
      const csvContent = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `data_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('DataTable: Error exporting data:', error);
      alert('Error al exportar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (column: TableColumn<T>) => {
    if (!column.sortable || !sorting) return null;
    if (sortConfig.key !== column.key) return <ChevronDown className="w-4 h-4 opacity-0" />;
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Safe value renderer - FIXED to handle custom columns properly
  const renderCellValue = (column: TableColumn<T>, row: T, rowIndex: number) => {
    try {
      // If column has a render function, use it
      if (column.render) {
        // Pass the value (or row for custom columns) and the full row
        const isCustomColumn = typeof column.key === 'string' && !(column.key in row);
        const value = isCustomColumn ? row : row[column.key as keyof T];
        return column.render(value, row);
      }
      
      // For columns without render functions
      // Check if this is a custom column (not in the data object)
      if (typeof column.key === 'string' && !(column.key in row)) {
        return <span className="text-gray-400">N/A</span>;
      }
      
      const value = row[column.key as keyof T];
      if (value === null || value === undefined) {
        return <span className="text-gray-400">N/A</span>;
      }
      
      return String(value);
    } catch (error) {
      console.error(`DataTable: Error rendering cell for column ${String(column.key)}, row ${rowIndex}:`, error);
      return <span className="text-red-400">Error</span>;
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${className}`}>
      {/* Header with filter and export */}
      {(filtering || exportable) && (
        <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          {filtering && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
          )}
          {exportable && (
            <button
              onClick={handleExport}
              disabled={filteredData.length === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable && sorting ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, columnIndex) => (
                    <td 
                      key={`${String(column.key)}-${columnIndex}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                    >
                      {renderCellValue(column, row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
            </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{currentPage * pageSize + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * pageSize, filteredData.length)}
                </span>{' '}
                de <span className="font-medium">{filteredData.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronDown className="h-5 w-5 transform rotate-90" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i;
                  } else if (currentPage <= 2) {
                    page = i;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 5 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronDown className="h-5 w-5 transform -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;