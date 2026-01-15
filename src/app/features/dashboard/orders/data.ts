export const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'Procesando' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'created', label: 'Creada' },
  { value: 'shipping', label: 'En Envío' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'paid_pending_review', label: 'Pago Pendiente Revisión' },
]

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  created: 'bg-gray-100 text-gray-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  paid_pending_review: 'bg-orange-100 text-orange-800',
}

export const allStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid_pending_review', label: 'Procesando Pago' },
  { value: 'shipping', label: 'En Envío' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
]

// Función para obtener los estados válidos según el estado actual
export const getValidStatusOptions = (currentStatus: string) => {
  switch (currentStatus) {
    case 'pending':
      // Las órdenes pendientes no deberían cambiarse manualmente
      // (esperan confirmación de Payphone), pero permitimos cancelar
      return [{ value: 'cancelled', label: 'Cancelada' }]
    case 'paid_pending_review':
      // Después de revisar el comprobante, puede aprobarse o cancelarse
      return [
        { value: 'shipping', label: 'En Envío' },
        { value: 'cancelled', label: 'Cancelada' },
      ]
    case 'shipping':
      // Cuando está en envío, puede completarse o cancelarse
      return [
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' },
      ]
    case 'completed':
    case 'cancelled':
      // Estados finales, no se pueden cambiar
      return []
    default:
      // Para cualquier otro estado, permitir cambiar a estados válidos
      return allStatusOptions.filter((opt) => opt.value !== currentStatus)
  }
}
