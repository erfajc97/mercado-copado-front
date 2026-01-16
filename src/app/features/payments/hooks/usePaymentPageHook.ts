import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getStatusTransactionService } from '../services/getStatusTransactionService'
import { useUpdatePaymentStatusMutation } from '../mutations/usePaymentMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UsePaymentPageHookProps {
  transactionId: string
  paymentLink?: string
  paymentId?: string
}

export const usePaymentPageHook = ({
  transactionId,
  paymentLink,
  paymentId,
}: UsePaymentPageHookProps) => {
  const navigate = useNavigate()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  // Verificar si el paymentLink está presente
  useEffect(() => {
    if (!paymentLink) {
      sonnerResponse('Link de pago no encontrado. Redirigiendo...', 'error')
      setTimeout(() => {
        navigate({ to: '/checkout' })
      }, 2000)
    }
  }, [paymentLink, navigate])

  // Verificar periódicamente el estado del pago usando transactionId
  useEffect(() => {
    if (!transactionId || paymentCompleted) return

    const checkPaymentStatus = async () => {
      try {
        const response = await getStatusTransactionService(
          transactionId,
          paymentId,
        )
        const { statusCode } = response

        if (statusCode === 3) {
          // Pago completado
          setPaymentCompleted(true)
          await updateStatusTransaction({
            clientTransactionId: transactionId,
            status: 'completed',
          })
          sonnerResponse(
            'Pago completado. Redirigiendo a tus órdenes...',
            'success',
          )
          setTimeout(() => {
            navigate({ to: '/orders' })
          }, 2000)
        }
      } catch (error) {
        // Error al verificar, pero no detener el proceso
        console.error('Error al verificar estado del pago:', error)
      }
    }

    // Verificar cada 3 segundos
    const statusInterval = setInterval(checkPaymentStatus, 3000)

    return () => clearInterval(statusInterval)
  }, [
    transactionId,
    paymentId,
    paymentCompleted,
    navigate,
    updateStatusTransaction,
  ])

  // Abrir la ventana de pago automáticamente cuando se carga la página
  useEffect(() => {
    if (paymentLink && !paymentWindow && !paymentCompleted) {
      const windowRef = window.open(paymentLink, '_blank', 'noopener')
      if (!windowRef) {
        sonnerResponse(
          'No se pudo abrir la ventana de pago. Por favor, verifica que los popups no estén bloqueados.',
          'error',
        )
        return
      }
      setPaymentWindow(windowRef)

      // Verificar periódicamente si la ventana se cerró (como respaldo)
      const checkInterval = setInterval(() => {
        if (windowRef.closed) {
          // Si la ventana se cerró, verificar el estado una vez más
          getStatusTransactionService(transactionId, paymentId)
            .then((response) => {
              if (response.statusCode === 3) {
                clearInterval(checkInterval)
                setPaymentCompleted(true)
                updateStatusTransaction({
                  clientTransactionId: transactionId,
                  status: 'completed',
                })
                sonnerResponse(
                  'Pago completado. Redirigiendo a tus órdenes...',
                  'success',
                )
                setTimeout(() => {
                  navigate({ to: '/orders' })
                }, 2000)
              }
            })
            .catch((error) => {
              console.error('Error al verificar estado del pago:', error)
            })
        }
      }, 1000)

      return () => clearInterval(checkInterval)
    }
  }, [
    paymentLink,
    paymentWindow,
    paymentCompleted,
    navigate,
    transactionId,
    paymentId,
    updateStatusTransaction,
  ])

  const handleOpenPaymentWindow = () => {
    if (paymentWindow) {
      paymentWindow.focus()
    } else if (paymentLink) {
      window.open(paymentLink, '_blank', 'noopener')
    }
  }

  const handleCancel = () => {
    navigate({ to: '/checkout' })
  }

  return {
    paymentWindow,
    paymentCompleted,
    handleOpenPaymentWindow,
    handleCancel,
  }
}
