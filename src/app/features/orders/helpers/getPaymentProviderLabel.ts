/**
 * Devuelve la etiqueta legible del proveedor de pago.
 * Solo se debe mostrar cuando la orden ya no está pendiente.
 */
export function getPaymentProviderLabel(
  provider: string | undefined,
): string {
  if (!provider) return '—'
  switch (provider) {
    case 'PAYPHONE':
      return 'Payphone'
    case 'MERCADOPAGO':
      return 'Mercado Pago'
    case 'CASH_DEPOSIT':
      return 'Depósito en efectivo'
    case 'CRYPTO':
      return 'Crypto'
    default:
      return provider
  }
}
