/**
 * Valida un número de teléfono
 * @returns Objeto con isValid y errorMessage opcional
 */
export const validatePhoneNumber = (
  phoneNumber: string,
): { isValid: boolean; errorMessage?: string } => {
  const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '')

  if (!cleanPhoneNumber || cleanPhoneNumber.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Por favor ingresa un número de teléfono válido',
    }
  }

  if (cleanPhoneNumber.length > 10) {
    return {
      isValid: false,
      errorMessage: 'El número de teléfono debe tener máximo 10 dígitos',
    }
  }

  if (cleanPhoneNumber.length < 9) {
    return {
      isValid: false,
      errorMessage: 'El número de teléfono debe tener al menos 9 dígitos',
    }
  }

  return { isValid: true }
}
