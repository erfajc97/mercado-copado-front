/**
 * Genera un ID de transacción único
 */
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}
