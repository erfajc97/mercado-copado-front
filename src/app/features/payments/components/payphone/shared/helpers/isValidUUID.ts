/**
 * Valida si una cadena es un UUID válido
 */
export const isValidUUID = (str: string | undefined): boolean => {
  if (!str || str === '' || str === 'payphone-default') return false
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}
