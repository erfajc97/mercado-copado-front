/**
 * Formatea la fecha de una orden para mostrar en la lista
 */
export const formatOrderDateShort = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea la fecha de una orden con hora para mostrar en detalle
 */
export const formatOrderDateFull = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
