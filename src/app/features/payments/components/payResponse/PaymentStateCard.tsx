import type { ReactNode } from 'react'

interface PaymentStateCardProps {
  children: ReactNode
}

/**
 * Contenedor base para los estados de pago.
 */
export const PaymentStateCard = ({ children }: PaymentStateCardProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        {children}
      </div>
    </div>
  )
}
