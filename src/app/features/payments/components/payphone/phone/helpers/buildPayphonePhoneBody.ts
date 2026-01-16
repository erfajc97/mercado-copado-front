/**
 * Construye el body para la petición de pago por teléfono de Payphone
 */
export const buildPayphonePhoneBody = (params: {
  phoneNumber: string
  clientTransactionId: string
  amount: number
}): {
  phoneNumber: string
  countryCode: string
  clientTransactionId: string
  reference: string
  amount: number
  amountWithoutTax: number
  storeId: string
} => {
  return {
    phoneNumber: params.phoneNumber,
    countryCode: '593',
    clientTransactionId: params.clientTransactionId,
    reference: `Compra en Mercado Copado - Transacción ${params.clientTransactionId.slice(0, 8)}`,
    amount: Math.round(params.amount * 100),
    amountWithoutTax: Math.round(params.amount * 100),
    storeId: import.meta.env.VITE_STORE_ID || '',
  }
}
