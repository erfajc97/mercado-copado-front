import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Form } from 'antd'
import ProductForm from '@/app/features/products/components/ProductForm'

export const Route = createFileRoute('/dashboard/products/new')({
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
