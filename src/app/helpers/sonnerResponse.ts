import { toast } from 'sonner'

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

export const sonnerResponse = (
  message: string,
  type: 'success' | 'error' | 'loading',
  options?: {
    description?: string
    duration?: number
    icon?: React.ReactNode
    className?: string
    position?: Position
  },
) => {
  const defaultOptions = {
    duration: 3000,
    position: 'top-right' as Position,
    ...options,
  }

  switch (type) {
    case 'success':
      toast.success(message, defaultOptions)
      break
    case 'error':
      toast.error(message, defaultOptions)
      break
    case 'loading':
      toast.loading(message, { ...defaultOptions, duration: 2000 })
      break
  }
}
