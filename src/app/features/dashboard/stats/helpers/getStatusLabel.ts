export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    created: 'Creada',
    processing: 'Procesando',
    shipping: 'En Envío',
    completed: 'Completada',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
    paid_pending_review: 'Pago en Revisión',
  }
  return statusMap[status] || status
}
