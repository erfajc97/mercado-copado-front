import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'

type AuthMode = 'login' | 'register' | 'forgot-password'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Resetear el modo cuando cambia initialMode o cuando se cierra el modal
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSuccess = () => {
    onClose()
    setMode('login')
  }

  const handleSwitchToRegister = () => {
    setMode('register')
  }

  const handleSwitchToLogin = () => {
    setMode('login')
  }

  const handleSwitchToForgotPassword = () => {
    setMode('forgot-password')
  }

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Iniciar Sesión'
      case 'register':
        return 'Registrarse'
      case 'forgot-password':
        return 'Recuperar Contraseña'
      default:
        return 'Iniciar Sesión'
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      styles={{
        body: {
          borderRadius: '12px',
        },
      }}
    >
      <div className="py-4">
        <h2 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
          {getTitle()}
        </h2>

        {mode === 'login' && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        )}

        {mode === 'register' && (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}

        {mode === 'forgot-password' && (
          <ForgotPasswordForm
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </Modal>
  )
}
