/**
 * Calcula si el botón de pago debe estar deshabilitado (cooldown de 2 minutos)
 */
export const isPaymentButtonDisabled = (
  orderCreatedAt: string | Date,
  currentTime: number,
): boolean => {
  if (!orderCreatedAt) return true
  const orderCreatedAtTime = new Date(orderCreatedAt).getTime()
  const twoMinutesInMs = 2 * 60 * 1000
  const timeSinceCreation = currentTime - orderCreatedAtTime
  return timeSinceCreation < twoMinutesInMs
}

/**
 * Obtiene el texto del botón de pago (con countdown si está en cooldown)
 */
export const getPaymentButtonText = (
  orderCreatedAt: string | Date,
  currentTime: number,
): string => {
  if (!orderCreatedAt) return 'Pagar ahora'
  const orderCreatedAtTime = new Date(orderCreatedAt).getTime()
  const twoMinutesInMs = 2 * 60 * 1000
  const timeSinceCreation = currentTime - orderCreatedAtTime
  const remainingTime = twoMinutesInMs - timeSinceCreation

  if (remainingTime > 0) {
    const remainingSeconds = Math.ceil(remainingTime / 1000)
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    return `Espera ${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return 'Pagar ahora'
}
