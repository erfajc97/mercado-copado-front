import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAllOrdersQuery, useMyOrdersQuery } from '../queries/useOrdersQuery'
import {
  getPaymentButtonText,
  isPaymentButtonDisabled,
} from '../helpers/calculatePaymentCooldown'
import { usePaymentVerificationHook } from './usePaymentVerificationHook'
import { useCurrency } from '@/app/hooks/useCurrency'
import { useAuthStore } from '@/app/store/auth/authStore'
import { getAddressesService } from '@/app/features/addresses/services/getAddressesService'
import { getPaymentMethodsService } from '@/app/features/payment-cards/services/getPaymentMethodsService'

const pageSize = 10

export const useOrdersHook = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<any>(null)
  const [isPaymentRetryModalOpen, setIsPaymentRetryModalOpen] = useState(false)
  const { formatPrice, currency } = useCurrency()
  const { roles } = useAuthStore()
  const isAdmin = roles === 'ADMIN'

  // Usar query apropiada según el rol
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = isAdmin
    ? useAllOrdersQuery({
        page: currentPage,
        limit: pageSize,
      })
    : useMyOrdersQuery({
        page: currentPage,
        limit: pageSize,
      })

  // Actualizar el tiempo cada segundo para el countdown en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Obtener direcciones y métodos de pago para el modal de retry
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddressesService,
  })

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethodsService,
  })

  // Extraer órdenes y paginación de la respuesta
  // Asegurar que orders siempre sea un array
  const orders = Array.isArray(ordersData)
    ? ordersData
    : Array.isArray(ordersData?.content)
      ? ordersData.content
      : []
  const pagination = ordersData?.pagination

  // Usar hook de verificación de pagos
  usePaymentVerificationHook({
    orders,
    currentPage,
    refetch,
  })

  const handleViewProducts = (order: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handlePayNow = (order: any) => {
    setSelectedOrderForPayment(order)
    setIsPaymentRetryModalOpen(true)
  }

  const handleClosePaymentRetryModal = () => {
    setIsPaymentRetryModalOpen(false)
    setSelectedOrderForPayment(null)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Calcular si el botón de pago debe estar deshabilitado
  const checkPaymentButtonDisabled = (order: any) => {
    return isPaymentButtonDisabled(order.createdAt, currentTime)
  }

  // Obtener el texto del botón de pago
  const getPaymentButtonTextForOrder = (order: any) => {
    return getPaymentButtonText(order.createdAt, currentTime)
  }

  return {
    orders,
    pagination,
    isLoading,
    currentPage,
    currentTime,
    selectedOrder,
    isModalOpen,
    selectedOrderForPayment,
    isPaymentRetryModalOpen,
    addresses,
    paymentMethods,
    formatPrice,
    currency,
    isAdmin,
    handleViewProducts,
    handleCloseModal,
    handlePayNow,
    handleClosePaymentRetryModal,
    handlePageChange,
    checkPaymentButtonDisabled,
    getPaymentButtonTextForOrder,
    refetch,
  }
}
