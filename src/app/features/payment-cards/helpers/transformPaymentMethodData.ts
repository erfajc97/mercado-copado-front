/**
 * Transforma los datos del formulario de método de pago al formato esperado por la API
 */
export const transformPaymentMethodData = (values: {
  expirationDate?: string
  gatewayToken?: string
  cardBrand?: string
  last4Digits: string
  isDefault?: boolean
}): {
  gatewayToken: string
  cardBrand: string
  last4Digits: string
  expirationMonth: number
  expirationYear: number
  isDefault?: boolean
} => {
  const expirationDate = values.expirationDate?.split('/')
  return {
    gatewayToken: values.gatewayToken || 'temp-token',
    cardBrand: values.cardBrand || 'Visa',
    last4Digits: values.last4Digits,
    expirationMonth: expirationDate ? parseInt(expirationDate[0]) : 12,
    expirationYear: expirationDate
      ? 2000 + parseInt(expirationDate[1])
      : 2025,
    isDefault: values.isDefault,
  }
}
