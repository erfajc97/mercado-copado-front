import { Button, Form, Input } from 'antd'
import { useForgotPasswordHook } from '../hooks/useForgotPasswordHook'

interface ForgotPasswordFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export default function ForgotPasswordForm({
  onSuccess,
  onSwitchToLogin,
}: ForgotPasswordFormProps) {
  const { handleForgotPassword, isPending, emailSent } =
    useForgotPasswordHook({ onSuccess })
  const [form] = Form.useForm()

  const onFinish = async (values: { email: string }) => {
    await handleForgotPassword(values)
  }

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-coffee-darker mb-2">
            Correo enviado
          </h3>
          <p className="text-gray-600 mb-4">
            Revisa tu bandeja de entrada y sigue las instrucciones para
            recuperar tu contraseña.
          </p>
        </div>
        <Button
          type="primary"
          onClick={onSwitchToLogin}
          className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg"
        >
          Volver al inicio de sesión
        </Button>
      </div>
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      className="space-y-4"
    >
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          Ingresa tu correo electrónico y te enviaremos un enlace para recuperar
          tu contraseña.
        </p>
      </div>

      <Form.Item
        name="email"
        label="Correo electrónico"
        rules={[
          { required: true, message: 'Por favor ingresa tu correo' },
          { type: 'email', message: 'Correo electrónico inválido' },
        ]}
      >
        <Input
          size="large"
          placeholder="correo@ejemplo.com"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          block
          size="large"
          className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-12 font-semibold"
        >
          Enviar correo de recuperación
        </Button>
      </Form.Item>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-coffee-medium hover:text-coffee-dark font-semibold"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </Form>
  )
}
