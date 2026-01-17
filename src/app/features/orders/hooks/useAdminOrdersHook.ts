import { useMemo, useState } from 'react'
import { useAllOrdersQuery } from '../queries/useOrdersQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { extractItems, extractPagination } from '@/app/helpers/parsePaginatedResponse'

const pageSize = 10

export const useAdminOrdersHook = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const { formatPrice, currency } = useCurrency()

  const { data: ordersData, isLoading } = useAllOrdersQuery({
    search: searchText || undefined,
    status: statusFilter || undefined,
    page,
    limit: pageSize,
  })

  const orders = useMemo(() => {
    if (!ordersData) return []
    return extractItems(ordersData)
  }, [ordersData])

  const pagination = useMemo(() => {
    if (!ordersData) return undefined
    return extractPagination(ordersData)
  }, [ordersData])

  const totalPages = pagination?.totalPages || 1

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewOrder = (orderId: string) => {
    // Navegar a la página de detalle de la orden
    window.location.href = `/dashboard/orders/${orderId}`
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
    setPage(1) // Resetear a la primera página al buscar
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setPage(1) // Resetear a la primera página al filtrar
  }

  return {
    orders,
    isLoading,
    page,
    totalPages,
    searchText,
    statusFilter,
    formatPrice,
    currency,
    formatDate,
    handleViewOrder,
    setPage,
    handleSearchChange,
    handleStatusFilterChange,
  }
}
