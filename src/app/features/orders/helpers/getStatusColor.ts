export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    created: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipping: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    paid_pending_review: 'bg-orange-100 text-orange-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
