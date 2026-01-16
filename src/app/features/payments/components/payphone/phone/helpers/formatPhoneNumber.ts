/**
 * Formatea un número de teléfono para enviarlo a Payphone
 * Elimina espacios, caracteres no numéricos y el 0 inicial si existe
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '')
  return cleanPhoneNumber.startsWith('0')
    ? cleanPhoneNumber.substring(1)
    : cleanPhoneNumber
}
