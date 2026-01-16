/**
 * Construye el body para la petición de link de pago de Payphone
 */
export const buildPayphoneLinkBody = (params: {
  clientTransactionId: string
  amount: number
}): {
  clientTransactionId: string
  reference: string
  amount: number
  responseUrl: string
  amountWithoutTax: number
  storeId: string
} => {
  const amountInCents = Math.round(params.amount * 100)
  return {
    clientTransactionId: params.clientTransactionId,
    reference: 'Compra en Mercado Copado',
    amount: amountInCents,
    responseUrl: `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/pay-response?id=${params.clientTransactionId}&clientTransactionId=${params.clientTransactionId}`,
    amountWithoutTax: amountInCents,
    storeId: import.meta.env.VITE_STORE_ID || '',
  }
}
