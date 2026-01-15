import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Input, Select, Table } from 'antd'
import { Eye, RefreshCw, Search } from 'lucide-react'
import { statusColors, statusOptions } from './data'
import type { ColumnsType } from 'antd/es/table'
import { useAllOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { getStatusTransactionService } from '@/app/features/payments/services/getStatusTransactionService'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export function OrdersDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [userFilter, setUserFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')

  const {
    data: ordersData,
    isLoading,
    refetch,
    error: queryError,
  } = useAllOrdersQuery({
    page: currentPage,
    limit: pageSize,
  })

  // Log para depuración
  useEffect(() => {
    console.log('[Dashboard] Estado de la query:', {
      isLoading,
      hasData: !!ordersData,
      ordersData,
      queryError,
    })
  }, [isLoading, ordersData, queryError])
  const { formatPrice, currency } = useCurrency()
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatusMutation()
  const queryClient = useQueryClient()
  const [isVerifying, setIsVerifying] = useState(false)

  // Procesar los datos de órdenes (pueden venir como array o con paginación)
  const allOrders = useMemo(() => {
    console.log('[Dashboard] ordersData recibido:', ordersData)
    if (!ordersData) {
      console.log('[Dashboard] No hay ordersData')
      return []
    }
    if (Array.isArray(ordersData)) {
      console.log(
        '[Dashboard] ordersData es array, longitud:',
        ordersData.length,
      )
      return ordersData
    }
    if (ordersData.content && Array.isArray(ordersData.content)) {
      console.log(
        '[Dashboard] ordersData tiene content, longitud:',
        ordersData.content.length,
      )
      return ordersData.content
    }
    console.log(
      '[Dashboard] ordersData no tiene estructura esperada:',
      ordersData,
    )
    return []
  }, [ordersData])
  const pagination = ordersData?.pagination

  // Función para verificar el estado de un pago
  const handleVerifyPaymentStatus = async (
    clientTransactionId: string,
    payment?: any,
  ) => {
    if (!clientTransactionId) return false

    try {
      // Extraer paymentId de payphoneData si existe (para pagos por link)
      const payphoneData = payment?.payphoneData as
        | { paymentId?: string }
        | null
        | undefined
      const paymentId = payphoneData?.paymentId

      const response = await getStatusTransactionService(
        clientTransactionId,
        paymentId,
      )
      const { statusCode } = response

      if (statusCode === 3) {
        // Pago completado - actualizar estado
        await updatePaymentStatus({
          clientTransactionId,
          status: 'completed',
        })
        return true
      }
      return false
    } catch (verifyError) {
      console.error(
        'Error al verificar el estado de la transacción:',
        clientTransactionId,
        verifyError,
      )
      return false
    }
  }

  // Filtrar órdenes según los filtros aplicados
  const filteredOrders = useMemo(() => {
    // Asegurar que allOrders sea un array
    if (!Array.isArray(allOrders)) {
      return []
    }
    let filtered = [...allOrders]

    // Filtrar por búsqueda (ID de orden o email de usuario)
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (order: any) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower),
      )
    }

    // Filtrar por estado
    if (statusFilter) {
      filtered = filtered.filter((order: any) => order.status === statusFilter)
    }

    // Filtrar por usuario (email)
    if (userFilter) {
      filtered = filtered.filter((order: any) =>
        order.user?.email?.toLowerCase().includes(userFilter.toLowerCase()),
      )
    }

    // Filtrar por fecha (formato: YYYY-MM-DD)
    if (dateFilter) {
      filtered = filtered.filter((order: any) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        return orderDate === dateFilter
      })
    }

    // Ordenar por fecha descendente (más recientes primero)
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return filtered
  }, [allOrders, searchText, statusFilter, userFilter, dateFilter])

  // Función para verificar todos los pagos pendientes
  const handleVerifyAllPendingPayments = async () => {
    if (!Array.isArray(allOrders) || allOrders.length === 0) return

    setIsVerifying(true)
    let verifiedCount = 0

    try {
      // Filtrar órdenes pendientes que tengan payments con clientTransactionId
      const pendingOrders = allOrders.filter(
        (order: any) =>
          (order.status === 'pending' || order.status === 'processing') &&
          order.payments &&
          order.payments.length > 0,
      )

      if (pendingOrders.length === 0) {
        sonnerResponse('No hay órdenes pendientes para verificar', 'success')
        setIsVerifying(false)
        return
      }

      // Verificar cada orden pendiente
      for (const order of pendingOrders) {
        const payment = order.payments.find(
          (p: any) => p.clientTransactionId && p.status === 'pending',
        )

        if (payment?.clientTransactionId) {
          // Verificar que payphoneData tenga paymentId si es un pago por link
          const payphoneData = payment.payphoneData as
            | { paymentId?: string }
            | null
            | undefined

          // Asegurar que clientTransactionId sea el valor completo, no cortado
          const fullClientTransactionId = String(payment.clientTransactionId)
          console.log(
            `[Dashboard] clientTransactionId completo: "${fullClientTransactionId}", longitud: ${fullClientTransactionId.length}`,
          )

          // Si es un pago por link (tiene paymentId), verificar con el endpoint correcto
          if (payphoneData?.paymentId) {
            console.log(
              `[Dashboard] Verificando pago por link - paymentId: ${payphoneData.paymentId}, clientTransactionId: ${fullClientTransactionId}`,
            )
          } else {
            console.log(
              `[Dashboard] Verificando pago por teléfono - clientTransactionId: ${fullClientTransactionId}`,
            )
          }

          const wasVerified = await handleVerifyPaymentStatus(
            fullClientTransactionId,
            payment,
          )
          if (wasVerified) {
            verifiedCount++
          }
        }
      }

      if (verifiedCount > 0) {
        // Invalidar queries para refrescar los datos
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
        refetch()
        sonnerResponse(
          `${verifiedCount} pago(s) verificado(s) y actualizado(s)`,
          'success',
        )
      } else {
        sonnerResponse(
          'No se encontraron pagos completados para actualizar',
          'success',
        )
      }
    } catch (verifyAllError) {
      console.error('Error al verificar pagos:', verifyAllError)
      sonnerResponse('Error al verificar los pagos', 'error')
    } finally {
      setIsVerifying(false)
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span className="font-mono text-sm">#{id.slice(0, 8)}</span>
      ),
    },
    {
      title: 'Usuario',
      key: 'user',
      render: (_, record: any) => (
        <span className="text-sm">{record.user?.email || 'N/A'}</span>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">
            {formatUSD(Number(record.total))}
          </span>
          {currency === 'ARS' && (
            <span className="text-xs text-gray-500">
              {formatPrice(Number(record.total))}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusLabel =
          statusOptions.find((opt) => opt.value === status)?.label || status
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusLabel}
          </span>
        )
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record: any) => (
        <Link
          to="/_authenticated/admin/orders/$orderId"
          params={{ orderId: record.id }}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <Eye size={16} />
          Ver
        </Link>
      ),
    },
  ]

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Todas las Órdenes</h2>
        <Button
          type="default"
          icon={<RefreshCw size={16} />}
          onClick={handleVerifyAllPendingPayments}
          loading={isVerifying}
          className="bg-gradient-coffee border-none hover:opacity-90 text-white"
        >
          Verificar Pagos Pendientes
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            size="large"
            placeholder="Buscar por ID o email..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1)
            }}
            allowClear
          />
          <Select
            size="large"
            placeholder="Filtrar por estado"
            value={statusFilter || undefined}
            onChange={(value) => {
              setStatusFilter(value || '')
              setCurrentPage(1)
            }}
            allowClear
            className="w-full"
          >
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <Input
            size="large"
            placeholder="Filtrar por usuario (email)"
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value)
              setCurrentPage(1)
            }}
            allowClear
          />
          <Input
            size="large"
            type="date"
            placeholder="Filtrar por fecha"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Tabla de órdenes */}
      {isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredOrders}
            loading={isLoading}
            rowKey="id"
            scroll={{ x: 800 }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: pagination?.total || filteredOrders.length,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} órdenes`,
              onChange: (newPage, newPageSize) => {
                setCurrentPage(newPage)
                setPageSize(newPageSize)
              },
            }}
          />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
          {searchText || statusFilter || userFilter || dateFilter
            ? 'No se encontraron órdenes con los filtros aplicados'
            : 'No hay órdenes'}
        </div>
      )}
    </div>
  )
}
