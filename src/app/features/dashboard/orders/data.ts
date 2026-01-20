export const allStatusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Creada', value: 'created' },
  { label: 'Procesando', value: 'processing' },
  { label: 'En Envío', value: 'shipping' },
  { label: 'Completada', value: 'completed' },
  { label: 'Entregada', value: 'delivered' },
  { label: 'Cancelada', value: 'cancelled' },
  { label: 'Pago en Revisión', value: 'paid_pending_review' },
]

export const getValidStatusOptions = (currentStatus: string) => {
  const statusFlow: Record<string, Array<string>> = {
    pending: ['shipping', 'completed', 'cancelled'],
    created: ['shipping', 'completed', 'cancelled'],
    processing: ['shipping', 'completed', 'cancelled'],
    shipping: ['completed', 'delivered', 'cancelled'],
    paid_pending_review: ['shipping', 'completed', 'cancelled'],
    completed: ['delivered'],
    delivered: [],
    cancelled: [],
  }

  // Estados que solo se asignan automáticamente, no manualmente
  const automaticOnlyStatuses = ['processing', 'paid_pending_review']

  const validStatuses = statusFlow[currentStatus] ?? []
  return allStatusOptions.filter(
    (option) =>
      validStatuses.includes(option.value) &&
      !automaticOnlyStatuses.includes(option.value),
  )
}

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  created: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipping: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  paid_pending_review: 'bg-orange-100 text-orange-800',
}

export const statusOptions = allStatusOptions
