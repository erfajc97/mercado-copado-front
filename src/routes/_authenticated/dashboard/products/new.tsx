import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Form } from 'antd'
import ProductForm from '@/app/features/products/components/ProductForm'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/_authenticated/dashboard/products/new')({
  beforeLoad: ({ context }) => {
    // Intentar usar context.auth primero, si no está disponible leer del store
    const auth = context.auth
    let roles: string
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (auth?.roles) {
      roles = auth.roles
    } else {
      // Fallback: leer directamente del store
      const store = useAuthStore.getState()
      roles = store.roles || ''
    }
    // Verificar que el rol sea ADMIN (la autenticación ya está verificada por el layout padre)
    const normalizedRole = String(roles || '')
      .toUpperCase()
      .trim()
    if (normalizedRole !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: NewProduct,
})

function NewProduct() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: '/dashboard/products' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ProductForm form={form} onSuccess={handleSuccess} />
    </div>
  )
}
