import { createFileRoute, useSearch } from '@tanstack/react-router'
import { PayResponsePage } from '@/app/features/payments/PayResponsePage'

export const Route = createFileRoute('/pay-response/')({
  component: () => {
    const search = useSearch({
      strict: false,
    })

    // Extraer id - Payphone puede agregar su propio id numérico a la URL
    // La URL puede ser: /pay-response?id=xxx&clientTransactionId=xxx&id=75999465
    let id = ''
    const idParam = (search as any).id

    if (Array.isArray(idParam)) {
      // Si hay múltiples ids, usar el numérico (el que Payphone agrega)
      id =
        idParam.find((val: string) => !isNaN(Number(val))) ||
        idParam[idParam.length - 1]
    } else if (idParam) {
      // Si es string, verificar si es numérico
      if (!isNaN(Number(idParam))) {
        id = idParam
      } else {
        // Si no es numérico, intentar obtener el último id de la URL completa
        const urlParams = new URLSearchParams(window.location.search)
        const allIds = urlParams.getAll('id')
        id =
          allIds.find((val) => !isNaN(Number(val))) ||
          allIds[allIds.length - 1] ||
          idParam
      }
    }

    // Extraer clientTransactionId - puede venir como array si hay duplicados
    let clientTransactionId = ''
    const clientTxIdParam = (search as any).clientTransactionId

    if (Array.isArray(clientTxIdParam)) {
      // Si hay múltiples, usar el primero (todos deberían ser iguales)
      clientTransactionId = clientTxIdParam[0] || ''
    } else if (clientTxIdParam) {
      clientTransactionId = String(clientTxIdParam)
    } else {
      // Si no está en search, intentar obtenerlo de la URL directamente
      const urlParams = new URLSearchParams(window.location.search)
      const allClientTxIds = urlParams.getAll('clientTransactionId')
      clientTransactionId = allClientTxIds[0] || ''
    }

    // Asegurar que ambos sean strings
    id = String(id)
    clientTransactionId = String(clientTransactionId)

    return <PayResponsePage id={id} clientTransactionId={clientTransactionId} />
  },
})
