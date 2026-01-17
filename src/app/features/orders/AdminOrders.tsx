import { useAdminOrdersHook } from './hooks/useAdminOrdersHook'
import { OrdersTable } from './components/OrdersTable'
import { OrdersFilters } from './components/OrdersFilters'

export function AdminOrders() {
  const {
    orders,
    isLoading,
    page,
    totalPages,
    searchText,
    statusFilter,
    formatDate,
    handleViewOrder,
    setPage,
    handleSearchChange,
    handleStatusFilterChange,
  } = useAdminOrdersHook()

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestión de Órdenes</h2>
      </div>

      <OrdersFilters
        searchText={searchText}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewOrder={handleViewOrder}
        formatDate={formatDate}
      />
    </div>
  )
}
