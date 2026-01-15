import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { AlertCircle, CheckCircle2, CreditCard } from 'lucide-react'
import { useCurrency } from '@/app/hooks/useCurrency'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface PaymentPageProps {
  transactionId: string
  paymentLink?: string
}

export function PaymentPage({ transactionId, paymentLink }: PaymentPageProps) {
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  // Verificar si el paymentLink está presente
  useEffect(() => {
    if (!paymentLink) {
      sonnerResponse(
        'Link de pago no encontrado. Redirigiendo...',
        'error',
      )
      setTimeout(() => {
        navigate({ to: '/checkout' })
      }, 2000)
    }
  }, [paymentLink, navigate])

  // Abrir la ventana de pago automáticamente cuando se carga la página
  useEffect(() => {
    if (paymentLink && !paymentWindow && !paymentCompleted) {
      const windowRef = window.open(paymentLink, '_blank', 'noopener')
      setPaymentWindow(windowRef)

      // Verificar periódicamente si la ventana se cerró (indicando que el pago se completó)
      const checkInterval = setInterval(() => {
        if (windowRef && windowRef.closed) {
          clearInterval(checkInterval)
          setPaymentCompleted(true)
          sonnerResponse(
            'Pago completado. Redirigiendo a tus órdenes...',
            'success',
          )
          setTimeout(() => {
            navigate({ to: '/orders' })
          }, 2000)
        }
      }, 1000)

      return () => clearInterval(checkInterval)
    }
  }, [paymentLink, paymentWindow, paymentCompleted, navigate])

  if (!paymentLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            Link de pago no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            No se pudo generar el link de pago. Por favor, intenta nuevamente.
          </p>
          <Button
            type="primary"
            onClick={() => navigate({ to: '/checkout' })}
            className="bg-gradient-coffee border-none hover:opacity-90"
            size="large"
          >
            Volver al Checkout
          </Button>
        </div>
      </div>
    )
  }

  if (paymentCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg text-center">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            ¡Pago Completado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pago ha sido procesado exitosamente. Redirigiendo a tus órdenes...
          </p>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="text-coffee-medium" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-coffee-darker mb-2">
            Procesando tu Pago
          </h1>
          <p className="text-gray-600">
            Se ha abierto una nueva ventana para completar tu pago con Payphone.
          </p>
        </div>

        <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-coffee-medium shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-coffee-darker font-semibold mb-1">
                Instrucciones
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Completa el pago en la ventana que se abrió</li>
                <li>No cierres esta página hasta completar el pago</li>
                <li>Una vez completado, serás redirigido automáticamente</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (paymentWindow) {
                paymentWindow.focus()
              } else if (paymentLink) {
                window.open(paymentLink, '_blank', 'noopener')
              }
            }}
            className="flex-1"
            size="large"
          >
            Abrir Ventana de Pago
          </Button>
          <Button
            onClick={() => navigate({ to: '/checkout' })}
            className="flex-1"
            size="large"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
