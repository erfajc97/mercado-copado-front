import { Form, Input } from 'antd'
import type { FormInstance } from 'antd'

interface FormPasswordProps {
  form: FormInstance
  onFinish: (values: any) => Promise<void>
  isLoading: boolean
}

export const FormPassword = ({
  form,
  onFinish,
  isLoading,
}: FormPasswordProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-4 mt-2"
    >
      <div className="mb-3">
        <Form.Item
          name="currentPassword"
          label="Contraseña Actual"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa tu contraseña actual',
            },
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <Form.Item
          name="newPassword"
          label="Nueva Contraseña"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa una nueva contraseña',
            },
            {
              min: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirmar Nueva Contraseña"
          rules={[
            {
              required: true,
              message: 'Por favor confirma tu nueva contraseña',
            },
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
      </div>

      <Form.Item>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-coffee text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 border-none"
        >
          {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </Form.Item>
    </Form>
  )
}
