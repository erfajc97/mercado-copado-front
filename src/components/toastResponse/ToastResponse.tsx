import { addToast } from '@heroui/react'

export const ToastResponse = (message: string, type: 'success' | 'error') => {
  addToast({
    title: message,
    color: type === 'error' ? 'danger' : 'success',
    timeout: 1000,
    radius: 'sm',
  })
}
