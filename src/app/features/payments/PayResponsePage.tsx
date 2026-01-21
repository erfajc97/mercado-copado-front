import { useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePayResponsePageHook } from './hooks/usePayResponsePageHook'
import {
  PaymentConfirmedState,
  PaymentErrorState,
  PaymentMissingParamsState,
  PaymentPendingState,
  PaymentProcessingState,
  PaymentRejectedState,
} from './components/payResponse'

interface PayResponsePageProps {
  id: string
  clientTransactionId: string
  from?: string
  mpStatus?: string
  externalReference?: string
  mpPaymentId?: string // ID del pago en Mercado Pago
}

/**
 * Página de respuesta de pago.
 * Muestra el estado del pago y redirige según corresponda.
 */
export const PayResponsePage = ({
  id,
  clientTransactionId,
  from,
  mpStatus,
  externalReference,
  mpPaymentId,
}: PayResponsePageProps) => {
  const navigate = useNavigate()
  const {
    isPending,
    hasRequiredParams,
    paymentConfirmed,
    paymentPending,
    paymentRejected,
    errorMessage,
  } = usePayResponsePageHook({
    id,
    clientTransactionId,
    from,
    mpStatus,
    externalReference,
    mpPaymentId,
  })

  // Handlers de navegación
  const goHome = useCallback(() => navigate({ to: '/' }), [navigate])
  const goToOrders = useCallback(() => navigate({ to: '/orders' }), [navigate])
  const goToCheckout = useCallback(
    () => navigate({ to: '/checkout' }),
    [navigate],
  )
  const handleRetry = useCallback(() => window.location.reload(), [])

  // Redirección automática después de 3 segundos cuando el pago es exitoso
  useEffect(() => {
    if (paymentConfirmed) {
      const timer = setTimeout(goToOrders, 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentConfirmed, goToOrders])

  // Mercado Pago: pago pendiente → /orders en 3 s
  useEffect(() => {
    if (paymentPending) {
      const timer = setTimeout(goToOrders, 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentPending, goToOrders])

  // Mercado Pago: pago rechazado → /checkout en 3 s
  useEffect(() => {
    if (paymentRejected) {
      const timer = setTimeout(goToCheckout, 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentRejected, goToCheckout])

  // Renderizar según el estado
  if (!hasRequiredParams) {
    return <PaymentMissingParamsState onGoHome={goHome} />
  }

  if (errorMessage && !isPending) {
    return (
      <PaymentErrorState
        errorMessage={errorMessage}
        onGoToOrders={goToOrders}
        onRetry={handleRetry}
      />
    )
  }

  if (isPending) {
    return <PaymentProcessingState message="Procesando respuesta de pago..." />
  }

  if (paymentConfirmed) {
    return (
      <PaymentConfirmedState onGoHome={goHome} onGoToOrders={goToOrders} />
    )
  }

  if (paymentPending) {
    return <PaymentPendingState onGoHome={goHome} onGoToOrders={goToOrders} />
  }

  if (paymentRejected) {
    return (
      <PaymentRejectedState
        onGoToCheckout={goToCheckout}
        onGoToOrders={goToOrders}
      />
    )
  }

  return <PaymentProcessingState />
}
